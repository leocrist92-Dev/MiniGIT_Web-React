import React from 'react';
import { useGit } from '../context/GitContext';

const HistorialCommitsPage = () => {
  const { activeRepo, handleSelectCommit } = useGit();

  // Si no hay un repositorio activo seleccionado en el contexto, mostrar mensaje informativo
  if (!activeRepo) {
    return (
      <div className="p-6 text-center text-[#8d90a2] text-xs">
        No hay un repositorio seleccionado para mostrar su historial de commits.
      </div>
    );
  }

  const commits = activeRepo.commits || [];

  return (
    <div className="space-y-4 text-[#dfe2f4]">
      {/* 1. Encabezado e indicador del historial de la rama actual */}
      <div className="text-xs font-mono text-[#c3c5d8] mb-2 flex items-center gap-2">
        <span>Mostrando historial de versiones de la rama</span>
        <span className="bg-[#1b1f2c] px-2 py-0.5 rounded text-white border border-[#434656]/40 font-semibold">
          {activeRepo.defaultBranch || 'main'}
        </span>
      </div>

      {/* 2. Listado cronológico de commits */}
      {commits.length === 0 ? (
        <div className="bg-[#171b28] border border-[#434656]/40 rounded-xl p-8 text-center text-[#8d90a2] text-xs">
          No hay commits registrados en este repositorio.
        </div>
      ) : (
        commits.map((c, idx) => (
          <div
            key={c.hash || idx}
            className="bg-[#171b28] border border-[#434656]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#7bd0ff] transition-all shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#252a37] text-[#7bd0ff] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">commit</span>
              </div>
              <div>
                <p
                  onClick={() => handleSelectCommit(c)}
                  className="font-bold text-white hover:text-[#7bd0ff] cursor-pointer text-base mb-1 transition-colors"
                >
                  {c.msg || 'Sin mensaje de commit'}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#c3c5d8]">
                  <span className="text-white font-medium">{c.author || 'Desconocido'}</span>
                  <span>• comiteó {c.date || 'recientemente'}</span>
                  {c.verified && (
                    <span className="text-[#22c55e] text-[10px] bg-[#101a33] px-1.5 py-0.5 rounded border border-[#22c55e]/30 font-mono">
                      ✓ Verificado
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectCommit(c)}
              className="bg-[#0a0e1a] border border-[#434656] hover:bg-[#252a37] text-[#7bd0ff] font-mono px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shrink-0 self-start sm:self-center"
            >
              {c.hash || 'hash'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default HistorialCommitsPage;