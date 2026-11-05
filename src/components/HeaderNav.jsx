// ============================================================================
// COMPONENTES GLOBALES (Header / Navbar & Footer)
// ============================================================================

const HeaderNav = () => {
const { user, handleLogout, setCurrentView } = useGit();
if (!user) return null;

return (



<button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-1 text-lg font-bold tracking-tight focus:outline-none">
Mini

alt_routeGit



<button onClick={() => setCurrentView('dashboard')} className="px-3 py-1 rounded text-[#dfe2f4] hover:bg-[#252a37] transition-colors text-sm">
Dashboard

<button onClick={() => setCurrentView('new-repo')} className="px-3 py-1 rounded text-[#c3c5d8] hover:bg-[#252a37] hover:text-[#dfe2f4] transition-colors text-sm">
Nuevo Repo





@{user.username}


logout
Salir


person




);
};