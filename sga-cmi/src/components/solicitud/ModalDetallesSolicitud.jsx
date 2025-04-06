import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
  Text,
  Badge,
  Divider,
  useDisclosure,
  IconButton,
  useColorModeValue,
  Box,
  Flex,
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ModalDetallesSolicitud = ({ solicitud }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('white', 'primary.1000');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getBadgeColor = estado => {
    switch (estado) {
      case 'Pendiente':
        return 'yellow';
      case 'En Proceso':
        return 'blue';
      case 'Completado':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <IconButton
        icon={<FiEye />}
        variant="ghost"
        colorScheme="blue"
        onClick={onOpen}
        aria-label="Ver detalles"
      />

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={bg}>
          <ModalHeader>Detalles de la Solicitud</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="bold">
                  {solicitud.titulo}
                </Text>
                <Badge
                  colorScheme={getBadgeColor(solicitud.estado)}
                  px={3}
                  py={1}
                  rounded="full"
                >
                  {solicitud.estado}
                </Badge>
              </Flex>

              <Divider />

              <Box>
                <Text fontWeight="semibold">Descripción:</Text>
                <Text mt={1} textAlign="justify">
                  {solicitud.descripcion || 'No hay descripción disponible'}
                </Text>
              </Box>

              <Stack direction="row" spacing={8}>
                <Box>
                  <Text fontWeight="semibold">Fecha creación:</Text>
                  <Text>
                    {format(
                      new Date(solicitud.fecha_creacion),
                      'dd MMM yyyy HH:mm',
                      { locale: es }
                    )}
                  </Text>
                </Box>

                {solicitud.fecha_finalizacion && (
                  <Box>
                    <Text fontWeight="semibold">Fecha finalización:</Text>
                    <Text>
                      {format(
                        new Date(solicitud.fecha_finalizacion),
                        'dd MMM yyyy HH:mm',
                        { locale: es }
                      )}
                    </Text>
                  </Box>
                )}
              </Stack>

              <Stack direction="row" spacing={8}>
                <Box>
                  <Text fontWeight="semibold">Creada por:</Text>
                  <Text>
                    {solicitud.usuario?.nombre || 'Usuario no disponible'}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="semibold">Asignada a:</Text>
                  <Text>{solicitud.asignadoA?.nombre || 'No asignado'}</Text>
                </Box>
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalDetallesSolicitud;
