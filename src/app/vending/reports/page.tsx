"use client";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

type Comment = {
    id: number;
    report_id: number;
    comment: string;
    attachment?: string;
    created_at: string;
};

type Report = {
    id: number;
    machine_id: string;
    location: string;
    issue: string;
    status: string;
    created_at: string;
    solution?: string;
    cost?: number;
    comments?: Comment[];
};

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [searchDate, setSearchDate] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState<Report | null>(null);
    const [newComment, setNewComment] = useState('');
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

    const toastStyles = {
        success: {
            background: '#004080',
            color: '#fff',
            border: '1px solid #0070f3',
            borderRadius: '8px',
            padding: '12px 16px',
        },
        error: {
            background: '#8B0000',
            color: '#fff',
            border: '1px solid #ff4d4f',
            borderRadius: '8px',
            padding: '12px 16px',
        },
    };

    // Abre el modal con los datos del reporte seleccionado
    const handleEdit = (report: Report) => {
        setEditData(report);
        setIsOpen(true);
    };

    // Guarda cambios
    const handleUpdate = async () => {
        if (!editData) return;
      
        const loadingToast = toast.loading("Guardando cambios...");
      
        try {
            await fetch(`/api/reports/${editData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
      
            const updated = reports.map(r => r.id === editData.id ? editData : r);
            setReports(updated);
            setIsOpen(false);
      
            toast.success("Reporte actualizado correctamente", {
                id: loadingToast,
                duration: 3000,
                style: toastStyles.success,
            });
        } catch (error) {
            toast.error("Error al guardar cambios", { id: loadingToast, style: toastStyles.error });
        }
    };

    // Eliminar reporte
    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que quieres eliminar este reporte?")) {
            const deletingToast = toast.loading("Eliminando...");
        
            try {
                await fetch(`/api/reports/${id}`, { method: "DELETE" });
                setReports(reports.filter((r) => r.id !== id));
        
                toast.success("Reporte eliminado", { id: deletingToast, style: toastStyles.success });
            } catch (err) {
                toast.error("Error al eliminar", { id: deletingToast, style: toastStyles.error });
            }
        }
    };

    const handleAddComment = async () => {
        if (!editData || !newComment) return;
      
        const commentToast = toast.loading("Enviando comentario...");
      
        const formData = new FormData();
        formData.append('report_id', editData.id.toString());
        formData.append('comment', newComment);
        if (attachmentFile) formData.append('attachment', attachmentFile);
      
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                body: formData,
            });
      
            const added = await res.json();
            const refreshed = await fetch(`/api/reports/${editData.id}`).then(res => res.json());
            setEditData(refreshed);
            setNewComment('');
            setAttachmentFile(null);
        
            toast.success("Comentario añadido", { id: commentToast, style: toastStyles.success });
        } catch (err) {
            toast.error("Error al añadir comentario", { id: commentToast, style: toastStyles.error });
        }
    };

    useEffect(() => {
        fetch("/api/reports")
        .then((res) => res.json())
        .then((data) => {
            setReports(data);
            setFilteredReports(data);
        });
    }, []);

    // Filtrar reportes cuando cambian los filtros
    useEffect(() => {
        let filtered = reports;

        if (searchDate) {
        filtered = filtered.filter(report =>
            report.created_at.startsWith(searchDate)
        );
        }

        if (searchLocation) {
        filtered = filtered.filter(report =>
            report.location.toLowerCase().includes(searchLocation.toLowerCase())
        );
        }

        if (searchStatus) {
        filtered = filtered.filter(report => report.status === searchStatus);
        }

        setFilteredReports(filtered);
    }, [searchDate, searchLocation, searchStatus, reports]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Reportes de Averías</h1>

            {/* Filtros */}
            <div className="flex gap-4 mb-4">
                <input
                type="date"
                className="border p-2"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                />

                <input
                type="text"
                placeholder="Ubicación"
                className="border p-2"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                />

                <select
                className="border p-2"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en proceso">En proceso</option>
                <option value="resuelto">Resuelto</option>
                </select>
            </div>

            {/* Tabla de reportes */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Máquina</th>
                        <th className="border p-2">Ubicación</th>
                        <th className="border p-2">Problema</th>
                        <th className="border p-2">Estado</th>
                        <th className="border p-2">Fecha</th>
                        <th className="border p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReports.map((report) => (
                        <tr key={report.id} className="text-center border-b">
                            <td className="border p-2">{report.id}</td>
                            <td className="border p-2">{report.machine_id}</td>
                            <td className="border p-2">{report.location}</td>
                            <td className="border p-2">{report.issue}</td>
                            <td className="border p-2">{report.status}</td>
                            <td className="border p-2">{new Date(report.created_at).toLocaleString()}</td>
                            <td className="border p-2">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => handleEdit(report)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => handleDelete(report.id)}
                                >
                                    Eliminar
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de edición */}
            {isOpen && editData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Editar Reporte</h2>

                        <label className="block mb-2">
                            Problema:
                            <input
                            className="w-full border p-2 mt-1"
                            value={editData.issue}
                            onChange={(e) => setEditData({ ...editData, issue: e.target.value })}
                            />
                        </label>

                        <label className="block mb-2">
                            Estado:
                            <select
                            className="w-full border p-2 mt-1"
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            >
                            <option value="pendiente">Pendiente</option>
                            <option value="en proceso">En proceso</option>
                            <option value="resuelto">Resuelto</option>
                            </select>
                        </label>

                        <label className="block mb-2">
                            Solución:
                            <input
                            className="w-full border p-2 mt-1"
                            value={editData.solution ?? ""}
                            onChange={(e) => setEditData({ ...editData, solution: e.target.value })}
                            />
                        </label>

                        <label className="block mb-4">
                            Costo:
                            <input
                            className="w-full border p-2 mt-1"
                            type="number"
                            value={editData.cost ?? ""}
                            onChange={(e) => setEditData({ ...editData, cost: parseFloat(e.target.value) })}
                            />
                        </label>

                        <hr className="my-4" />
                        <h3 className="text-lg font-semibold mb-2">Comentarios</h3>

                        <div className="max-h-40 overflow-y-auto border rounded p-2 mb-4">
                            {editData.comments && editData.comments.length > 0 ? (
                                editData.comments.map((c) => (
                                    <div key={c.id} className="border-b py-2">
                                        <p className="text-sm">{c.comment}</p>
                                        {c.attachment && (
                                            <a href={c.attachment} className="text-blue-500 text-sm" target="_blank">Ver adjunto</a>
                                        )}
                                        <p className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No hay comentarios.</p>
                            )}
                        </div>

                        <textarea
                            placeholder="Agregar comentario"
                            className="w-full border p-2 mb-2"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <input
                            type="file"
                            onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                            className="mb-2"
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleAddComment}
                        >
                            Agregar Comentario
                        </button>

                        <div className="flex justify-end gap-2">
                            <button
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={() => setIsOpen(false)}
                            >
                            Cancelar
                            </button>
                            <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={handleUpdate}
                            >
                            Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}