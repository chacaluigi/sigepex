import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
  useDisclosure,
  IconButton,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  actualizarSolicitud,
  updateSolicitudOptimista,
} from '../../features/solicitudSlice';
import { getAllUsuarios } from '../../features/usuarioSlice';

const ModalEditarSolicitud = ({ solicitud }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();
  const bg = useColorModeValue('white', 'primary.1000');
  const { usuarios } = useSelector(state => state.usuarios);
  const { currentPage, perPage } = useSelector(state => state.solicitudes);

  const [formData, setFormData] = useState({
    estado: solicitud.estado,
    asignadoA: solicitud.asignadoA?._id || '',
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllUsuarios({ page: 1, perPage: 100 }));
    }
  }, [dispatch, isOpen]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Preparar datos para actualización
      const updateData = {
        estado: formData.estado,
        ...(formData.asignadoA && { asignadoA: formData.asignadoA }),
      };

      // Agregar fecha de finalización si cambia a Completado
      if (
        formData.estado === 'Completado' &&
        solicitud.estado !== 'Completado'
      ) {
        updateData.fecha_finalizacion = new Date();
      }

      // Crear objeto para actualización optimista
      const optimisticUpdate = {
        ...solicitud,
        ...updateData,
        ...(updateData.fecha_finalizacion && {
          fecha_finalizacion: updateData.fecha_finalizacion,
        }),
        // Mantener los objetos populate si existen
        usuario: solicitud.usuario,
        asignadoA: formData.asignadoA
          ? usuarios.find(u => u._id === formData.asignadoA)
          : null,
      };

      // Dispatch de la actualización optimista
      dispatch(updateSolicitudOptimista(optimisticUpdate));

      // Dispatch de la llamada API real
      const resultAction = await dispatch(
        actualizarSolicitud({
          id: solicitud._id,
          ...updateData,
        })
      );

      if (actualizarSolicitud.fulfilled.match(resultAction)) {
        toast({
          title: 'Solicitud actualizada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        // Si falla, revertir la actualización optimista
        dispatch(updateSolicitudOptimista(solicitud));
        throw resultAction.error;
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast({
        title: 'Error al actualizar',
        description: error.message || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <IconButton
        icon={<FiEdit />}
        variant="ghost"
        colorScheme="blue"
        onClick={onOpen}
        aria-label="Editar solicitud"
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bg}>
          <ModalHeader>Editar Solicitud</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completado">Completado</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Asignar a</FormLabel>
                <Select
                  name="asignadoA"
                  value={formData.asignadoA}
                  onChange={handleChange}
                  placeholder="Seleccionar usuario"
                >
                  <option value="">No asignado</option>
                  {usuarios?.map(usuario => (
                    <option key={usuario._id} value={usuario._id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Guardar cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalEditarSolicitud;
