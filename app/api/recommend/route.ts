import { NextRequest, NextResponse } from 'next/server';
import { executePipeline } from '@/lib/pipeline';

export const maxDuration = 30; // 30 seconds max execution
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await executePipeline(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          stages: result.stages,
        },
        { status: result.error?.includes('Invalid') ? 400 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      run: result.run,
      stages: result.stages,
      latency_ms: result.latency_ms,
    });
  } catch (err: any) {
    console.error('Recommend endpoint error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Server error',
      },
      { status: 500 }
    );
  }
}
