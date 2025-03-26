


export default function MachineForm() {
    return (
        <form className="space-y-4 bg-zinc-900 p-4 rounded-xl shadow-xl max-w-md">
            <h2 className="text-xl font-bold text-white">Agregar Máquina</h2>

            <input type="text" placeholder="Nombre de la máquina" className="w-full p-2 rounded text-black" />

            <button type="submit" className="w-full p-2 bg-zinc-500 text-white rounded">Agregar</button>
        </form>
    )
}