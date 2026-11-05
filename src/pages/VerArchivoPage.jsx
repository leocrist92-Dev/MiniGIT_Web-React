import React from 'react';
import { useGit } from '../context/GitContext';

const VerArchivoPage = () => {
  const { activeFile, setCurrentView, setActiveTab } = useGit();

  // Si no hay un archivo activo cargado en el contexto, mostrar vista informativa en lugar de pantalla vacía (null)
  if (!activeFile) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center text-[#dfe2f4]">
        <div className="bg-[#171b28] border border-[#434656]/40 rounded-xl p-8 shadow-xl max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[#252a37] text-[#8d90a2] flex items-center justify-center mx-auto mb-4 text-xl">
            📄
          </div>
          <h2 className="text-lg font-bold mb-2">No hay ningún archivo seleccionado</h2>
          <p className="text-xs text-[#8d90a2] mb-6">Regresa al explorador del repositorio y haz clic en un archivo para cargar su código.</p>
          <button
            type="button"
            onClick={() => {
              setActiveTab('code');
              setCurrentView('repo-detail');
            }}
            className="px-4 py-2 bg-[#2563ff] hover:bg-[#571bc1] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer border-0"
          >
            ← Volver al repositorio
          </button>
        </div>
      </div>
    );
  }

  // Obtener el contenido del archivo o asignar un texto descriptivo por defecto si la propiedad content no existe
  const codeContent = activeFile.content || '// Este archivo no tiene contenido para mostrar.';
  const codeLines = codeContent.split('\n');

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 text-[#dfe2f4]">
      {/* 1. Botón para volver a la vista de código */}
      <button
        type="button"
        onClick={() => {
          setActiveTab('code');
          setCurrentView('repo-detail');
        }}
        className="text-xs text-[#7bd0ff] mb-4 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
      >
        ← Volver al código
      </button>

      {/* 2. Contenedor principal del visor de archivos */}
      <div className="border border-[#434656]/40 rounded-xl bg-[#171b28] overflow-hidden shadow-2xl">
        {/* Cabecera con nombre del archivo y acciones */}
        <div className="bg-[#1b1f2c] p-3 text-xs flex justify-between items-center border-b border-[#434656]/40">
          <span className="font-bold text-white font-mono">{activeFile.name || 'archivo_sin_nombre'}</span>
          <div className="flex items-center gap-4 text-[#c3c5d8]">
            <span>
              {activeFile.lines || codeLines.length} líneas
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(codeContent);
              }}
              className="text-[#7bd0ff] hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              Copiar Código
            </button>
          </div>
        </div>

        {/* Bloque del contenido de código con números de línea */}
        <div className="p-4 bg-[#0a0e1a] font-mono text-xs text-[#dfe2f4] overflow-x-auto">
          {codeLines.map((line, idx) => (
            <div key={idx} className="flex">
              <span className="w-10 text-[#8d90a2] select-none">{idx + 1}</span>
              <pre className="whitespace-pre">{line}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerArchivoPage;