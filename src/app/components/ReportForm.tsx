'use client'
import { useState } from 'react'

export default function ReportForm() {
    const [formData, setFormData] = useState({
        machine: '',
        errorType: '',
        notes: '',
        email: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/sendReport', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        setLoading(false)
        setSuccess(res.ok)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 p-4 rounded-xl shadow-xl max-w-md">
            <h2 className="text-xl font-bold text-white">Reporte de Avería</h2>

            <input type="email" name="email" placeholder="Tu correo" onChange={handleChange} required className="w-full p-2 rounded text-black" />

            <select name="machine" onChange={handleChange} required className="w-full p-2 rounded text-black">
                <option value="">Selecciona máquina</option>
                <option value="Kikko ES6E-R/EQ">Kikko ES6E-R/EQ</option>
            </select>

            <select name="errorType" onChange={handleChange} required className="w-full p-2 rounded text-black">
                <option value="">Tipo de avería</option>
                <option value="Falta de agua">Falta de agua</option>
                <option value="Caldera">Caldera</option>
                <option value="Falta de vasos">Falta de vasos</option>
                <option value="Falta de café">Falta de café</option>
                <option value="Air-break">Air-break</option>
                {/* Añade los demás según el manual */}
            </select>

            <textarea
                name="notes"
                placeholder="Detalles adicionales..."
                rows={4}
                onChange={handleChange}
                className="w-full p-2 rounded text-black"
            />

            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar reporte'}
            </button>

            {success && <p className="text-green-500">¡Reporte enviado y notificación enviada!</p>}
        </form>
    )
}