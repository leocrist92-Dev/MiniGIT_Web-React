import React, { useState } from 'react';
import { useGit } from '../context/GitContext';
import HistorialCommitsPage from './HistorialCommitsPage';
import GestionRamasPage from './GestionRamasPage';
import SettingsPage from './SettingsPage';

const RepositorioPage = () => {
  const {
    activeRepo,
    activeRepoBranches,
    activeTab,
    setActiveTab,
    handleSelectFile,
    handleClonarRepo,
    setCurrentView,
    user
  } = useGit();
  const [showClone, setShowClone] = useState(false);
  const [cloning, setCloning] = useState(false);

  // Si no hay un repositorio activo cargado en el contexto, no renderizar nada
  if (!activeRepo) return null;

  const lastCommit = activeRepo.commits && activeRepo.commits.length > 0 ? activeRepo.commits[0] : null;
  const ramaActiva = activeRepo.defaultBranch || 'main';

  const onDescargarZip = async () => {
    setCloning(true);
    try {
      await handleClonarRepo();
    } finally {
      setCloning(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 text-[#dfe2f4]">
      {/* 1. Cabecera del Repositorio (Ruta, Nombre, Visibilidad y Botón de Clonar) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xl font-bold">
          <span className="material-symbols-outlined text-[#7bd0ff]">folder_special</span>
          <span
            className="text-[#c3c5d8] cursor-pointer hover:underline"
            onClick={() => setCurrentView('dashboard')}
          >
            {/*activeRepo.owner*/}
            {user.username}
          </span>
          <span className="text-[#8d90a2]">/</span>
          <span className="text-[#7bd0ff]">{activeRepo.name}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#252a37] text-[#c3c5d8] border border-[#434656] font-normal ml-2">
            {activeRepo.visibility}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowClone(!showClone)}
            className="bg-[#2563ff] hover:bg-[#571bc1] text-white px-4 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-md cursor-pointer border-0 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Clonar</span>
          </button>
        </div>
      </div>

      {/* Caja desplegable de URL de clonación */}
      {showClone && (
        <div className="mb-6 p-4 bg-[#171b28] border border-[#7bd0ff]/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-lg">
          <span className="text-[#c3c5d8] truncate">
            {activeRepo.cloneUrl || `https://minigit.internal/${user?.username || 'dev'}/${activeRepo.name}.git`}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  activeRepo.cloneUrl || `https://minigit.internal/${user?.username || 'dev'}/${activeRepo.name}.git`
                );
              }}
              className="bg-[#252a37] hover:bg-[#353947] text-[#7bd0ff] px-3 py-1.5 rounded-lg border border-[#434656] cursor-pointer"
            >
              Copiar URL
            </button>
            <button
              type="button"
              disabled={cloning}
              onClick={onDescargarZip}
              className="bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 text-[#0a0e1a] font-bold px-3.5 py-1.5 rounded-lg border-0 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">folder_zip</span>
              <span>{cloning ? 'Empaquetando...' : `Descargar ZIP (${ramaActiva})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Barra de Navegación por Pestañas */}
      <div className="flex border-b border-[#434656]/40 mb-6 gap-6 font-medium text-sm">
        {['code', 'commits', 'branches', 'settings'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize transition-all cursor-pointer bg-transparent border-0 ${
              activeTab === tab
                ? 'border-b-2 border-[#f59e0b] text-white font-bold'
                : 'text-[#c3c5d8] hover:text-white'
            }`}
          >
            {tab === 'code' && '💻 Código'}
            {tab === 'commits' && `📜 Commits (${activeRepo.commits ? activeRepo.commits.length : 0})`}
            {tab === 'branches' && `🌿 Ramas (${activeRepoBranches ? activeRepoBranches.length : 0})`}
            {tab === 'settings' && '⚙️ Configuración'}
          </button>
        ))}
      </div>

      {/* 3. Contenido Dinámico según la Pestaña Activa */}
      {activeTab === 'code' && (
        <div className="space-y-6">
          <div className="bg-[#1b1f2c] border border-[#434656]/40 rounded-xl overflow-hidden shadow-xl">
            {/* Información del último commit */}
            <div className="bg-[#171b28] p-3 text-xs flex justify-between items-center border-b border-[#434656]/40 text-[#c3c5d8]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
                <span>
                  Último commit por{' '}
                  <strong className="text-white">{lastCommit?.author || 'luis_dev'}</strong>:{' '}
                  {lastCommit?.msg || 'Initial commit'}
                </span>
              </div>
              <span className="font-mono">{lastCommit?.hash || 'a1b2c3d'} • {lastCommit?.date || 'recientemente'}</span>
            </div>

            {/* Explorador de archivos del repositorio */}
            <div className="divide-y divide-[#434656]/20">
              {activeRepo.files && activeRepo.files.length > 0 ? (
                activeRepo.files.map((file, idx) => (
                  <div
                    key={idx}
                    onClick={() => file.type === 'file' && handleSelectFile(file)}
                    className={`flex items-center justify-between p-3.5 transition-colors text-sm ${
                      file.type === 'file' ? 'hover:bg-[#252a37]/60 cursor-pointer' : 'hover:bg-[#252a37]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-mono text-[#7bd0ff]">
                      <span className="material-symbols-outlined text-[18px]">
                        {file.type === 'folder' ? 'folder' : 'description'}
                      </span>
                      <span className="hover:underline">{file.name}</span>
                    </div>
                    <div className="text-xs text-[#c3c5d8]">{file.msg}</div>
                    <div className="text-xs text-[#8d90a2] font-mono">{file.date}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#8d90a2]">
                  No hay archivos en este repositorio.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Renderizado de las sub-páginas según la pestaña seleccionada */}
      {activeTab === 'commits' && <HistorialCommitsPage />}
      {activeTab === 'branches' && <GestionRamasPage />}
      {activeTab === 'settings' && <SettingsPage />}
    </div>
  );
};

export default RepositorioPage;