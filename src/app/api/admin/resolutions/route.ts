import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolutions = db.prepare(`
    SELECT r.*, COUNT(v.id) as vote_count, AVG(v.rating) as average_rating
    FROM resolutions r
    LEFT JOIN votes v ON r.id = v.resolution_id
    GROUP BY r.id
  `).all();
  return NextResponse.json(resolutions);
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  
  try {
    db.prepare('BEGIN').run();
    
    // Delete related votes first
    const deleteVotes = db.prepare('DELETE FROM votes WHERE resolution_id = ?');
    deleteVotes.run(id);
    
    // Then delete the resolution
    const deleteResolution = db.prepare('DELETE FROM resolutions WHERE id = ?');
    const result = deleteResolution.run(id);
    
    db.prepare('COMMIT').run();
    return NextResponse.json({ success: result.changes > 0 });
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
}
