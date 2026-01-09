import React from 'react';
import EstadoUsuarios from '../../components/usuarios/EstadoUsuarios';
import Layout from '../../components/layout/Layout';

const EstadoUsuariosPage = () => {
  return <Layout children={<EstadoUsuarios />} />;
};

export default EstadoUsuariosPage;
