import { ExecutionProof, ResourceItem, RubricScores } from './types';

export interface DispatchNotificationParams {
  student_email: string;
  topic: string;
  proficiency: string;
  learning_goal: string;
  prompt_version: string;
  resources: ResourceItem[];
  rubric_scores: RubricScores;
  overall_score: number;
}

/**
 * Formats a clean HTML email template for the student.
 */
function buildEmailHtml(params: DispatchNotificationParams): string {
  const resourceRows = params.resources
    .map(
      (r) => `
    <div style="margin-bottom: 16px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
      <div style="font-size: 16px; font-weight: bold; color: #1e293b;">
        #${r.rank} ${r.title}
        <span style="font-size: 12px; font-weight: normal; color: #64748b; margin-left: 8px; text-transform: uppercase;">[${r.type}]</span>
      </div>
      <p style="margin: 6px 0; color: #475569; font-size: 14px;">${r.why_it_fits}</p>
      <div style="font-size: 13px; color: #0284c7; margin-top: 4px;">
        ${
          r.url
            ? `<a href="${r.url}" style="color: #0284c7; text-decoration: underline;" target="_blank">Access Resource</a> (${r.link_status === 'verified_200' ? '✓ Verified 200 OK' : '⚠ Flagged'})`
            : `<a href="${r.fallback_search_url}" style="color: #d97706; text-decoration: underline;" target="_blank">Search Resource on Google</a> (URL withheld to prevent hallucination)`
        }
        <span style="color: #64748b; margin-left: 12px;">Est: ${r.estimated_time}</span>
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; background: #f8fafc;">
      <h2 style="color: #0f172a; margin-bottom: 4px;">Personalized Learning Recommendations</h2>
      <p style="color: #64748b; font-size: 14px; margin-top: 0;">Target Subject: <strong>${params.topic}</strong> (${params.proficiency} Level)</p>
      <div style="background: #e0f2fe; padding: 10px 14px; border-radius: 6px; margin: 16px 0; font-size: 14px; color: #0369a1;">
        <strong>Goal:</strong> ${params.learning_goal}<br/>
        <strong>Quality Score:</strong> ${params.overall_score}/100 (Prompt ${params.prompt_version})
      </div>
      <h3 style="color: #334155; font-size: 15px; margin-bottom: 12px;">Top Ranked Learning Pathway:</h3>
      ${resourceRows}
      <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        Responsible AI Note: Verify resources before committing tuition or exams. Powered by Personalized Learning Resource Recommender.
      </p>
    </div>
  `;
}

/**
 * Dispatches email notification via Resend, n8n webhook, or simulated delivery proof logger.
 */
export async function dispatchAutomatedAction(
  params: DispatchNotificationParams
): Promise<ExecutionProof> {
  const { student_email, topic, overall_score } = params;
  const txId = `proof_tx_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // 1. Try Resend if real API key is provided
  const resendApiKey = process.env.RESEND_API_KEY;
  if (
    resendApiKey &&
    !resendApiKey.includes('your_resend_api_key') &&
    resendApiKey !== 'YOUR_RESEND_API_KEY' &&
    resendApiKey.startsWith('re_')
  ) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Sherpa <onboarding@resend.dev>',
          to: student_email,
          subject: `Your Sherpa Learning Guide: ${topic}`,
          html: buildEmailHtml(params),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          status: 'sent',
          channel: 'resend_email',
          recipient: student_email,
          timestamp: now,
          transaction_id: data.id || txId,
          details: `Live email delivered via Resend API to ${student_email}. Email ID: ${data.id || txId}`,
        };
      } else {
        const errBody = await res.text();
        console.warn(`Resend email dispatch rejected (HTTP ${res.status}): ${errBody}`);
        try {
          const errJson = JSON.parse(errBody);
          return {
            status: 'simulated',
            channel: 'local_proof_log',
            recipient: student_email,
            timestamp: now,
            transaction_id: txId,
            details: `Resend notice: ${errJson.message || errBody}. (On Resend's free tier, emails deliver to your registered Resend account email until a custom domain is verified at resend.com/domains).`,
          };
        } catch (_) {}
      }
    } catch (err: any) {
      console.warn('Resend email dispatch error:', err.message);
    }
  }

  // 2. Try n8n Webhook if configured
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nWebhookUrl && n8nWebhookUrl.startsWith('http')) {
    try {
      const res = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'LEARNING_RECOMMENDATIONS_GENERATED',
          recipient: student_email,
          topic,
          proficiency: params.proficiency,
          learning_goal: params.learning_goal,
          overall_quality_score: overall_score,
          resources: params.resources,
          timestamp: now,
        }),
      });

      if (res.ok) {
        return {
          status: 'sent',
          channel: 'n8n_webhook',
          recipient: student_email,
          timestamp: now,
          transaction_id: txId,
          details: `Dispatched to n8n automation pipeline (${n8nWebhookUrl}) for automated Gmail/Slack notification.`,
        };
      }
    } catch (err: any) {
      console.warn('n8n Webhook dispatch error:', err.message);
    }
  }

  // 3. Fallback: Logged Delivery Simulation with full proof record
  return {
    status: 'simulated',
    channel: 'local_proof_log',
    recipient: student_email,
    timestamp: now,
    transaction_id: txId,
    details: `Automated action executed (Proof Tx: ${txId}). Email content assembled (${params.resources.length} verified resources, Quality Score: ${overall_score}/100) and queued for ${student_email}. To send real external emails, set RESEND_API_KEY or N8N_WEBHOOK_URL in .env.`,
  };
}

