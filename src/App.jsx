import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { SkeletonLoader } from './components/SkeletonLoader';

// Lazy load das páginas para code splitting
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Perfil = lazy(() => import('./pages/Perfil').then(m => ({ default: m.Perfil })));
const EditarTurma = lazy(() => import('./pages/EditarTurma').then(m => ({ default: m.EditarTurma })));
const CadastrarUnidade = lazy(() => import('./pages/CadastrarUnidade').then(m => ({ default: m.CadastrarUnidade })));
const ListarUnidades = lazy(() => import('./pages/ListarUnidades').then(m => ({ default: m.ListarUnidades })));
const CadastrarUsuario = lazy(() => import('./pages/CadastrarUsuario').then(m => ({ default: m.CadastrarUsuario })));
const Coordenacao = lazy(() => import('./pages/Coordenacao').then(m => ({ default: m.Coordenacao })));
const CadastrarTurma = lazy(() => import('./pages/CadastrarTurma').then(m => ({ default: m.CadastrarTurma })));
const ListarTurmas = lazy(() => import('./pages/ListarTurmas').then(m => ({ default: m.ListarTurmas })));
const GestaoTurmas = lazy(() => import('./pages/GestaoTurmas').then(m => ({ default: m.GestaoTurmas })));
const CadastrarCoordenador = lazy(() => import('./pages/CadastrarCoordenador').then(m => ({ default: m.CadastrarCoordenador })));
const Observatorio = lazy(() => import('./pages/Observatorio').then(m => ({ default: m.Observatorio })));

// Um componente simples para proteger rotas privadas
function PrivateRoute({ children }) {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

// Rota exclusiva para alunos (bloqueia professores)
function AlunoRoute({ children }) {
  const { user } = useAuth();
  if (!user?.is_aluno || user?.is_professor) return <Navigate to="/dashboard" />;
  return children;
}

// Rota que exige ser professor
function ProfessorRoute({ children }) {
  const { user } = useAuth();
  if (!user?.is_professor) return <Navigate to="/dashboard" />;
  return children;
}

// Rota que bloqueia alunos
function NotAlunoRoute({ children }) {
  const { user } = useAuth();
  if (user?.is_aluno && !user?.is_professor && !user?.is_coordenador && !user?.is_admin) return <Navigate to="/dashboard" />;
  return children;
}

// Rota que exige gestor (admin/coord nacional/coord)
function GestorRoute({ children }) {
  const { user } = useAuth();
  if (!user?.is_admin && !user?.is_coordenador_nacional && !user?.is_coordenador) return <Navigate to="/dashboard" />;
  return children;
}

// Rota que permite alunos ou professores
function AlunoOrProfessorRoute({ children }) {
  const { user } = useAuth();
  if (!user?.is_aluno && !user?.is_professor) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl">⏳</div></div>}>
        <Routes>
          {/* Rotas Publicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/observatorio" element={<Observatorio />} />
          <Route path="/cadastro" element={<CadastrarUsuario />} />

          {/* Rota Privada: Dashboard (antiga Home) */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />

          <Route path="/perfil" element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          } />

          {/* Rota Privada: Editar Turma */}
          <Route path="/turma/editar/:id" element={
            <PrivateRoute>
              <EditarTurma />
            </PrivateRoute>
          } />
          <Route path="/unidades" element={<PrivateRoute><GestorRoute><ListarUnidades /></GestorRoute></PrivateRoute>} />
          <Route path="/unidades/nova" element={<PrivateRoute><GestorRoute><CadastrarUnidade /></GestorRoute></PrivateRoute>} />

          {/* Usuario */}
          <Route path="/usuarios/novo" element={<CadastrarUsuario />} />

          {/* Coordenacao */}
          <Route path="/coordenacao" element={<PrivateRoute><Coordenacao /></PrivateRoute>} />
          <Route path="/coordenacao/nova" element={
            <PrivateRoute>
              <CadastrarCoordenador />
            </PrivateRoute>
          } />

          {/* Turmas */}
          <Route path="/turmas" element={<PrivateRoute><AlunoRoute><ListarTurmas /></AlunoRoute></PrivateRoute>} />
          <Route path="/turmas/nova" element={<PrivateRoute><AlunoOrProfessorRoute><CadastrarTurma /></AlunoOrProfessorRoute></PrivateRoute>} />
          <Route path="/turmas/gestao" element={
            <PrivateRoute>
              <NotAlunoRoute>
                <GestaoTurmas />
              </NotAlunoRoute>
            </PrivateRoute>
          }/>

        </Routes>
        </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
