import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  const { resolution_id, rating } = await request.json();
  const ip_address = request.headers.get('x-forwarded-for') || 'unknown';

  const allowVoting = db.prepare('SELECT value FROM settings WHERE key = ?').get('allow_voting') as { value: string };
  if (allowVoting.value !== 'true') {
    return NextResponse.json({ error: 'Voting is currently disabled' }, { status: 403 });
  }

  const stmt = db.prepare('INSERT INTO votes (resolution_id, ip_address, rating) VALUES (?, ?, ?)');
  const result = stmt.run(resolution_id, ip_address, rating);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

