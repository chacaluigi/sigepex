import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';

export const ModalAgregarPalabra = ({ onAdd }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [palabra, setPalabra] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleSave = () => {
    if (!palabra || !categoria) return;
    onAdd({ id: Date.now(), palabra, categoria });
    setPalabra('');
    setCategoria('');
    onClose();
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        + Agregar Palabra
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Palabra Clave</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Palabra Clave</FormLabel>
                <Input
                  value={palabra}
                  onChange={e => setPalabra(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Categoría</FormLabel>
                <Select
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="Política">Política</option>
                  <option value="Económica">Económica</option>
                  <option value="Psicosocial">Psicosocial</option>
                  <option value="Militar">Militar</option>
                  <option value="Otro">Otro</option>
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
