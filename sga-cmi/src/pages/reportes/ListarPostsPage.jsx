import React from 'react';
import ListarPosts from '../../components/reportes/ListarPosts';
import Layout from '../../components/layout/Layout';

const ListarPostsPage = () => {
  return <Layout children={<ListarPosts />} />;
};

export default ListarPostsPage;
