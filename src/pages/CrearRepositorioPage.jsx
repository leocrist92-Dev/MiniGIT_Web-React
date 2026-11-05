import React, { useState } from 'react';
import { useGit } from '../context/GitContext';

const CrearRepositorioPage = () => {
  const { handleCreateRepo, setCurrentView } = useGit();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [visibility, setVisibility] = useState('private');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    handleCreateRepo({ name, desc, visibility });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 text-[#dfe2f4]">
      {/* 1. Ruta / Breadcrumb del repositorio (Envuelto correctamente dentro de un <div>) */}
      <div className="mb-6 flex items-center gap-2 text-xs font-mono text-[#c3c5d8]">
        <span className="text-[#7bd0ff]">@luis_dev</span>
        <span>/</span>
        <span>new-repository</span>
      </div>

      {/* 2. Tarjeta principal con el formulario */}
      <div className="bg-[#1b1f2c] rounded-xl p-8 border border-[#434656]/40 shadow-2xl">
        <div className="flex items-center gap-4 mb-6 border-b border-[#434656]/40 pb-6">
          <div className="w-12 h-12 rounded-xl bg-[#252a37] flex items-center justify-center text-[#b6c4ff]">
            <span className="material-symbols-outlined text-[28px]">create_new_folder</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Crear un nuevo repositorio</h1>
            <p className="text-sm text-[#c3c5d8]">Un repositorio contiene todos los archivos del proyecto y su historial.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold mb-2">Nombre del repositorio *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="awesome-telemetry-engine"
              className="w-full bg-[#171b28] border border-[#434656] text-[#dfe2f4] p-3 rounded-lg font-mono text-sm focus:outline-none focus:border-[#7bd0ff]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-2">Descripción (opcional)</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Breve descripción del propósito técnico..."
              className="w-full bg-[#171b28] border border-[#434656] text-[#dfe2f4] p-3 rounded-lg text-sm focus:outline-none focus:border-[#7bd0ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-3 uppercase tracking-wider">Nivel de Privacidad</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setVisibility('public')}
                className={`p-4 rounded-xl cursor-pointer border flex items-start gap-3 ${
                  visibility === 'public' ? 'border-[#7bd0ff] bg-[#252a37]' : 'border-[#434656] bg-[#171b28]'
                }`}
              >
                <span className="material-symbols-outlined text-[#7bd0ff]">public</span>
                <div>
                  <h4 className="font-semibold text-sm">Público</h4>
                  <p className="text-xs text-[#c3c5d8]">Cualquiera en internet puede ver este repositorio.</p>
                </div>
              </div>

              <div
                onClick={() => setVisibility('private')}
                className={`p-4 rounded-xl cursor-pointer border flex items-start gap-3 ${
                  visibility === 'private' ? 'border-[#7bd0ff] bg-[#252a37]' : 'border-[#434656] bg-[#171b28]'
                }`}
              >
                <span className="material-symbols-outlined text-[#d0bcff]">lock</span>
                <div>
                  <h4 className="font-semibold text-sm">Privado</h4>
                  <p className="text-xs text-[#c3c5d8]">Tú eliges quién puede ver y publicar en este repo.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#434656]/40 pt-6">
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="px-5 py-2.5 rounded-lg bg-[#171b28] hover:bg-[#252a37] text-sm text-[#dfe2f4] cursor-pointer border-0"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer border-0"
            >
              <span className="material-symbols-outlined text-[20px]">add_task</span>
              <span>Crear repositorio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearRepositorioPage;