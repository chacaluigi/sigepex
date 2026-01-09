import React from 'react';
import ListarUsuarios from '../../components/usuarios/ListarUsuarios';
import Layout from '../../components/layout/Layout';

const ListarUsuariosPage = () => {
  return <Layout children={<ListarUsuarios />} />;
};

export default ListarUsuariosPage;
