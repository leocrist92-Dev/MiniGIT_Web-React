// ============================================================================
// 4. MAIN ROUTER Y PUNTO DE ENTRADA (App.jsx)
// ============================================================================

import React from 'react';
import { GitProvider, useGit } from './context/GitContext';

// Importación de las páginas desde la carpeta /pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CrearRepositorioPage from './pages/CrearRepositorioPage';
import RepositorioPage from './pages/RepositorioPage';
import HistorialCommitsPage from './pages/HistorialCommitsPage';
import DetalleCommitPage from './pages/DetalleCommitPage';
import GestionRamasPage from './pages/GestionRamasPage';
import SettingsPage from './pages/SettingsPage';
import VerArchivoPage from './pages/VerArchivoPage';

const MainRouter = () => {
  const { user, currentView } = useGit();

  // Si no hay usuario autenticado o la vista activa es 'login'
  if (!user || currentView === 'login') {
    return <LoginPage />;
  }

  // LAS ETIQUETAS <> Y </> EVITAN EL ERROR DE SINTAXIS DE VITE
  return (
    <>
      {currentView === 'dashboard' && <DashboardPage />}
      {currentView === 'new-repo' && <CrearRepositorioPage />}
      {currentView === 'repo-detail' && <RepositorioPage />}
      {currentView === 'commits' && <HistorialCommitsPage />}
      {currentView === 'commit-detail' && <DetalleCommitPage />}
      {currentView === 'branches' && <GestionRamasPage />}
      {currentView === 'settings' && <SettingsPage />}
      {currentView === 'view-file' && <VerArchivoPage />}
    </>
  );
};

export default function App() {
  return (
    <GitProvider>
      <MainRouter />
    </GitProvider>
  );
}