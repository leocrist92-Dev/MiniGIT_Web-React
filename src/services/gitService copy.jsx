// ============================================================================
// 1. SERVICES (services/gitService.js)
// Capa de emulación de peticiones asíncronas a la Base de Datos / API Backend
// ============================================================================

const MOCK_DATABASE = {
  users: [
    { id: 1, username: 'luis_dev', email: 'ingeniero@minigit.dev', name: 'Luis Dev', role: 'Owner' },
    { id: 2, username: 'sena_instructor', email: 'instructor@sena.edu.co', name: 'SENA Instructor', role: 'Collaborator' }
  ],
  repos: [
    {
      id: 1,
      name: 'ADSO-Project',
      slug: 'adso-project',
      owner: 'luis_dev',
      visibility: 'Privado',
      lang: 'Python',
      updated: 'Hace 2 horas',
      desc: 'Proyecto final del SENA. Sistema backend con endpoints analíticos y pipelines de integración continua.',
      defaultBranch: 'main',
      branches: [
        { name: 'main', isDefault: true, protected: true, lastCommitMsg: 'Fix facade pattern bug', updated: 'hace 2 horas' },
        { name: 'feature/login-ui', isDefault: false, protected: false, lastCommitMsg: 'feat: add authorization UI mocks', updated: 'hace 1 día' },
        { name: 'bugfix/facade-bug', isDefault: false, protected: false, lastCommitMsg: 'fix: resolve deadlock on DB connection pool', updated: 'hace 3 días' }
      ],
      files: [
        { name: 'src', type: 'folder', msg: 'Update src architecture files & controllers', date: 'hace 2 días' },
        { 
          name: 'main.py', 
          type: 'file', 
          path: 'src/main.py', 
          msg: 'Fix facade pattern bug in service layer', 
          date: 'hace 5 horas', 
          size: '1.2 KB', 
          lines: 24, 
          content: 'import os\nimport sys\nfrom core.facade import MiniGitFacade\n\ndef main():\n    print("Inicializando Mini-Git CLI...")\n    app = MiniGitFacade()\n    app.run()\n\nif __name__ == "__main__":\n    main()' 
        },
        { 
          name: 'config.json', 
          type: 'file', 
          path: 'config.json', 
          msg: 'Configure database connection pool', 
          date: 'hace 3 días', 
          size: '0.8 KB', 
          lines: 10, 
          content: '{\n  "db_host": "localhost",\n  "db_name": "minigit_db"\n}' 
        },
        { 
          name: 'README.md', 
          type: 'file', 
          path: 'README.md', 
          msg: 'Initial commit: Project documentation & setup', 
          date: 'hace 1 semana', 
          size: '2.5 KB', 
          lines: 12, 
          content: '# ADSO-Project\n\nSistema de control de versiones ligero para proyectos del SENA.' 
        }
      ],
      commits: [
        {
          hash: 'a1b2c3d',
          fullHash: 'a1b2c3d4e5f67890123456789012345678901234',
          author: 'luis_dev',
          date: 'hace 5 horas',
          msg: 'Fix facade pattern bug',
          diffFile: 'src/facade.py',
          diffs: [
            { oldLine: 1, newLine: 1, type: 'unchanged', text: 'class MiniGitFacade:' },
            { oldLine: 2, newLine: null, type: 'deleted', text: '-     def execute(self): return False' },
            { oldLine: null, newLine: 2, type: 'added', text: '+     def execute(self):' },
            { oldLine: null, newLine: 3, type: 'added', text: '+         # Se corrige el patron facade' },
            { oldLine: null, newLine: 4, type: 'added', text: '+         return True' }
          ]
        },
        { hash: 'e4f5g6h', fullHash: 'e4f5g6h7i8j90123456789012345678901234567', author: 'luis_dev', date: 'hace 2 días', msg: 'Update src files and file handlers', diffFile: 'src/servicioVersionado.py', diffs: [] },
        { hash: 'c7d8e9f', fullHash: 'c7d8e9f012345678901234567890123456789012', author: 'luis_dev', date: 'hace 1 semana', msg: 'Initial commit', diffFile: 'README.md', diffs: [] }
      ]
    },
    {
      id: 2,
      name: 'react-portfolio',
      slug: 'react-portfolio',
      owner: 'luis_dev',
      visibility: 'Público',
      lang: 'JavaScript',
      updated: 'Hace 3 días',
      desc: 'Mi portafolio personal. Construido con React, Tailwind CSS y componentes modulares altamente estilizados.',
      defaultBranch: 'main',
      branches: [{ name: 'main', isDefault: true, lastCommitMsg: 'Add initial portfolio code', updated: 'hace 3 días' }],
      files: [{ name: 'App.jsx', type: 'file', path: 'App.jsx', msg: 'Add initial portfolio code', date: 'hace 3 días', size: '0.5 KB', lines: 5, content: 'export default function App() { return <h1>Hola Mundo</h1>; }' }],
      commits: [{ hash: 'f9e8d7c', fullHash: 'f9e8d7c6b5a43210987654321098765432109876', author: 'luis_dev', date: 'hace 3 días', msg: 'Add initial portfolio code', diffFile: 'App.jsx', diffs: [] }]
    }
  ]
};

