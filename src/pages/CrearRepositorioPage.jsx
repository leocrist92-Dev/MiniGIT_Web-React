import React, { useState } from 'react';
import { useGit } from '../context/GitContext';

const CrearRepositorioPage = () => {
  const { handleCreateRepo, setCurrentView } = useGit();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [rutaLocal, setRutaLocal] = useState('');
  const [parentDirHandle, setParentDirHandle] = useState(null);
  const [folderSelectedName, setFolderSelectedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const soportaFileSystemAPI = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

  // Abre el explorador nativo de carpetas del computador cliente
  const handleSeleccionarCarpeta = async () => {
    setErrorMsg('');
    if (!soportaFileSystemAPI) {
      setErrorMsg(
        'Tu navegador no soporta el selector nativo de carpetas (usa Chrome, Edge o Brave) o escribe la ruta manualmente.'
      );
      return;
    }

    try {
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });

      setParentDirHandle(dirHandle);
      setFolderSelectedName(dirHandle.name);

      if (!rutaLocal.trim()) {
        setRutaLocal(dirHandle.name);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error al seleccionar carpeta local:', err);
        setErrorMsg('No se pudo obtener permiso de lectura/escritura sobre la carpeta seleccionada.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const nombreLimpio = name.trim();
    if (!nombreLimpio) {
      setErrorMsg('El nombre del repositorio es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      await handleCreateRepo(
        {
          name: nombreLimpio,
          desc: description.trim(),
          visibility,
          defaultBranch: defaultBranch.trim() || 'main',
          ruta: rutaLocal.trim() || folderSelectedName || nombreLimpio
        },
        parentDirHandle
      );
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error al crear el repositorio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 text-[#dfe2f4]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7bd0ff]">create_new_folder</span>
            Crear un nuevo repositorio
          </h1>
          <p className="text-xs text-[#8d90a2] mt-1">
            Configura tu proyecto y selecciona la carpeta local en tu computador donde se creará el directorio.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs">
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#1b1f2c] border border-[#434656]/40 rounded-2xl p-6 space-y-5 shadow-xl"
      >
        {/* Nombre del Proyecto */}
        <div>
          <label className="block text-xs font-semibold text-[#c3c5d8] mb-1.5">
            Nombre del repositorio *
          </label>
          <input
            type="text"
            required
            placeholder="ej. mi-sistema-ventas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#171b28] border border-[#434656] focus:border-[#7bd0ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none font-mono"
          />
        </div>

        {/* Selector de Carpeta Física en el Computador Cliente */}
        <div className="p-4 rounded-xl bg-[#171b28] border border-[#434656]/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#7bd0ff]">
                Ubicación en tu computador (Creación física de carpeta)
              </label>
              <p className="text-[11px] text-[#8d90a2]">
                Selecciona la carpeta contenedora; al crear el proyecto se creará automáticamente la subcarpeta{' '}
                <span className="font-mono text-white">{name.trim() || '<nombre-proyecto>'}</span> dentro de ella.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSeleccionarCarpeta}
              className="bg-[#2563ff] hover:bg-[#571bc1] text-white text-xs font-semibold px-3.5 py-2 rounded-lg border-0 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">folder_open</span>
              <span>Seleccionar carpeta...</span>
            </button>
          </div>

          {folderSelectedName && (
            <div className="flex items-center gap-2 text-xs text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/30 px-3 py-2 rounded-lg font-mono">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>
                Carpeta padre autorizada: <strong>{folderSelectedName}/</strong>
                {name.trim() ? `${name.trim()}` : ''}
              </span>
            </div>
          )}

          <div>
            <label className="block text-[11px] text-[#8d90a2] mb-1">
              Ruta registrada del proyecto (puedes completar la ruta absoluta si deseas sincronizarla con Desktop)
            </label>
            <input
              type="text"
              placeholder="ej. C:\Users\TuUsuario\Proyectos"
              value={rutaLocal}
              onChange={(e) => setRutaLocal(e.target.value)}
              className="w-full bg-[#1b1f2c] border border-[#434656] focus:border-[#7bd0ff] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-[#c3c5d8] mb-1.5">
            Descripción (opcional)
          </label>
          <textarea
            rows={2}
            placeholder="Breve descripción del objetivo del proyecto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#171b28] border border-[#434656] focus:border-[#7bd0ff] rounded-xl px-3.5 py-2 text-sm text-white outline-none"
          />
        </div>

        {/* Rama inicial y Visibilidad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#c3c5d8] mb-1.5">
              Rama por defecto
            </label>
            <input
              type="text"
              value={defaultBranch}
              onChange={(e) => setDefaultBranch(e.target.value)}
              className="w-full bg-[#171b28] border border-[#434656] focus:border-[#7bd0ff] rounded-xl px-3.5 py-2 text-sm text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c3c5d8] mb-1.5">
              Visibilidad
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-[#171b28] border border-[#434656] focus:border-[#7bd0ff] rounded-xl px-3.5 py-2 text-sm text-white outline-none"
            >
              <option value="Publico">Público</option>
              <option value="Privado">Privado</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="px-5 py-2.5 rounded-lg bg-[#171b28] hover:bg-[#252a37] text-sm text-[#dfe2f4] cursor-pointer border-0"
            >
              Cancelar
            </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 text-[#0a0e1a] font-bold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>{loading ? 'Creando proyecto...' : 'Crear Repositorio'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearRepositorioPage;