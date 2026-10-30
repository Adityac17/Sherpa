import { NextResponse } from 'next/server';
import { getRunsHistory } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const history = await getRunsHistory(20);
    return NextResponse.json({ success: true, history });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, history: [] },
      { status: 500 }
    );
  }
}

