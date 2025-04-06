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
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FiltrosAplicadosModal from './FiltrosAplicadosModal';

const FiltrosBusqueda = ({ onApplyFilters }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    categoria: '',
    palabraClave: '',
    fuente: '',
  });

  const handleChange = e => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = e => {
    e.preventDefault();

    // Validación de rango de fechas/horas
    if (filtros.fechaInicio && filtros.fechaFin) {
      const fechaInicio = new Date(
        `${filtros.fechaInicio}T${filtros.horaInicio || '00:00'}`
      );
      const fechaFin = new Date(
        `${filtros.fechaFin}T${filtros.horaFin || '23:59'}`
      );

      if (fechaInicio > fechaFin) {
        toast({
          title: 'Rango inválido',
          description: 'La fecha/hora de inicio no puede ser mayor a la de fin',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    //onApplyFilters(filtros);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(-1); // Opcional: volver atrás al cerrar
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
          Criterios de Búsqueda
        </Heading>
        <Icon as={ChevronRightIcon} color="gray.500" boxSize={8} />
        <Heading size="lg">Filtros de Búsqueda</Heading>
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
          {/* Campos de fecha y hora */}
          <FormControl>
            <FormLabel fontWeight="semibold">Fecha de Inicio</FormLabel>
            <Input name="fechaInicio" type="date" onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold">Hora de Inicio</FormLabel>
            <Input
              name="horaInicio"
              type="time"
              onChange={handleChange}
              disabled={!filtros.fechaInicio}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold">Fecha de Fin</FormLabel>
            <Input
              name="fechaFin"
              type="date"
              onChange={handleChange}
              min={filtros.fechaInicio}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold">Hora de Fin</FormLabel>
            <Input
              name="horaFin"
              type="time"
              onChange={handleChange}
              disabled={!filtros.fechaFin}
            />
          </FormControl>

          {/* Otros campos de filtro */}
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

          {/* Botones */}
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

      {/* Modal de confirmación */}
      <FiltrosAplicadosModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default FiltrosBusqueda;
