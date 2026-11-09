// ============================================================================
// 1. SERVICES (services/gitService.js)
// Capa de emulación de peticiones asíncronas a la Base de Datos / API Backend
// ============================================================================

const API_URL = 'http://localhost:3000/api';

// Función auxiliar para adjuntar automáticamente el Token JWT en los headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('minigit_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const gitService = {
  // 1. INICIAR SESIÓN (POST /api/auth/login)
  login: async (emailLogin, passwordLogin) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      //body: JSON.stringify({ correo: email, password })
      body: JSON.stringify({ email: emailLogin, password: passwordLogin })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error en las credenciales');

    // Guardar token JWT y datos de usuario en localStorage
    if (data.token) {
      localStorage.setItem('minigit_token', data.token);
      localStorage.setItem('minigit_user', JSON.stringify(data.usuario));
    }
    return data.user;
  },

  // 2. OBTENER REPOSITORIOS DEL USUARIO (GET /api/proyectos)
  getRepos: async (userLogin) => {
    const res = await fetch(`${API_URL}/proyectos`, {
      method: 'GET',
      headers: getAuthHeaders(),
      user: userLogin
    });

    const response = await res.json();
    if (!res.ok) throw new Error(response.mensaje || 'Error al cargar repositorios');
    console.log(response.data)

    // Mapeamos la respuesta SQL de MySQL a las claves que espera React
    let data = response.data
    return data.map(repo => ({
      id: repo.id,
      name: repo.nombre,
      desc: repo.descripcion || 'Sin descripción',
      visibility: repo.visibilidad,
      defaultBranch: repo.rama_activa,
      lang: repo.lenguaje_principal,
      updated: new Date(repo.fecha_creacion).toLocaleDateString(),
      files: [],
      branches: [{ name: 'main', isDefault: true }],
      commits: []
    }));
  },

  // 3. CREAR UN NUEVO REPOSITORIO (POST /api/proyectos)
  createRepo: async (repoData) => {
    const res = await fetch(`${API_URL}/proyectos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        nombre: repoData.name,
        descripcion: repoData.desc,
        visibilidad: repoData.visibility === 'private' ? 'Privado' : 'Publico',
        ruta: `/var/minigit/repos/${repoData.name}` // Ruta interna en backend
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error al crear el repositorio');

    return {
      id: data.id,
      name: repoData.name,
      desc: repoData.desc,
      visibility: repoData.visibility === 'private' ? 'Privado' : 'Publico',
      defaultBranch: 'main',
      updated: 'Hace un momento',
      files: [],
      branches: [{ name: 'main', isDefault: true }],
      commits: []
    };
  },

  // 4. OBTENER DETALLES Y COMMITS DE UN REPO (GET /api/proyectos/:id/commits)
  getRepoCommits: async (repoId) => {
    const res = await fetch(`${API_URL}/proyectos/${repoId}/commits`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const dataCruda = await res.json();
    const data = dataCruda.data
    console.log(data)
    if (!res.ok) throw new Error(data.mensaje || 'Error al obtener commits');

    return data.map(c => ({
      hash: c.hash_version.substring(0, 7),
      fullHash: c.hash_version,
      author: c.autor || 'Desarrollador',
      date: new Date(c.fecha).toLocaleDateString(),
      msg: c.mensaje,
      branch: c.nombre,
      verified: true
    }));
  },

  // 5. CREAR UN COMMIT / REGISTRAR ETIQUETA (POST /api/proyectos/:id/commits)
  createCommit: async (repoId, commitData) => {
    const res = await fetch(`${API_URL}/proyectos/${repoId}/commits`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        mensaje: commitData.msg,
        descripcion: commitData.desc || '',
        id_rama: commitData.branchId || 1,
        contenido: commitData.codeContent || ''
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error al guardar el commit');
    return data;
  },

  // 6. ELIMINAR UN REPOSITORIO (DELETE /api/proyectos/:id)
  deleteRepo: async (repoId) => {
    const res = await fetch(`${API_URL}/proyectos/${repoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error al eliminar el repositorio');
    return true;
  },

  // Obtener ramas de un proyecto desde MySQL
  getRepoBranches: async (repoId) => {
    const res = await fetch(`${API_URL}/proyectos/${repoId}/ramas`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.mensaje || 'Error al obtener las ramas del repositorio');
    }

    const data = await res.json();
    console.log("data rama" + data)

    // Mapeo defensivo a la estructura que usa la UI de React
    return data.map(r => ({
      id: r.id,
      name: r.nombre,
      isDefault: r.activa === 'Si',
      versionBaseId: r.id_version_base,
      createdAt: r.fecha_creacion ? new Date(r.fecha_creacion).toLocaleDateString() : 'Sin fecha'
    }));
  }
};