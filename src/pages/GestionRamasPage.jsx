import React, { useState } from 'react';
import { useGit } from '../context/GitContext';

const GestionRamasPage = () => {
  const { activeRepo, handleAddBranch, handleDeleteBranch } = useGit();
  const [newBranch, setNewBranch] = useState('');

  // Si no hay un repositorio activo seleccionado en el contexto, no renderizar nada
  if (!activeRepo) return null;

  // Manejador para agregar una nueva rama
  const onAdd = (e) => {
    e.preventDefault();
    if (newBranch.trim()) {
      handleAddBranch(newBranch.trim());
      setNewBranch('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Formulario de creación de nuevas ramas */}
      <form onSubmit={onAdd} className="bg-[#171b28] border border-[#434656]/40 p-4 rounded-xl flex gap-3 shadow-lg">
        <input
          type="text"
          placeholder="Nombre de la nueva rama..."
          value={newBranch}
          onChange={(e) => setNewBranch(e.target.value)}
          className="bg-[#0a0e1a] border border-[#434656] text-white text-sm rounded-lg px-4 py-2 flex-grow focus:outline-none focus:border-[#7bd0ff]"
        />
        <button
          type="submit"
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs px-5 py-2 rounded-lg transition-all cursor-pointer border-0 shrink-0"
        >
          + Crear Rama
        </button>
      </form>

      {/* 2. Listado de ramas existentes en el repositorio */}
      <div className="border border-[#434656]/40 rounded-xl bg-[#171b28] overflow-hidden shadow-xl">
        <div className="bg-[#1b1f2c] px-4 py-3 border-b border-[#434656]/40 text-xs font-bold text-white uppercase tracking-wider">
          Ramas Activas ({activeRepo.branches?.length || 0})
        </div>
        <div className="divide-y divide-[#434656]/20">
          {activeRepo.branches && activeRepo.branches.map((b, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 text-sm font-mono">
              <span className="text-[#7bd0ff] flex items-center gap-2">
                🌿 {b.name} {b.isDefault && <span className="text-[10px] bg-[#101a33] text-[#22c55e] px-2 py-0.5 rounded border border-[#22c55e]/30 font-sans">default</span>}
              </span>
              {!b.isDefault && (
                <button
                  type="button"
                  onClick={() => handleDeleteBranch(b.name)}
                  className="text-xs text-[#ffb4ab] hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GestionRamasPage;