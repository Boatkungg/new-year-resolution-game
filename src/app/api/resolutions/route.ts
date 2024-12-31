import { NextResponse } from 'next/server';
import db from '@/lib/db';

interface Setting {
  value: string;
}

export async function POST(request: Request) {
  const { name, resolution } = await request.json();
  const ip_address = request.headers.get('x-forwarded-for') || 'unknown';

  const allowSubmissions = db.prepare('SELECT value FROM settings WHERE key = ?').get('allow_submissions') as Setting;
  if (allowSubmissions.value !== 'true') {
    return NextResponse.json({ error: 'Submissions are currently disabled' }, { status: 403 });
  }

  const stmt = db.prepare('INSERT INTO resolutions (name, resolution, ip_address) VALUES (?, ?, ?)');
  const result = stmt.run(name, resolution, ip_address);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

export async function GET() {
  const resolutions = db.prepare('SELECT id, resolution FROM resolutions').all();
  return NextResponse.json(resolutions);
}
