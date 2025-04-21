import { useState, useEffect, useCallback } from 'react';
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
  Stack,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
  Box,
  Flex,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';
import { actualizarSolicitud } from '../../features/solicitudSlice';
import DateRangePicker from './DateRangePicker';

const TagsInput = ({ tags, onAddTag, onRemoveTag }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onAddTag(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p={2}>
      <Flex flexWrap="wrap" gap={2} mb={2}>
        {tags.map((tag, index) => (
          <Tag key={index} size="md" variant="subtle" colorScheme="blue">
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton onClick={() => onRemoveTag(index)} />
          </Tag>
        ))}
      </Flex>
      <HStack>
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Escribe una palabra clave"
          size="sm"
        />
        <IconButton
          aria-label="Agregar palabra clave"
          icon={<AddIcon />}
          onClick={handleAdd}
          size="sm"
        />
      </HStack>
    </Box>
  );
};

const ModalConfigurarBusqueda = ({ isOpen, onClose, solicitud }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [tags, setTags] = useState([]);
  const [dateRange, setDateRange] = useState({
    inicio: null,
    fin: null,
  });

  useEffect(() => {
    if (solicitud) {
      setTags(
        Array.isArray(solicitud.palabrasClave)
          ? [...solicitud.palabrasClave]
          : []
      );
      setDateRange({
        inicio: solicitud.rangoFechaHora?.inicio || null,
        fin: solicitud.rangoFechaHora?.fin || null,
      });
    }
  }, [solicitud]);

  const handleAddTag = useCallback(tag => {
    setTags(prev => [...prev, tag]);
  }, []);

  const handleRemoveTag = useCallback(index => {
    setTags(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleDateRangeChange = useCallback(newRange => {
    setDateRange(newRange);
  }, []);

  const handleSubmit = async () => {
    try {
      await dispatch(
        actualizarSolicitud({
          id: solicitud._id,
          solicitudData: {
            palabrasClave: tags,
            rangoFechaHora: dateRange,
          },
        })
      ).unwrap();

      toast({
        title: 'Configuración actualizada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Configurar criterios de búsqueda</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <FormControl>
              <FormLabel>Palabras clave</FormLabel>
              <TagsInput
                tags={tags}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rango de fechas</FormLabel>
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalConfigurarBusqueda;
