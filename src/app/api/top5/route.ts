import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const topResolutions = db.prepare(`
    SELECT r.id, r.name, r.resolution, AVG(v.rating) as average_rating
    FROM resolutions r
    LEFT JOIN votes v ON r.id = v.resolution_id
    GROUP BY r.id
    ORDER BY average_rating DESC
    LIMIT 5
  `).all();
  return NextResponse.json(topResolutions);
}