export const gitService = {
  login: async (email, password) => {
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_DATABASE.users.find((u) => u.email === email) || {
      id: 1,
      username: 'luis_dev',
      email: email || 'ingeniero@minigit.dev',
      name: 'Luis Dev'
    };
  },
  getRepos: async () => {
    await new Promise((res) => setTimeout(res, 100));
    return [...MOCK_DATABASE.repos];
  },
  createRepo: async (repoData) => {
    await new Promise((res) => setTimeout(res, 300));
    const newRepo = {
      id: Date.now(),
      name: repoData.name,
      slug: repoData.name.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      owner: 'luis_dev',
      visibility: repoData.visibility === 'private' ? 'Privado' : 'Público',
      lang: 'Python',
      updated: 'Hace instantes',
      desc: repoData.desc || 'Nuevo repositorio en MiniGit',
      defaultBranch: 'main',
      branches: [{ name: 'main', isDefault: true, lastCommitMsg: 'Initial commit', updated: 'hace instantes' }],
      files: [{ name: 'README.md', type: 'file', path: 'README.md', msg: 'Initial commit', date: 'hace un momento', size: '0.1 KB', lines: 3, content: `# ${repoData.name}\n${repoData.desc || ''}` }],
      commits: [{ hash: '1a2b3c4', fullHash: '1a2b3c4d5e6f7890123456789012345678901234', author: 'luis_dev', date: 'hace un momento', msg: 'Initial commit', diffFile: 'README.md', diffs: [] }]
    };
    MOCK_DATABASE.repos.unshift(newRepo);
    return newRepo;
  },
  addBranch: async (repoId, branchName) => {
    await new Promise((res) => setTimeout(res, 100));
    const repo = MOCK_DATABASE.repos.find((r) => r.id === repoId);
    if (repo) {
      repo.branches.push({ name: branchName, isDefault: false, lastCommitMsg: 'Nueva rama creada', updated: 'hace instantes' });
      return [...repo.branches];
    }
    return [];
  },
  deleteBranch: async (repoId, branchName) => {
    await new Promise((res) => setTimeout(res, 100));
    const repo = MOCK_DATABASE.repos.find((r) => r.id === repoId);
    if (repo) {
      repo.branches = repo.branches.filter((b) => b.name !== branchName);
      return [...repo.branches];
    }
    return [];
  },
  deleteRepo: async (repoId) => {
    await new Promise((res) => setTimeout(res, 200));
    MOCK_DATABASE.repos = MOCK_DATABASE.repos.filter((r) => r.id !== repoId);
    return true;
  }
};