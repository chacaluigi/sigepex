import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeContent from '../pages/home';
import SettingsPage from '../pages/settings';
import PersonasPage from '../pages/personas';
import LoginPage from '../pages/auth/Login';
import NotFoundPage from '../pages/404/NotFoundPage';
import PrivateRoutes from './PrivateRoutes';
import PublicRoute from './PublicRoute';
import GradosPage from '../pages/grados';
import UniformesPage from '../pages/uniformes';
import {
  ActivosPage,
  AgregarActivoPage,
  DetallesActivosPage,
  EditarActivoPage,
} from '../pages/activos';
import MiPerfilPage from '../pages/perfil';
import {
  EstudiantesPage,
  EstudiantesPageAgregar,
  EstudiantesPageDetalles,
  EstudiantesPageEditar,
  EstudiantesPageHistorialPagos,
} from '../pages/estudiantes';
import CategoriasEquipoPage from '../pages/activos/categorias';
import {
  DocentesPage,
  DocentesPageDetalles,
  DocentesPageAgregar,
} from '../pages/docentes';
import CategoriasUniformePage from '../pages/uniformes/categorias';
import { BoletaPagoPage, PagosPage, PagosPageDetalles } from '../pages/pagos';
import { ReportesEBRPage } from '../pages/reportes';
import '../styles/globals.css';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import ResetPasswordPage from '../pages/auth/ResetPassword';
import PrivateTokenRoutes from './PrivateRoutesToken';
import PeriodoEscolarPage from '../pages/academico';
import { ConceptoPagosPage } from '../pages/pagos/concepto';
import { MatriculaPage, MatriculaByGradoPage } from '../pages/matriculas';
import { EgresosPage, EgresosPageDetalles } from '../pages/egresos';
import { TramitesPage } from '../pages/tramites';
import { RolPage } from '../pages/RolPage';
import { ModuloPage } from '../pages/ModuloPage';
import SelectSede from '../pages/auth/SelectSede';
import ProcesoPage from '../pages/proceso';
import ReportsPage from '../pages/reports';
import AnalisisPage from '../pages/analisis';
import RegistrarUsuarioPage from '../pages/personas/RegistrarUsuarioPage';
import EditarUsuarioPage from '../pages/personas/EditarUsuarioPage';
import AsignarRolesPage from '../pages/personas/AsignarRolesPage';
import EstadoUsuariosPage from '../pages/personas/EstadoUsuariosPage';
import ListarUsuariosPage from '../pages/personas/ListarUsuariosPage';

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

        <Route path="/:idSede/proceso" element={<ProcesoPage />} />
        <Route path="/:idSede/reports" element={<ReportsPage />} />
        <Route path="/:idSede/analisis" element={<AnalisisPage />} />

        <Route path="/periodo-escolar" element={<PeriodoEscolarPage />} />
        <Route path="/grados" element={<GradosPage />} />
        <Route path="/:idSede/roles" element={<RolPage />} />
        <Route path="/:idSede/modulos" element={<ModuloPage />} />

        <Route path="/:idSede/matriculas/" element={<MatriculaPage />} />
        <Route
          path="/matriculas/grado/:id"
          element={<MatriculaByGradoPage />}
        />

        <Route path="/uniformes/" element={<UniformesPage />} />

        <Route path="/equipos/" element={<ActivosPage />} />
        <Route path="/equipos/:id" element={<DetallesActivosPage />} />
        <Route path="/equipos/agregar" element={<AgregarActivoPage />} />
        <Route path="/equipos/editar/:id" element={<EditarActivoPage />} />
        <Route path="/equipos/categorias" element={<CategoriasEquipoPage />} />

        <Route path="/:idSede/estudiantes" element={<EstudiantesPage />} />
        <Route
          path="/estudiantes/agregar"
          element={<EstudiantesPageAgregar />}
        />
        <Route path="/estudiantes/:id" element={<EstudiantesPageDetalles />} />
        <Route
          path="/estudiantes/editar/:id"
          element={<EstudiantesPageEditar />}
        />
        <Route
          path="/estudiantes/pagos/:id"
          element={<EstudiantesPageHistorialPagos />}
        />

        <Route path="/docentes/" element={<DocentesPage />} />
        <Route path="/docentes/agregar" element={<DocentesPageAgregar />} />
        <Route path="/docentes/:id" element={<DocentesPageDetalles />} />

        <Route path="/egresos/" element={<EgresosPage />} />
        <Route path="/egresos/:id" element={<EgresosPageDetalles />} />

        <Route path="/tramites/" element={<TramitesPage />} />

        <Route
          path="/uniformes/categorias"
          element={<CategoriasUniformePage />}
        />
        <Route path="/pagos/" element={<PagosPage />} />
        <Route path="/pagos/:id" element={<PagosPageDetalles />} />
        <Route path="/pagos/boleta/:id" element={<BoletaPagoPage />} />

        <Route path="/concepto_pagos/" element={<ConceptoPagosPage />} />

        <Route
          path="/:idSede/configuraciones"
          element={<ConceptoPagosPage />}
        />

        <Route path="/reportes" element={<ReportesEBRPage />} />

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
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
