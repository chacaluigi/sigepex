import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FiltrosBusqueda = ({ onApplyFilters }) => {
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    categoria: '',
    palabraClave: '',
    fuente: '',
  });

  const handleChange = e => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = e => {
    e.preventDefault();
    onApplyFilters(filtros); // Llamar a la función que aplica los filtros
  };

  return (
    <>
      <Stack
        spacing={4}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        py={4}
        px={0}
      >
        <IconButton
          icon={<ArrowBackIcon boxSize={8} />}
          onClick={() => navigate(-1)}
          aria-label="Volver"
          variant="ghost"
        />
        <Heading size="md" color="gray.600">
          Reportes
        </Heading>
        <Icon as={ChevronRightIcon} color="gray.500" boxSize={8} />
        <Heading size="lg">Definir Filtros de Búsqueda</Heading>
      </Stack>

      <form onSubmit={handleApplyFilters}>
        <Stack
          spacing={5}
          p={6}
          maxW="600px"
          mx="auto"
          borderRadius="2xl"
          borderTop="2px"
          borderTopColor="primary.100"
          overflow="hidden"
          boxShadow="base"
          bg="white"
          _dark={{ bg: 'primary.1000' }}
        >
          {/* 📅 Fecha Inicio */}
          <FormControl>
            <FormLabel fontWeight="semibold">Fecha de Inicio</FormLabel>
            <Input name="fechaInicio" type="date" onChange={handleChange} />
          </FormControl>

          {/* 📅 Fecha Fin */}
          <FormControl>
            <FormLabel fontWeight="semibold">Fecha de Fin</FormLabel>
            <Input name="fechaFin" type="date" onChange={handleChange} />
          </FormControl>

          {/* 📂 Categoría */}
          <FormControl>
            <FormLabel fontWeight="semibold">Categoría</FormLabel>
            <Select
              name="categoria"
              placeholder="Seleccione una categoría"
              onChange={handleChange}
            >
              <option value="Todos">Todos</option>
              <option value="Política">Política</option>
              <option value="Económica">Económica</option>
              <option value="Social">Social</option>
              <option value="Seguridad">Seguridad</option>
            </Select>
          </FormControl>

          {/* 🔎 Botones */}
          <Stack direction="row" spacing={6} pt={4}>
            <Button
              borderRadius="xl"
              size="lg"
              onClick={() => navigate(-1)}
              leftIcon={<FaTimes />}
            >
              CANCELAR
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              borderRadius="xl"
              size="lg"
              leftIcon={<FaSearch />}
            >
              APLICAR FILTROS
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default FiltrosBusqueda;
