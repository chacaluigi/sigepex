import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSolicitud } from '../../features/solicitudSlice';
import { getAllUsuarios } from '../../features/usuarioSlice';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaSave, FaTimes } from 'react-icons/fa';
import { ModuleHeader } from '../global/ModuleHeader';

const AgregarSolicitud = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { usuarios } = useSelector(state => state.usuarios);

  const [solicitud, setSolicitud] = useState({
    titulo: '',
    descripcion: '',
    prioridad: '',
    asignadoA: '',
    usuario: '', // <- Agregar este campo
  });

  const handleChange = e => {
    setSolicitud({ ...solicitud, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(getAllUsuarios({ page: 1, perPage: 10 }));
  }, [dispatch]);

  const usuario = useSelector(state => state.auth.user.usuario.id); // Extraer el ID del usuario autenticado
  const handleSave = e => {
    e.preventDefault();

    // Verificar si todos los campos requeridos están completos
    if (
      !solicitud.titulo ||
      !solicitud.descripcion ||
      !solicitud.prioridad ||
      !solicitud.asignadoA || // El ID de asignadoA debe estar presente
      !usuario // El ID del usuario debe estar presente
    ) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    // Asegúrate de que asignadoA es un ObjectId válido
    const nuevaSolicitud = {
      ...solicitud,
      usuario, // El ID del usuario autenticado
      asignadoA: solicitud.asignadoA, // El ID del usuario asignado
    };

    dispatch(createSolicitud(nuevaSolicitud));
    navigate(-1);
  };

  if (!usuarios) {
    return <p>Cargando datos...</p>;
  }

  return (
    <>
      <ModuleHeader
        moduleName="Gestión de Solicitudes de Análisis"
        submoduleName="Nueva Solicitud"
      />
      <form onSubmit={handleSave}>
        <Stack
          spacing={5}
          p={6}
          maxW="600px"
          mx="auto"
          borderRadius="2xl"
          borderTop={'2px'}
          borderTopColor={'primary.100'}
          overflow="hidden"
          boxShadow={'base'}
          bg="white"
          _dark={{ bg: 'primary.1000' }}
        >
          <FormControl isRequired>
            <FormLabel>TÍTULO</FormLabel>
            <Input
              name="titulo"
              placeholder="Ingrese el título de la solicitud"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">DESCRIPCIÓN</FormLabel>
            <Textarea
              name="descripcion"
              placeholder="Ingrese la descripción del análisis"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>PRIORIDAD</FormLabel>
            <Select
              name="prioridad"
              placeholder="Seleccione la prioridad"
              onChange={handleChange}
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>ASIGNAR A</FormLabel>
            <Select
              name="asignadoA"
              placeholder="Seleccione un usuario"
              onChange={handleChange}
            >
              {usuarios?.map(usuario => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.nombre}
                </option>
              ))}
            </Select>
          </FormControl>

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
              leftIcon={<FaSave />}
            >
              GUARDAR
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default AgregarSolicitud;
