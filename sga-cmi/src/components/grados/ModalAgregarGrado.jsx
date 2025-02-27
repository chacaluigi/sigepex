import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { VscAdd } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { createGrado } from '../../features/gradoSlice';
import { getAllAcademicYear, reset } from '../../features/academicYearSlice';
import { ToastChakra } from '../../helpers/toast';

const ModalAgregarGrado = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { academic_year, isError, message } = useSelector(
    state => state.academic_year
  );

  const initialValues = {
    nombre: '',
    descripcion: '',
    nivel: '',
    academic_year: '',
  };

  const [indice, setIndice] = useState(initialValues);

  useEffect(() => {
    dispatch(getAllAcademicYear());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isError) {
    ToastChakra('Error', message, 'error', 1500);
    console.log(message);
  }

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIndice(initialValues);
  };

  const handleSave = () => {
    dispatch(createGrado(indice));
    setIsModalOpen(false);
    setIndice(initialValues);
  };

  return (
    <>
      <Tooltip hasArrow label="Agregar Nuevo Registro" placement="auto">
        <IconButton
          colorScheme="primary"
          _dark={{
            bg: 'primary.100',
            color: 'white',
            _hover: { bg: 'primary.300' },
          }}
          aria-label="Agregar"
          icon={<Icon as={VscAdd} fontSize="2xl" />}
          variant="solid"
          onClick={handleModalOpen}
          rounded="xl"
        />
      </Tooltip>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        size="5xl"
        isCentered
      >
        <ModalOverlay
          bg="rgba(11,15,25, 0.8)"
          backdropFilter="auto"
          backdropBlur="2px"
        />
        <ModalContent _dark={{ bg: 'primary.1000' }} borderRadius="2xl">
          <ModalHeader textAlign="center">REGISTRAR NUEVO GRADO</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack
              spacing={4}
              direction="column"
              justifyContent="space-between"
              p={4}
            >
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">AÑO ACADEMICO</FormLabel>
                <Select
                  onChange={e =>
                    setIndice({ ...indice, academic_year: e.target.value })
                  }
                  value={indice.academic_year}
                >
                  <option>SELECCIONE UN AÑO ACADÉMICO</option>
                  {academic_year.map(data => (
                    <option key={data?._id} value={data?._id}>
                      {data.year}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">NOMBRE</FormLabel>
                <Input
                  placeholder="ESCRIBE EL NOMBRE"
                  type="text"
                  onChange={e =>
                    setIndice({ ...indice, nombre: e.target.value })
                  }
                  textTransform="uppercase"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">DESCRIPCIÓN</FormLabel>
                <Textarea
                  placeholder="Escribe la descripcion"
                  type="text"
                  onChange={e =>
                    setIndice({ ...indice, descripcion: e.target.value })
                  }
                />
              </FormControl>
              <Stack spacing={4} direction="row" justifyContent="space-between">
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">NIVEL EDUCATIVO</FormLabel>
                  <Select
                    placeholder="SELECCIONE UN NIVEL EDUCATIVO"
                    onChange={e =>
                      setIndice({ ...indice, nivel: e.target.value })
                    }
                  >
                    <option value="INICIAL">NIVEL INICIAL</option>
                    <option value="PRIMARIA">NIVEL PRIMARIA</option>
                    <option value="OTRO">OTRO</option>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              size="lg"
              mr={3}
              onClick={handleModalClose}
              borderRadius="xl"
            >
              CANCELAR
            </Button>
            <Button
              colorScheme="primary"
              _dark={{
                bg: 'primary.100',
                color: 'white',
                _hover: { bg: 'primary.300' },
              }}
              size="lg"
              mr={3}
              onClick={handleSave}
              disabled={indice.nombre === '' || indice.nivel === ''}
              borderRadius="xl"
            >
              GUARDAR
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalAgregarGrado;
