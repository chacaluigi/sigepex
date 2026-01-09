import React, { useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { Header } from '../../components/paginaInstitucional/Header';
import { Banner } from '../../components/paginaInstitucional/Banner';
import { Footer } from '../../components/paginaInstitucional/Footer';
import { Contacto } from '../../components/paginaInstitucional/Contacto';
import { Organizacion } from '../../components/paginaInstitucional/Organizacion';
import { MisionValores } from '../../components/paginaInstitucional/MisionValores';

// Componente principal de la página
const PaginaInstitucional = () => {
  const sections = {
    inicio: useRef(null),
    mision: useRef(null),
    organizacion: useRef(null),
    contacto: useRef(null),
  };

  const handleSectionClick = section => {
    sections[section].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };
  return (
    <Box>
      <Header onSectionClick={handleSectionClick} />

      <Box ref={sections.inicio}>
        <Banner />
      </Box>

      <Box ref={sections.mision}>
        <MisionValores />
      </Box>

      <Box ref={sections.organizacion}>
        <Organizacion />
      </Box>

      <Box ref={sections.contacto}>
        <Contacto />
      </Box>

      <Footer />
    </Box>
  );
};

export default PaginaInstitucional;
