import { db } from '../../query/initDB';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { report_id, comment, attachment } = await req.json();

        if (!report_id || !comment) {
            return NextResponse.json({ error: 'El ID del reporte y el comentario son obligatorios' }, { status: 400 });
        }

        const reportExists = db.prepare('SELECT id FROM reports WHERE id = ?').get(report_id);
        if (!reportExists) {
            return NextResponse.json({ error: 'El reporte no existe' }, { status: 404 });
        }

        const result = db.prepare(
            'INSERT INTO comments (report_id, comment, attachment) VALUES (?, ?, ?)'
        ).run(report_id, comment, attachment || null);

        return NextResponse.json({
            id: result.lastInsertRowid,
            report_id,
            comment,
            attachment
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al agregar el comentario' }, { status: 500 });
    }
}

export async function GET() {
    const comments = db.prepare(`SELECT * FROM comments`).all();
    return NextResponse.json(comments);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { comment, attachment } = await req.json();
        const { id } = params;

        if (!id || !comment) {
            return NextResponse.json({ error: 'ID y comentario son obligatorios' }, { status: 400 });
        }

        const commentExists = db.prepare('SELECT id FROM comments WHERE id = ?').get(id);
        if (!commentExists) {
            return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
        }

        const result = db.prepare(
            'UPDATE comments SET comment = ?, attachment = ? WHERE id = ?'
        ).run(comment, attachment || null, id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Comentario actualizado correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar el comentario' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 });
        }

        const result = db.prepare('DELETE FROM comments WHERE id = ?').run(id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Comentario eliminado correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar el comentario' }, { status: 500 });
    }
}
