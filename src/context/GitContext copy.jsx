import React, { useState, useEffect, createContext, useContext } from 'react';
import { gitService } from '../services/gitService';

// ============================================================================
// 2. CONTEXT (context/GitContext.jsx)
// Administrador de Estado Global del VCS
// ============================================================================

const GitContext = createContext();

export const GitProvider = ({ children }) => {
const [user, setUser] = useState({ id: 1, username: 'luis_dev', email: 'ingeniero@minigit.dev' });
const [repos, setRepos] = useState([]);
const [activeRepo, setActiveRepo] = useState(null);
const [activeBranch, setActiveBranch] = useState('main');
const [activeCommit, setActiveCommit] = useState(null);
const [activeFile, setActiveFile] = useState(null);
const [activeTab, setActiveTab] = useState('code');
const [currentView, setCurrentView] = useState('dashboard'); // 'login', 'dashboard', 'new-repo', 'repo-detail', 'commit-detail', 'view-file'
const [loading, setLoading] = useState(false);

useEffect(() => {
fetchRepos();
}, []);

const fetchRepos = async () => {
setLoading(true);
const data = await gitService.getRepos();
setRepos(data);
if (data.length > 0 && !activeRepo) {
setActiveRepo(data[0]);
}
setLoading(false);
};

const handleLogin = async (email, password) => {
setLoading(true);
const loggedUser = await gitService.login(email, password);
setUser(loggedUser);
setCurrentView('dashboard');
setLoading(false);
};

const handleLogout = () => {
setUser(null);
setCurrentView('login');
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

const handleSelectRepo = (repo) => {
setActiveRepo(repo);
setActiveBranch(repo.defaultBranch || 'main');
setActiveTab('code');
setCurrentView('repo-detail');
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