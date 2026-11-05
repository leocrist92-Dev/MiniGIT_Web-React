import React, { useState } from 'react';
import { useGit } from '../context/GitContext';

const DashboardPage = () => {
  const { repos, setCurrentView, handleSelectRepo } = useGit();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Filtrado de repositorios según el texto de búsqueda y el filtro activo
  const filtered = (repos || []).filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.desc?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'public') return matchesSearch && r.visibility === 'Público';
    if (filterType === 'private') return matchesSearch && r.visibility === 'Privado';
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-[#dfe2f4]">
      {/* 1. Header Section / Encabezado principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7bd0ff] mb-1">
            <span>WORKSPACE OVERVIEW</span>
            <span>•</span>
            <span>ACTIVE INSTANCE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Mis Repositorios</h1>
          <p className="text-sm text-[#c3c5d8]">
            Administra tus árboles de código, ramas activas y sincronización distribuida.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentView('new-repo')}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg cursor-pointer border-0"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Nuevo Repositorio</span>
        </button>
      </div>

      {/* 2. Search Bar & Filters / Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#171b28] p-3 rounded-xl mb-6 border border-[#434656]/40 shadow-md">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8d90a2] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar repositorio por nombre o tecnología..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0e1a] text-[#dfe2f4] pl-10 pr-4 py-2 rounded-lg font-mono text-sm focus:outline-none border border-[#434656]/50 focus:border-[#7bd0ff]"
          />
        </div>
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors border-0 ${
              filterType === 'all' ? 'bg-[#252a37] text-[#7bd0ff] font-bold' : 'text-[#c3c5d8] hover:text-white'
            }`}
          >
            Todos ({repos ? repos.length : 0})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('public')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors border-0 ${
              filterType === 'public' ? 'bg-[#252a37] text-[#7bd0ff] font-bold' : 'text-[#c3c5d8] hover:text-white'
            }`}
          >
            Públicos
          </button>
          <button
            type="button"
            onClick={() => setFilterType('private')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors border-0 ${
              filterType === 'private' ? 'bg-[#252a37] text-[#7bd0ff] font-bold' : 'text-[#c3c5d8] hover:text-white'
            }`}
          >
            Privados
          </button>
        </div>
      </div>

      {/* 3. Repo Grid / Grilla de repositorios */}
      {filtered.length === 0 ? (
        <div className="bg-[#171b28] border border-[#434656]/40 rounded-xl p-12 text-center text-[#8d90a2] text-sm font-mono shadow-md">
          No se encontraron repositorios que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((repo) => (
            <div
              key={repo.id}
              onClick={() => handleSelectRepo(repo)}
              className="bg-[#171b28] border border-[#434656]/40 p-6 rounded-xl hover:border-[#7bd0ff] transition-all cursor-pointer flex flex-col justify-between shadow-md group"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-[#7bd0ff] group-hover:underline flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">folder_data</span>
                    {repo.name}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#252a37] text-[#c3c5d8] border border-[#434656]">
                    {repo.visibility}
                  </span>
                </div>
                <p className="text-sm text-[#c3c5d8] mb-4 line-clamp-2">
                  {repo.desc || 'Sin descripción.'}
                </p>
              </div>
              <div className="border-t border-[#434656]/30 pt-4 flex items-center justify-between text-xs font-mono text-[#c3c5d8]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7bd0ff]"></span>
                    {repo.lang || 'Code'}
                  </span>
                  <span>🌿 {repo.defaultBranch || 'main'}</span>
                </div>
                <span>{repo.updated || 'Recientemente'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;