import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeContent from '../pages/home';
import SettingsPage from '../pages/settings';
import PersonasPage from '../pages/personas';
import LoginPage from '../pages/auth/Login';
import NotFoundPage from '../pages/404/NotFoundPage';
import PrivateRoutes from './PrivateRoutes';
import PublicRoute from './PublicRoute';
import MiPerfilPage from '../pages/perfil';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import ResetPasswordPage from '../pages/auth/ResetPassword';
import PrivateTokenRoutes from './PrivateRoutesToken';
import { RolPage } from '../pages/RolPage';
import { ModuloPage } from '../pages/ModuloPage';
import SelectSede from '../pages/auth/SelectSede';
import ProcesoPage from '../pages/proceso';
import RegistrarUsuarioPage from '../pages/personas/RegistrarUsuarioPage';
import EditarUsuarioPage from '../pages/personas/EditarUsuarioPage';
import AsignarRolesPage from '../pages/personas/AsignarRolesPage';
import EstadoUsuariosPage from '../pages/personas/EstadoUsuariosPage';
import ListarUsuariosPage from '../pages/personas/ListarUsuariosPage';
import ReportesPage from '../pages/reportes';
import RegistrarReportePage from '../pages/reportes/RegistrarReportePage';
import EditarReportePage from '../pages/reportes/EditarReportePage';
import PalabrasClavePage from '../pages/definicion/PalabrasClavePage';
import FiltrosBusquedaPage from '../pages/definicion/FiltrosBusquedaPage';
import '../styles/globals.css';
import SolicitudPage from '../pages/solicitud';
import AgregarSolicitudPage from '../pages/solicitud/AgregarSolicitudPage';
import PaginaInstitucional from '../pages/paginaInstitucional/PaginaInstitucional';
import CriteriosPage from '../pages/definicion';
import ListarPostsPage from '../pages/reportes/ListarPostsPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/:idSede/" element={<HomeContent />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/perfil" element={<MiPerfilPage />} />
        <Route path="/:idSede/usuarios" element={<PersonasPage />} />
        <Route
          path="/:idSede/usuarios/registrar"
          element={<RegistrarUsuarioPage />}
        />
        <Route
          path="/:idSede/usuarios/editar"
          element={<EditarUsuarioPage />}
        />
        <Route path="/:idSede/usuarios/roles" element={<AsignarRolesPage />} />
        <Route
          path="/:idSede/usuarios/estado"
          element={<EstadoUsuariosPage />}
        />
        <Route
          path="/:idSede/usuarios/lista"
          element={<ListarUsuariosPage />}
        />

        <Route path="/:idSede/solicitud" element={<SolicitudPage />} />
        <Route
          path="/:idSede/solicitud/registrar"
          element={<AgregarSolicitudPage />}
        />
        <Route path="/:idSede/solicitud/listar" element={<SolicitudPage />} />
        <Route
          path="/:idSede/solicitud/criterios"
          element={<CriteriosPage />}
        />
        <Route
          path="/:idSede/solicitud/palabras"
          element={<PalabrasClavePage />}
        />

        <Route path="/:idSede/proceso" element={<ProcesoPage />} />
        <Route path="/:idSede/proceso/listar" element={<ProcesoPage />} />
        <Route path="/:idSede/proceso/iniciar" element={<ProcesoPage />} />

        <Route path="/:idSede/definicion" element={<CriteriosPage />} />
        <Route
          path="/:idSede/definicion/listar"
          element={<PalabrasClavePage />}
        />
        <Route
          path="/:idSede/definicion/filtros"
          element={<FiltrosBusquedaPage />}
        />
        <Route path="/:idSede/reports" element={<ReportesPage />} />
        <Route
          path="/:idSede/reports/registrar"
          element={<RegistrarReportePage />}
        />
        <Route path="/:idSede/reports/editar" element={<EditarReportePage />} />
        <Route path="/:idSede/reports/listar" element={<ReportesPage />} />
        <Route path="/:idSede/reports/posts" element={<ListarPostsPage />} />
        <Route path="/:idSede/roles" element={<RolPage />} />
        <Route path="/:idSede/modulos" element={<ModuloPage />} />
        <Route path="/select-sede" element={<SelectSede />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:email/:token"
          element={<PrivateTokenRoutes />}
        >
          <Route
            path="/reset-password/:email/:token"
            element={<ResetPasswordPage />}
          />
        </Route>
        <Route path="/uee" element={<PaginaInstitucional />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
