import React, { useState } from 'react';
import { useGit } from '../context/GitContext';

const LoginPage = () => {
  const { handleLogin } = useGit();
  const [email, setEmail] = useState('ingeniero@minigit.dev');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <main className="w-full min-h-screen bg-[#0f131f] flex flex-col justify-between items-center px-4">
      {/* Encabezado Superior */}
      <header className="w-full py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b6c4ff] text-[24px]">terminal</span>
          <span className="font-mono text-[#dfe2f4] font-semibold">MiniGit</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-[#252a37] text-[#7bd0ff] uppercase">v0.9</span>
        </div>
        <div className="flex items-center gap-1 text-[#8d90a2] text-xs font-mono">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>Secure Environment</span>
        </div>
      </header>

      {/* Tarjeta Formulario de Inicio de Sesión */}
      <div className="w-full max-w-[430px] my-auto">
        <div className="bg-[#171b28] rounded-xl p-8 shadow-2xl relative overflow-hidden border border-[#434656]/40">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563ff] via-[#d0bcff] to-[#7bd0ff]"></div>
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#252a37] text-[#b6c4ff] mb-4">
              <span className="material-symbols-outlined text-[24px]">alt_route</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-xl font-bold text-[#dfe2f4]">Mini</span>
              <span className="text-xl font-bold text-[#d0bcff]">Git</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#303442] text-[#7bd0ff] ml-1">v0.9</span>
            </div>
            <h1 className="text-lg font-semibold text-[#dfe2f4]">Ingresar a MiniGit</h1>
            <p className="text-xs text-[#8d90a2]">Plataforma de control de versiones y colaboración</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#c3c5d8]">Correo Electrónico</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8d90a2] text-[18px]">
                  mail
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-[#0a0e1a] text-[#dfe2f4] font-mono text-sm rounded-lg outline-none focus:ring-1 focus:ring-[#7bd0ff] border border-[#434656]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#c3c5d8]">Contraseña</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8d90a2] text-[18px]">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-[#0a0e1a] text-[#dfe2f4] font-mono text-sm rounded-lg outline-none focus:ring-1 focus:ring-[#7bd0ff] border border-[#434656]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#8d90a2] bg-transparent border-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2563ff] hover:bg-[#571bc1] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-0 mt-2"
            >
              <span>Iniciar Sesión</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>

      {/* Pie de Página */}
      <footer className="w-full bg-[#171b28] border-t border-[#434656] py-4">
        <div className="w-full px-8 flex flex-col md:flex-row items-center justify-between gap-2 text-[#c3c5d8] font-mono text-xs">
          <div>MiniGit VCS Engine • Precision developer workspace</div>
          <div className="flex items-center gap-4">
            <span>v0.9.4-alpha</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#7bd0ff] inline-block"></span>Operational
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LoginPage;