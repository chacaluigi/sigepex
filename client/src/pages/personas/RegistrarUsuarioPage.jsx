import React from 'react';
import RegistrarUsuario from '../../components/usuarios/RegistrarUsuario';
import Layout from '../../components/layout/Layout';

const RegistrarUsuarioPage = () => {
  return <Layout children={<RegistrarUsuario />} />;
};

export default RegistrarUsuarioPage;
