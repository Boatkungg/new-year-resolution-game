import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAdmin } from '@/lib/auth';

interface Setting {
  key: string;
  value: string;
}

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = db.prepare('SELECT * FROM settings').all() as Setting[];
  return NextResponse.json(Object.fromEntries(settings.map(s => [s.key, s.value])));
}

export async function PUT(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { key, value } = await request.json();
  const stmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
  const result = stmt.run(value, key);
  return NextResponse.json({ success: result.changes > 0 });
}
