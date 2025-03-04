import React from 'react';
import EditarUsuario from '../../components/usuarios/EditarUsuario';
import Layout from '../../components/layout/Layout';

const EditarUsuarioPage = () => {
  return <Layout children={<EditarUsuario />} />;
};

export default EditarUsuarioPage;
