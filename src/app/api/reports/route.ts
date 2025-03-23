import { db } from '../../query/initDB';
import { NextResponse } from 'next/server';

// Obtener todos los reportes
export async function GET() {
    const reports = db.prepare('SELECT * FROM reports').all();
    return NextResponse.json(reports);
}

// Crear un nuevo reporte
export async function POST(req: Request) {
    try {
        const { machine_id, location, issue } = await req.json();

        if (!machine_id || !location || !issue) {
            return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
        }

        const result = db.prepare(
            'INSERT INTO reports (machine_id, location, issue) VALUES (?, ?, ?)'
        ).run(machine_id, location, issue);

        return NextResponse.json({ id: result.lastInsertRowid, machine_id, location, issue }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear el reporte' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { status } = await req.json();
        const { id } = params;

        if (!id || !status) {
            return NextResponse.json({ error: 'ID y estado son obligatorios' }, { status: 400 });
        }

        const validStatuses = ['pendiente', 'en proceso', 'resuelto'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
        }

        const result = db.prepare(
            'UPDATE reports SET status = ? WHERE id = ?'
        ).run(status, id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Estado actualizado correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar el estado' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 });
        }

        const result = db.prepare('DELETE FROM reports WHERE id = ?').run(id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Reporte eliminado correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar el reporte' }, { status: 500 });
    }
}