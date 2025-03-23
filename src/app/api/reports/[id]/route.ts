import { db } from '../../../query/initDB';
import { NextResponse } from 'next/server';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    db.prepare('DELETE FROM reports WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const data = await req.json();

    db.prepare(`
        UPDATE reports
        SET issue = ?, status = ?, solution = ?, cost = ?
        WHERE id = ?
    `).run(data.issue, data.status, data.solution ?? null, data.cost ?? null, id);

    return NextResponse.json({ success: true });
}
