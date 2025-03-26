'use client';
import { useState } from 'react';

export default function MachineForm() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/machines/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('Máquina agregada correctamente');
            setName('');
        } else {
            setMessage(data.error || 'Error al agregar la máquina');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 p-4 rounded-xl shadow-xl max-w-md">
            <h2 className="text-xl font-bold text-white">Agregar Máquina</h2>

            <input
                type="text"
                placeholder="Nombre de la máquina"
                className="w-full p-2 rounded text-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button type="submit" className="w-full p-2 bg-zinc-500 text-white rounded">
                Agregar
            </button>

            {message && <p className="text-sm text-white">{message}</p>}
        </form>
    );
}
