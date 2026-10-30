import { ResourceItem, LinkStatus } from './types';

/**
 * Checks a single URL with a HEAD request (or fallback GET).
 * Times out after 4000ms to keep pipeline responsive.
 */
export async function checkUrlIntegrity(url: string | null): Promise<{
  status: LinkStatus;
  httpCode: number | null;
  notes: string;
}> {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return {
      status: 'null_or_unverified',
      httpCode: null,
      notes: 'No direct URL provided (hallucination prevention active).',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (Learning-Resource-Verifier/1.0)',
    Accept: '*/*',
  };

  try {
    // 1. Try HEAD request first
    let res = await fetch(url, {
      method: 'HEAD',
      headers,
      signal: controller.signal,
      redirect: 'follow',
    });

    // Many modern web servers or academic proxies reject HEAD requests with 400, 403, 405, or 999.
    // In those cases, retry with a partial GET request to check true availability.
    if (res.status >= 400 && res.status !== 404 && res.status !== 410) {
      try {
        const getRes = await fetch(url, {
          method: 'GET',
          headers: { ...headers, Range: 'bytes=0-200' },
          signal: controller.signal,
          redirect: 'follow',
        });
        if (getRes.status >= 200 && getRes.status < 400) {
          res = getRes;
        }
      } catch (_) {}
    }

    clearTimeout(timeoutId);

    if (res.status >= 200 && res.status < 400) {
      return {
        status: 'verified_200',
        httpCode: res.status,
        notes: `Verified live link (HTTP ${res.status} OK).`,
      };
    } else if (res.status === 404 || res.status === 410) {
      return {
        status: 'dead_link',
        httpCode: res.status,
        notes: `Dead link encountered (HTTP ${res.status}). Fallback search enabled.`,
      };
    } else {
      return {
        status: 'dead_link',
        httpCode: res.status,
        notes: `Server returned error status HTTP ${res.status}.`,
      };
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    return {
      status: 'dead_link',
      httpCode: null,
      notes: isTimeout
        ? 'Verification timed out (>4s). Marked unverified.'
        : `Network/DNS resolution failed: ${err.message || 'Host unreachable'}`,
    };
  }
}

/**
 * Verifies all resources in parallel.
 */
export async function verifyAndDecorateResources(
  resources: ResourceItem[]
): Promise<ResourceItem[]> {
  const verifiedList = await Promise.all(
    resources.map(async (resource) => {
      const check = await checkUrlIntegrity(resource.url);

      const fallbackQuery = encodeURIComponent(`${resource.title} ${resource.type} official`);
      const fallbackSearchUrl = `https://www.google.com/search?q=${fallbackQuery}`;

      return {
        ...resource,
        link_status: check.status,
        http_code: check.httpCode,
        verification_notes: check.notes,
        fallback_search_url: fallbackSearchUrl,
      };
    })
  );

  return verifiedList;
}

