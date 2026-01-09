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
  Wrap,
  WrapItem,
  InputGroup,
  Select,
  InputLeftElement,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';
import { actualizarSolicitud } from '../../features/solicitudSlice';
import DateRangePicker from './DateRangePicker';
import fuenteService from '../../services/fuente.service';

const TagsInput = ({ tags, onAddTag, onRemoveTag, placeholder }) => {
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
          placeholder={placeholder}
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

const ModalConfigurarBusqueda = ({ isOpen, onClose, solicitud, token }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [tags, setTags] = useState([]);
  const [dateRange, setDateRange] = useState({
    inicio: null,
    fin: null,
  });

  // Estados para fuentes
  const [fuentes, setFuentes] = useState([]);
  const [fuentesFiltradas, setFuentesFiltradas] = useState([]);
  const [fuentesSeleccionadas, setFuentesSeleccionadas] = useState([]);
  const [busquedaFuente, setBusquedaFuente] = useState('');
  const [tipoFuente, setTipoFuente] = useState('Todos');
  const [tiposFuente, setTiposFuente] = useState([]);

  // Cargar fuentes y tipos al iniciar
  useEffect(() => {
    const cargarFuentes = async () => {
      try {
        const data = await fuenteService.obtenerFuentes(token);
        setFuentes(data);

        // Extraer tipos únicos de fuentes
        const tiposUnicos = [...new Set(data.map(f => f.tipo))];
        setTiposFuente(['Todos', ...tiposUnicos]);
      } catch (error) {
        toast({
          title: 'Error al cargar fuentes',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    cargarFuentes();
  }, [toast, token]);

  // Filtrar fuentes según búsqueda y tipo
  useEffect(() => {
    let resultados = fuentes;

    // Filtrar por tipo
    if (tipoFuente !== 'Todos') {
      resultados = resultados.filter(f => f.tipo === tipoFuente);
    }

    // Filtrar por texto de búsqueda
    if (busquedaFuente) {
      const termino = busquedaFuente.toLowerCase();
      resultados = resultados.filter(
        f =>
          f.nombre.toLowerCase().includes(termino) ||
          (f.usuario && f.usuario.toLowerCase().includes(termino))
      );
    }

    setFuentesFiltradas(resultados);
  }, [fuentes, busquedaFuente, tipoFuente]);

  //hasta aka

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
      // Cargar fuentes seleccionadas si existen
      if (solicitud.fuentes && Array.isArray(solicitud.fuentes)) {
        setFuentesSeleccionadas(
          solicitud.fuentes.map(f => (typeof f === 'string' ? { _id: f } : f))
        );
      }
      // Resetear y cargar fuentes seleccionadas
      setFuentesSeleccionadas(
        solicitud.fuentes && Array.isArray(solicitud.fuentes)
          ? solicitud.fuentes.map(f => (typeof f === 'string' ? { _id: f } : f))
          : [] // Asegurar array vacío si no hay fuentes
      );
    }
  }, [solicitud, isOpen]);

  const handleAddTag = useCallback(tag => {
    setTags(prev => [...prev, tag]);
  }, []);

  const handleRemoveTag = useCallback(index => {
    setTags(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleDateRangeChange = useCallback(newRange => {
    setDateRange(newRange);
  }, []);

  // Manejar agregar fuente seleccionada
  const handleAgregarFuente = fuente => {
    if (!fuentesSeleccionadas.some(f => f._id === fuente._id)) {
      setFuentesSeleccionadas(prev => [...prev, fuente]);
      setBusquedaFuente(''); // Limpiar búsqueda después de agregar
    }
  };

  // Manejar eliminar fuente seleccionada
  const handleEliminarFuente = index => {
    setFuentesSeleccionadas(prev => prev.filter((_, i) => i !== index));
  };

  // Seleccionar todas las fuentes actualmente visibles (filtradas)
  const handleSeleccionarTodasVisibles = () => {
    const nuevasFuentes = [...fuentesSeleccionadas];
    fuentesFiltradas.forEach(fuente => {
      if (!nuevasFuentes.some(f => f._id === fuente._id)) {
        nuevasFuentes.push(fuente);
      }
    });
    setFuentesSeleccionadas(nuevasFuentes);
  };

  // Deseleccionar todas las fuentes
  const handleDeseleccionarTodasVisibles = () => {
    setFuentesSeleccionadas([]);
  };

  // Seleccionar todas las fuentes del tipo actual
  const handleSeleccionarTodasDelTipo = () => {
    if (tipoFuente === 'Todos') return;

    const fuentesDelTipo = fuentes.filter(f => f.tipo === tipoFuente);
    const nuevasFuentes = [...fuentesSeleccionadas];

    fuentesDelTipo.forEach(fuente => {
      if (!nuevasFuentes.some(f => f._id === fuente._id)) {
        nuevasFuentes.push(fuente);
      }
    });

    setFuentesSeleccionadas(nuevasFuentes);
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        actualizarSolicitud({
          id: solicitud._id,
          solicitudData: {
            palabrasClave: tags,
            rangoFechaHora: dateRange,
            fuentes: fuentesSeleccionadas.map(f => f._id),
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
                placeholder="Escribe una palabra clave"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rango de fechas</FormLabel>
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </FormControl>
            <FormControl>
              {/* Tags de fuentes seleccionadas */}
              <Box mb={4}>
                <Wrap spacing={2}>
                  {fuentesSeleccionadas.map((fuente, index) => (
                    <WrapItem key={fuente._id}>
                      <Tag size="md" variant="subtle" colorScheme="teal">
                        <TagLabel>{fuente.nombre || fuente._id}</TagLabel>
                        <TagCloseButton
                          onClick={() => handleEliminarFuente(index)}
                        />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>

              {/* Buscador de fuentes */}
              <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
                <Stack spacing={4}>
                  <HStack>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                      </InputLeftElement>
                      <Input
                        value={busquedaFuente}
                        onChange={e => setBusquedaFuente(e.target.value)}
                        placeholder="Buscar fuentes..."
                      />
                    </InputGroup>
                    <Select
                      value={tipoFuente}
                      onChange={e => setTipoFuente(e.target.value)}
                      width="200px"
                    >
                      {tiposFuente.map(tipo => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </Select>
                  </HStack>

                  {/* Botones de selección masiva */}
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSeleccionarTodasVisibles()}
                      isDisabled={fuentesFiltradas.length === 0}
                    >
                      Seleccionar todas visibles
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeseleccionarTodasVisibles()}
                      isDisabled={fuentesSeleccionadas.length === 0}
                    >
                      Deseleccionar todas
                    </Button>
                    {tipoFuente !== 'Todos' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSeleccionarTodasDelTipo()}
                      >
                        Seleccionar todas de {tipoFuente}
                      </Button>
                    )}
                  </HStack>

                  {/* Lista de fuentes filtradas */}
                  <Box maxH="200px" overflowY="auto">
                    {fuentesFiltradas.length > 0 ? (
                      fuentesFiltradas.map(fuente => (
                        <Box
                          key={fuente._id}
                          p={2}
                          mb={1}
                          borderRadius="md"
                          bg={
                            fuentesSeleccionadas.some(f => f._id === fuente._id)
                              ? 'teal.50'
                              : 'transparent'
                          }
                          borderWidth="1px"
                          borderColor={
                            fuentesSeleccionadas.some(f => f._id === fuente._id)
                              ? 'teal.100'
                              : 'gray.100'
                          }
                          cursor="pointer"
                          _hover={{ bg: 'gray.50' }}
                          onClick={() => handleAgregarFuente(fuente)}
                        >
                          <Box fontWeight="bold">{fuente.nombre}</Box>
                          <Box fontSize="sm" color="gray.600">
                            @{fuente.usuario || 'sin usuario'}
                          </Box>
                          <Box fontSize="xs" color="gray.500">
                            {fuente.tipo}
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Box textAlign="center" color="gray.500" py={4}>
                        No se encontraron fuentes
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Box>
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
