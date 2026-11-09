import React from 'react';
import { useGit } from '../context/GitContext';

const DetalleCommitPage = () => {
  const { activeCommit, setCurrentView, setActiveTab } = useGit();

  // Si no hay un commit activo seleccionado, mostrar mensaje informativo en lugar de pantalla en blanco
  if (!activeCommit) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center text-[#dfe2f4]">
        <div className="bg-[#171b28] border border-[#434656]/40 rounded-xl p-8 shadow-xl max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[#252a37] text-[#8d90a2] flex items-center justify-center mx-auto mb-4 text-xl">
            📜
          </div>
          <h2 className="text-lg font-bold mb-2">No hay ningún commit seleccionado</h2>
          <p className="text-xs text-[#8d90a2] mb-6">
            Regresa al historial de commits para seleccionar una versión y ver sus cambios detallados.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab('commits');
              setCurrentView('repo-detail');
            }}
            className="px-4 py-2 bg-[#2563ff] hover:bg-[#571bc1] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer border-0"
          >
            ← Volver a commits
          </button>
        </div>
      </div>
    );
  }

  const diffs = activeCommit.diffs || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 text-[#dfe2f4]">
      {/* 1. Botón para regresar a la vista de commits (CERRADO CORRECTAMENTE) */}
      <button
        type="button"
        onClick={() => {
          setActiveTab('commits');
          setCurrentView('repo-detail');
        }}
        className="text-xs text-[#7bd0ff] mb-4 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
      >
        ← Volver a commits
      </button>

      {/* 2. Cabecera con información general del commit */}
      <div className="bg-[#171b28] border border-[#434656]/40 rounded-xl p-6 mb-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">{activeCommit.msg || 'Sin mensaje de commit'}</h1>
        <div className="text-xs text-[#c3c5d8] space-y-1 font-mono">
          <p>Autor: <span className="text-white font-medium">{activeCommit.author || 'Desconocido'}</span> • {activeCommit.date || 'Hace un momento'}</p>
          <p>Hash SHA-1: <span className="text-[#7bd0ff]">{activeCommit.fullHash || activeCommit.hash}</span></p>
        </div>
      </div>

      {/* 3. Visor de Unified Diff de cambios en archivos */}
      <div className="border border-[#434656]/40 rounded-xl bg-[#0a0e1a] overflow-hidden font-mono text-xs shadow-2xl">
        <div className="bg-[#1b1f2c] px-4 py-2.5 border-b border-[#434656]/40 text-[#7bd0ff] font-bold flex justify-between items-center">
          <span>{activeCommit.diffFile || 'archivo_modificado.py'}</span>
          <span className="text-xs text-[#c3c5d8] font-normal">Unified Diff</span>
        </div>
        
        <div className="divide-y divide-[#434656]/20">
          {diffs.length === 0 ? (
            <div className="p-4 text-[#8d90a2] italic text-center">
              No hay líneas de código modificadas registradas en este commit.
            </div>
          ) : (
            diffs.map((d, i) => {
              // Asignación de estilos dinámicos según el tipo de línea
              let bgClass = 'hover:bg-[#1f2434]/30 text-[#c3c5d8]';
              if (d.type === 'added') bgClass = 'bg-[#22c55e]/30 text-[#7bd0ff]';
              if (d.type === 'deleted') bgClass = 'bg-[#93000a]/30 text-[#ffb4ab]';
              if (d.type === 'hunk') bgClass = 'bg-[#1b1f2c] text-[#8d90a2] font-bold';
              if (d.type === 'added-header') bgClass = 'bg-[#22c55e]/50 text-[#7bd0ff] font-bold';
              if (d.type === 'deleted-header') bgClass = 'bg-[#93000a]/50 text-[#ffb4ab] font-bold';

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
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleCommitPage;