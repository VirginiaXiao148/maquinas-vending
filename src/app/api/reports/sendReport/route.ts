import { db } from '../../../query/initDB';
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Método no permitido')

    const { machine_id, location, issue, email, notes } = req.body

    try {
        // 1. Guardar en la base de datos
        const stmt = db.prepare(`
        INSERT INTO reports (machine_id, location, issue)
        VALUES (?, ?, ?)
        `)
        stmt.run(machine_id, location, issue)

        // 2. Enviar el correo
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        await transporter.sendMail({
        from: `"Averías" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `🚨 Avería reportada en máquina ${machine_id}`,
        html: `
            <h2>Nuevo reporte de avería</h2>
            <p><strong>Máquina:</strong> ${machine_id}</p>
            <p><strong>Ubicación:</strong> ${location}</p>
            <p><strong>Problema:</strong> ${issue}</p>
            <p><strong>Comentarios:</strong><br/>${notes || 'Sin comentarios'}</p>
        `
        })

        res.status(200).json({ message: 'Reporte guardado y correo enviado con éxito' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al guardar o enviar el reporte' })
    }
}
