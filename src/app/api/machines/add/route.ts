import { db } from "@/app/query/initDB";
import { NextResponse } from "next/server";


export async function GET() {
    const machines = db.prepare('SELECT * FROM machines').all();
    return NextResponse.json(machines);
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ error: 'El nombre de la máquina es obligatorio' }, { status: 400 });
        }

        const result = db.prepare(
            'INSERT INTO machines (name) VALUES (?)'
        ).run(name);

        return NextResponse.json({ id: result.lastInsertRowid, name }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear la máquina' }, { status: 500 });
    }
}