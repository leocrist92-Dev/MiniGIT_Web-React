import React from 'react';
import { useGit } from '../context/GitContext';

const VerDiffCommitPage = () => {
  const { activeCommit, setActiveCommit } = useGit();

  if (!activeCommit) return null;

  const diffLines = activeCommit.diffs || [];

  return (
    <div className="bg-[#1b1f2c] border border-[#434656]/40 rounded-xl overflow-hidden shadow-xl">
      {/* Barra superior del commit con botón para regresar al historial */}
      <div className="bg-[#171b28] px-4 py-3.5 border-b border-[#434656]/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveCommit(null)}
            className="bg-[#252a37] hover:bg-[#353947] text-[#7bd0ff] px-3 py-1.5 rounded-lg border border-[#434656] cursor-pointer flex items-center gap-1.5 text-xs font-mono font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Volver a commits</span>
          </button>
          <div>
            <div className="text-sm font-bold text-white">
              {activeCommit.msg || activeCommit.mensaje || 'Detalle de cambios del commit'}
            </div>
            <div className="text-xs text-[#8d90a2] font-mono">
              <p>Autor: <span className="text-[#c3c5d8]">{activeCommit.author || 'Desarrollador'}</span> • {activeCommit.date || 'Hace un momento'}</p>
              <p>Hash SHA-1: {' '}
              <span className="text-[#f59e0b]">{activeCommit.fullHash}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Visor de Líneas Modificadas (Diff) */}
      <div className="overflow-x-auto bg-[#0f131f] py-2 font-mono text-xs">
        {diffLines.length === 0 ? (
          <div className="p-6 text-center text-[#8d90a2]">
            No se encontraron diferencias registradas en diff/diff.txt para este commit.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <tbody>
              {diffLines.map((d, i) => {
              // Asignación de estilos dinámicos según el tipo de línea
              let bgClass = 'hover:bg-[#1f2434]/30 text-[#c3c5d8]';
              if (d.type === 'added') bgClass = 'bg-[#22c55e]/30 text-[#7bd0ff]';
              if (d.type === 'deleted') bgClass = 'bg-[#93000a]/30 text-[#ffb4ab]';
              //if (d.type === 'hunk') bgClass = 'bg-[#1b1f2c] text-[#8d90a2] font-bold';
              if (d.type === 'hunk') bgClass = 'bg-[#2563ff]/15 text-[#7bd0ff] font-bold';
              if (d.type === 'added-header') bgClass = 'bg-[#2563ff]/50 text-[#7bd0ff] font-bold';
              if (d.type === 'deleted-header') bgClass = 'bg-[#2563ff]/50 text-[#ffb4ab] font-bold';

              // Número de línea unificado para la única columna
              const numeroLinea = d.newLine !== '' ? d.newLine : (d.oldLine !== '' ? d.oldLine : '');

              return (
                <div key={i} className={`flex items-center px-2 py-0.5 ${bgClass}`}>
                  {/* Única columna de número de línea */}
                  <span className="w-12 text-right pr-4 text-[#8d90a2] select-none shrink-0 font-mono">
                    {numeroLinea}
                  </span>

                  {/* Contenido de la línea de código */}
                  <pre className="whitespace-pre-wrap font-mono text-xs flex-1 leading-relaxed">
                    {d.text}
                  </pre>
                </div>
              );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VerDiffCommitPage;