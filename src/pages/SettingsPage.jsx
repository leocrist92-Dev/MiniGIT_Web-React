import React, { useState } from 'react';
import { useGit } from '../context/GitContext';

const SettingsPage = () => {
  const { activeRepo, handleDeleteRepo } = useGit();
  const [repoName, setRepoName] = useState(activeRepo?.name || '');

  // Si no hay un repositorio activo seleccionado en el contexto, no renderizar nada
  if (!activeRepo) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-6 py-6 text-[#dfe2f4]">
      {/* 1. Panel de opciones generales del repositorio */}
      <div className="bg-[#171b28] border border-[#434656]/40 p-6 rounded-xl space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-white border-b border-[#434656]/30 pb-3">
          Opciones Generales
        </h3>
        <div>
          <label className="block text-xs text-[#c3c5d8] mb-2 font-semibold">
            Nombre del Repositorio
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="bg-[#0a0e1a] border border-[#434656] text-white text-sm rounded-lg px-3 py-2 flex-grow focus:outline-none focus:border-[#7bd0ff]"
            />
            <button
              type="button"
              className="bg-[#2563ff] hover:bg-[#571bc1] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer border-0"
            >
              Renombrar
            </button>
          </div>
        </div>
      </div>

      {/* 2. Zona de Peligro (Acciones destructivas y borrado) */}
      <div className="bg-[#171b28] border border-[#93000a] p-6 rounded-xl space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-[#ffb4ab] border-b border-[#93000a]/40 pb-3">
          Zona de Peligro (Danger Zone)
        </h3>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="font-bold text-white text-sm">Eliminar este repositorio</p>
            <p className="text-xs text-[#c3c5d8]">
              Una vez eliminado no hay vuelta atrás. Se borrarán permanentemente todos los archivos e historial de commits.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`¿Seguro que deseas eliminar el repositorio "${activeRepo.name}"?`)) {
                handleDeleteRepo(activeRepo.id);
              }
            }}
            className="bg-[#93000a] hover:bg-[#b31412] text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-lg cursor-pointer transition-colors border-0 shrink-0"
          >
            Eliminar Repositorio
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;