import { db } from '../../../query/initDB';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    const formData = await req.formData();
    const report_id = formData.get('report_id');
    const comment = formData.get('comment');
    const file = formData.get('attachment') as File;

    let attachmentPath = null;

    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${randomUUID()}_${file.name}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        await writeFile(path.join(uploadDir, filename), buffer);
        attachmentPath = `/uploads/${filename}`;
    }

    const result = db.prepare(
        `INSERT INTO comments (report_id, comment, attachment) VALUES (?, ?, ?)`
    ).run(report_id, comment, attachmentPath);

    return NextResponse.json({
        id: result.lastInsertRowid,
        report_id,
        comment,
        attachment: attachmentPath,
        created_at: new Date().toISOString(),
    });
}
