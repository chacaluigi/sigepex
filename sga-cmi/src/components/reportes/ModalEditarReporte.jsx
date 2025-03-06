import React, { useState } from 'react';
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
  Stack,
  Tooltip,
  Textarea,
} from '@chakra-ui/react';
import { VscEdit } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { updateReport } from '../../features/reportSlice';

export const ModalEditarReporte = ({ row }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialValues = {
    id: null,
    titulo: '',
    descripcion: '',
  };

  const [reporte, setReporte] = useState(initialValues);

  const handleModalOpen = data => {
    setIsModalOpen(true);
    setReporte(data);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    dispatch(updateReport({ id: reporte.id, reportData: reporte }));
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip hasArrow label="Editar" placement="auto">
        <IconButton
          colorScheme="gray"
          _dark={{ color: 'white', _hover: { bg: 'gray.500' } }}
          aria-label="Editar"
          icon={<Icon as={VscEdit} fontSize="2xl" />}
          variant="solid"
          onClick={() => handleModalOpen(row)}
          ml={2}
        />
      </Tooltip>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} size="5xl">
        <ModalOverlay
          bg="rgba(11,15,25, 0.8)"
          backdropFilter="auto"
          backdropBlur="2px"
        />
        <ModalContent _dark={{ bg: 'primary.1000' }} borderRadius="2xl">
          <ModalHeader textAlign="center">ACTUALIZAR REPORTE</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack
              spacing={4}
              direction="column"
              justifyContent="space-between"
              p={4}
            >
              <FormControl>
                <FormLabel fontWeight="semibold">TEMA</FormLabel>
                <Input
                  defaultValue={reporte?.tema || ''}
                  placeholder="Escribe el tema"
                  type="text"
                  onChange={e =>
                    setReporte({ ...reporte, tema: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">FACTOR</FormLabel>
                <Input
                  defaultValue={reporte?.factor?.join(', ') || ''}
                  placeholder="Ejemplo: Político, Psicosocial"
                  type="text"
                  onChange={e =>
                    setReporte({
                      ...reporte,
                      factor: e.target.value.split(', '),
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">LUGAR</FormLabel>
                <Input
                  defaultValue={reporte?.lugar?.join(', ') || ''}
                  placeholder="Ejemplo: Bolivia"
                  type="text"
                  onChange={e =>
                    setReporte({
                      ...reporte,
                      lugar: e.target.value.split(', '),
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">DEPARTAMENTO</FormLabel>
                <Input
                  defaultValue={reporte?.departamento || ''}
                  placeholder="Escribe el departamento"
                  type="text"
                  onChange={e =>
                    setReporte({ ...reporte, departamento: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">FUENTES</FormLabel>
                <Input
                  defaultValue={reporte?.fuentes?.join(', ') || ''}
                  placeholder="Ejemplo: ABI, Viceministerio de Comunicación"
                  type="text"
                  onChange={e =>
                    setReporte({
                      ...reporte,
                      fuentes: e.target.value.split(', '),
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">HECHO</FormLabel>
                <Textarea
                  defaultValue={reporte?.hecho || ''}
                  placeholder="Describe el hecho"
                  onChange={e =>
                    setReporte({ ...reporte, hecho: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">PROBABLE EVOLUCIÓN</FormLabel>
                <Textarea
                  defaultValue={reporte?.probable_evolucion || ''}
                  placeholder="Describe la probable evolución"
                  onChange={e =>
                    setReporte({
                      ...reporte,
                      probable_evolucion: e.target.value,
                    })
                  }
                />
              </FormControl>
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
              bg="primary.100"
              color="white"
              _hover={{ bg: 'primary.200' }}
              _dark={{
                bg: 'primary.100',
                color: 'white',
                _hover: { bg: 'primary.200' },
              }}
              size="lg"
              mr={3}
              onClick={handleUpdate}
              borderRadius="xl"
            >
              ACTUALIZAR
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
