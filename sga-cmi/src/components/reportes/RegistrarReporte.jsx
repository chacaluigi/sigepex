import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createReport } from '../../features/reportSlice';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaSave, FaTimes } from 'react-icons/fa';

const RegistrarReporte = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [reporte, setReporte] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    fecha: '',
    fuente: '',
  });

  const handleChange = e => {
    setReporte({ ...reporte, [e.target.name]: e.target.value });
  };

  const handleSave = e => {
    e.preventDefault();
    if (
      !reporte.titulo ||
      !reporte.descripcion ||
      !reporte.categoria ||
      !reporte.fecha ||
      !reporte.fuente
    ) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }
    dispatch(createReport(reporte));
    navigate(-1);
    console.log('Reporte guardado:', reporte);
  };

  return (
    <>
      <Stack spacing={4} direction="row" alignItems="center" py={4} px={0}>
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
        <Heading size="lg">Registrar Reporte</Heading>
      </Stack>
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
            <FormLabel fontWeight="semibold">TEMA</FormLabel>
            <Input
              name="titulo"
              placeholder="Ingrese el título del reporte"
              type="text"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">DESCRIPCIÓN</FormLabel>
            <Textarea
              name="descripcion"
              placeholder="Ingrese la descripción del reporte"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>CATEGORÍA</FormLabel>
            <Select
              name="categoria"
              placeholder="Seleccione una categoría"
              onChange={handleChange}
            >
              <option value="Política">Política</option>
              <option value="Economía">Economía</option>
              <option value="Social">Social</option>
              <option value="Tecnología">Tecnología</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>FECHA</FormLabel>
            <Input name="fecha" type="date" onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>FUENTE</FormLabel>
            <Input
              name="fuente"
              placeholder="Ingrese la fuente de la información"
              type="text"
              onChange={handleChange}
            />
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

export default RegistrarReporte;
