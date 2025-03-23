import { db } from '../../query/initDB';
import { NextResponse } from 'next/server';

export async function GET() {
    const stats = db.prepare(
        'SELECT status, COUNT(*) as count FROM reports GROUP BY status'
    ).all();
    return NextResponse.json(stats);
}
