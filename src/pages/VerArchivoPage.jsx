import React from 'react';
import { useGit } from '../context/GitContext';

const VerArchivoPage = () => {
  const { activeFile, setActiveFile } = useGit();

  if (!activeFile) return null;

  const lineas = (activeFile.content || '').split('\n');

  return (
    <div className="bg-[#1b1f2c] border border-[#434656]/40 rounded-xl overflow-hidden shadow-xl">
      {/* Barra superior del archivo con botón para volver a las carpetas */}
      <div className="bg-[#171b28] px-4 py-3 border-b border-[#434656]/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveFile(null)}
            className="bg-[#252a37] hover:bg-[#353947] text-[#7bd0ff] px-3 py-1.5 rounded-lg border border-[#434656] cursor-pointer flex items-center gap-1.5 font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Volver al código</span>
          </button>
          <span className="text-[#c3c5d8]">{activeFile.path || activeFile.name}</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#8d90a2]">
          <span>{lineas.length} líneas</span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(activeFile.content || '')}
            className="bg-[#252a37] hover:bg-[#353947] text-[#c3c5d8] hover:text-white px-2.5 py-1 rounded border border-[#434656] cursor-pointer"
          >
            Copiar código
          </button>
        </div>
      </div>

      {/* Visor de Código con Numeración de Líneas */}
      <div className="overflow-x-auto bg-[#0f131f] py-3 font-mono text-xs leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lineas.map((linea, idx) => (
              <tr key={idx} className="hover:bg-[#1b1f2c]/80">
                <td className="select-none text-right pr-4 pl-4 text-[#8d90a2]/60 w-12 border-r border-[#434656]/20">
                  {idx + 1}
                </td>
                <td className="pl-4 pr-6 text-[#dfe2f4] whitespace-pre">{linea || ' '}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerArchivoPage;