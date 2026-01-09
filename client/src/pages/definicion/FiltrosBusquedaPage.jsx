import React from 'react';
import FiltrosBusqueda from '../../components/definicion/FiltrosBusqueda';
import Layout from '../../components/layout/Layout';

const FiltrosBusquedaPage = () => {
  const handleSearch = filtros => {
    console.log('Filtros aplicados:', filtros);
  };
  return <Layout children={<FiltrosBusqueda />} />;
};

export default FiltrosBusquedaPage;
