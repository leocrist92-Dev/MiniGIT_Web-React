import React, { useState, useEffect, createContext, useContext } from 'react';
import { gitService } from '../services/gitService';

// ============================================================================
// 2. CONTEXT (context/GitContext.jsx)
// Administrador de Estado Global del VCS
// ============================================================================

const GitContext = createContext();

export const GitProvider = ({ children }) => {
  //const [user, setUser] = useState({ id: 1, username: 'luis_dev', email: 'ingeniero@minigit.dev' });
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [activeRepo, setActiveRepo] = useState(null);
  const [activeBranch, setActiveBranch] = useState('main');
  const [activeCommit, setActiveCommit] = useState(null);
  // Estado independiente para almacenar la lista de ramas del repositorio activo
  const [activeRepoBranches, setActiveRepoBranches] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [activeTab, setActiveTab] = useState('code');
  const [currentView, setCurrentView] = useState('dashboard'); // 'login', 'dashboard', 'new-repo', 'repo-detail', 'commit-detail', 'view-file'
  const [loading, setLoading] = useState(false);

  /*useEffect(() => {
  fetchRepos();
  }, []);*/

  /*const fetchRepos = async () => {
  setLoading(true);
  const data = await gitService.getRepos();
  setRepos(data);
  if (data.length > 0 && !activeRepo) {
  setActiveRepo(data[0]);
  }
  setLoading(false);
  };*/

  const handleLogin = async (email, password) => {
    try {
      const user = await gitService.login(email, password);
      setUser(user);
      console.log(user)
      
      // Una vez logueado, traemos los proyectos del backend
      const reposData = await gitService.getRepos(user);
      console.log(reposData);
      console.log("reposData");
      setRepos(reposData);
      setCurrentView('dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
      setUser(null);
      setCurrentView('login');
  };

  // Función dedicada a consultar las ramas en el backend y actualizar el estado
  const obtenerRamasProyecto = async (repoId) => {
    try {
      const ramasData = await gitService.getRepoBranches(repoId);
      setActiveRepoBranches(ramasData);
      return ramasData;
    } catch (error) {
      console.error('Error en obtenerRamasProyecto:', error);
      setActiveRepoBranches([]);
      return [];
    }
  };

  const handleCreateRepo = async (formData) => {
  setLoading(true);
  const newRepo = await gitService.createRepo(formData);
  setRepos([newRepo, ...repos]);
  setActiveRepo(newRepo);
  setCurrentView('repo-detail');
  setActiveTab('code');
  setLoading(false);
  };

  const handleSelectRepo = async (repo) => {
    setActiveRepo(repo);
    setCurrentView('repo-detail');

    // Si seleccionamos un repositorio, traemos sus commits reales desde la BD
    try {
      const commits = await gitService.getRepoCommits(repo.id);
      setActiveRepo(prev => ({ ...prev, commits }));
      obtenerRamasProyecto(repo.id)
    } catch (error) {
      console.error('Error cargando historial de commits:', error);
    }
  };

  const handleAddBranch = async (branchName) => {
  if (!activeRepo) return;
  const updatedBranches = await gitService.addBranch(activeRepo.id, branchName);
  const updatedRepo = { ...activeRepo, branches: updatedBranches };
  setActiveRepo(updatedRepo);
  setRepos(repos.map((r) => (r.id === updatedRepo.id ? updatedRepo : r)));
  };

  const handleDeleteBranch = async (branchName) => {
  if (!activeRepo) return;
  const updatedBranches = await gitService.deleteBranch(activeRepo.id, branchName);
  const updatedRepo = { ...activeRepo, branches: updatedBranches };
  setActiveRepo(updatedRepo);
  setRepos(repos.map((r) => (r.id === updatedRepo.id ? updatedRepo : r)));
  };

  const handleDeleteRepo = async (repoId) => {
  setLoading(true);
  await gitService.deleteRepo(repoId);
  const remaining = repos.filter((r) => r.id !== repoId);
  setRepos(remaining);
  setActiveRepo(remaining[0] || null);
  setCurrentView('dashboard');
  setLoading(false);
  };

  const handleSelectCommit = (commit) => {
  setActiveCommit(commit);
  setCurrentView('commit-detail');
  };

  const handleSelectFile = (file) => {
  setActiveFile(file);
  setCurrentView('view-file');
  };

  return (
  <GitContext.Provider
  value={{
  user,
  repos,
  activeRepo,
  activeBranch,
  activeRepoBranches,       // <-- Variable de estado exportada para las vistas
  activeCommit,
  activeFile,
  activeTab,
  currentView,
  loading,
  setActiveTab,
  setActiveBranch,
  setCurrentView,
  handleLogin,
  handleLogout,
  handleCreateRepo,
  handleSelectRepo,
  obtenerRamasProyecto,     // <-- Función exportada por si se requiere refrescar manualmente
  handleAddBranch,
  handleDeleteBranch,
  handleDeleteRepo,
  handleSelectCommit,
  handleSelectFile
  }}
  >
  {children}
  </GitContext.Provider>
  );
};

export const useGit = () => useContext(GitContext);