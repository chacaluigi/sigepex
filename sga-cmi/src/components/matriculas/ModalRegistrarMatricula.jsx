import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select as SelectChakra,
  Stack,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Search2Icon } from '@chakra-ui/icons';
import { getEstudianteSearch } from '../../features/estudianteSlice';
import { ToastChakra } from '../../helpers/toast';
import { Select } from 'chakra-react-select';
import { useNavigate } from 'react-router-dom';
import { getAllAcademicYear, reset } from '../../features/academicYearSlice';
import { createMatricula } from '../../features/matriculaSlice';

const ModalRegistrarMatricula = ({ grados }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { academic_year } = useSelector(state => state.academic_year);
  const { isError, message } = useSelector(state => state.matriculas);

  const gradosFilter = grados?.filter(data => data.estado === true);

  const academic_yearFilter = academic_year.filter(
    data => data.isActive === true
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.token) {
      navigate('/login');
    }

    dispatch(getAllAcademicYear());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);

  if (isError) {
    ToastChakra('Error', message, 'error', 1500);
    console.log(message);
  }

  const initialValues = {
    academic_year: '',
    estudiante: '',
    grado: '',
    comments: '',
  };

  const [indice, setIndice] = useState(initialValues);

  const [dataSearch, setDataSearch] = useState('');
  const [datosEstudiante, setDatosEstudiante] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState([]);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIndice(initialValues);
    setDatosEstudiante([]);
    setEstudianteSeleccionado([]);
  };

  const handleCloseModalSearch = () => {
    setOpenModalSearch(false);
    setDataSearch('');
  };

  const handleSearchEstudianteByDni = () => {
    dispatch(getEstudianteSearch(dataSearch)).then(res => {
      if (res.payload.length > 0) {
        setOpenModalSearch(true);
        setDatosEstudiante(res.payload);
      } else {
        ToastChakra(
          'NO SE ENCONTRARON REGISTROS',
          'No se encontró registros con los datos ingresados',
          'error',
          1500,
          'bottom'
        );
        setDatosEstudiante([]);
      }
    });
  };

  const handleSave = e => {
    e.preventDefault();
    dispatch(createMatricula(indice));
    setIsModalOpen(false);
    setIndice(initialValues);
    setDatosEstudiante([{}]);
  };

  const handleSelectEstudiante = data => {
    if (data) {
      setIndice({ ...indice, estudiante: data.value });
      setEstudianteSeleccionado(data);
    } else {
      setIndice({ ...indice, estudiante: '' });
      setEstudianteSeleccionado([]);
    }
  };

  const estudianteOptions = datosEstudiante.map(item => {
    return {
      value: item._id,
      label: `🧑‍🎓${item.apellidos}, ${item.nombres} 🎴 ${item.dni} `,
    };
  });

  const buttonRef = useRef(null);

  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === 'Return') {
      event.preventDefault();
      buttonRef.current.click();
    }
  };

  return (
    <>
      <Button
        colorScheme="primary.100"
        size="lg"
        fontSize={'sm'}
        onClick={handleModalOpen}
      >
        MATRICULAR ESTUDIANTE EXISTENTE
      </Button>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} size="full">
        <ModalOverlay />
        <form onSubmit={handleSave}>
          <ModalContent _dark={{ bg: 'primary.1000' }} borderRadius="none">
            <ModalHeader textAlign="center">
              REGISTRAR NUEVO PAGO DE UN ESTUDIANTE
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack
                spacing={4}
                direction={'column'}
                justifyContent="space-between"
              >
                <FormControl>
                  <FormLabel>AÑO ACADEMICO</FormLabel>
                  <SelectChakra
                    onChange={e =>
                      setIndice({ ...indice, academic_year: e.target.value })
                    }
                  >
                    <option>SELECCIONE EL AÑO ACADEMICO</option>
                    {academic_yearFilter.map(data => (
                      <option key={data?._id} value={data?._id}>
                        {data.year}
                      </option>
                    ))}
                  </SelectChakra>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">ESTUDIANTE</FormLabel>
                  <InputGroup size="md">
                    <Input
                      type={'text'}
                      placeholder="Buscar por dni, nombres y apellidos del estudiante"
                      defaultValue={dataSearch}
                      onChange={e => setDataSearch(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <InputRightElement width="2.5rem">
                      <Tooltip hasArrow label="Buscar por DNI" placement="auto">
                        <IconButton
                          ref={buttonRef}
                          aria-label="Buscar"
                          icon={<Icon as={Search2Icon} fontSize="md" />}
                          colorScheme={'green'}
                          _dark={{
                            bg: 'green.500',
                            color: 'white',
                            _hover: { bg: 'green.600' },
                          }}
                          variant="solid"
                          isDisabled={dataSearch.length <= 3 ? true : false}
                          onClick={handleSearchEstudianteByDni}
                        />
                      </Tooltip>
                      <Modal
                        isOpen={openModalSearch}
                        onClose={handleCloseModalSearch}
                        size={'4xl'}
                      >
                        <ModalOverlay />
                        <ModalContent
                          _dark={{ bg: 'primary.1000' }}
                          borderRadius="2xl"
                        >
                          <ModalHeader>SELECCIONE EL ESTUDIANTE</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <Select
                              placeholder="Seleccione el estudiante"
                              size="md"
                              onChange={handleSelectEstudiante}
                              options={estudianteOptions}
                              isClearable
                              isSearchable
                              colorScheme="pink"
                              className="chakra-react-select"
                              classNamePrefix="chakra-react-select"
                              variant="fulled"
                            />
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              colorScheme="purple"
                              _dark={{
                                bg: 'purple.500',
                                color: 'white',
                                _hover: { bg: 'purple.600' },
                              }}
                              rounded="xl"
                              onClick={handleCloseModalSearch}
                            >
                              ACEPTAR
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </InputRightElement>
                  </InputGroup>
                  {!estudianteSeleccionado?.value ? null : (
                    <FormHelperText>
                      El estudiante Seleccionado es :{' '}
                      <span style={{ color: 'purple', fontWeight: 'bold' }}>
                        {estudianteSeleccionado?.label}
                      </span>
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              <Stack
                spacing={4}
                direction={{ base: 'column', lg: 'row' }}
                justifyContent="space-between"
                mt={4}
              >
                <FormControl>
                  <FormLabel>GRADO A MATRICULAR</FormLabel>

                  <SelectChakra
                    onChange={e =>
                      setIndice({ ...indice, grado: e.target.value })
                    }
                  >
                    <option>SELECCIONE GRADO A MATRICULAR</option>
                    {gradosFilter.map(data => (
                      <option key={data?._id} value={data?._id}>
                        {data.nombre}
                      </option>
                    ))}
                  </SelectChakra>
                </FormControl>
              </Stack>
              <Stack
                spacing={4}
                direction="column"
                justifyContent="space-between"
                mt={4}
              >
                <FormControl>
                  <FormLabel fontWeight="semibold">COMENTARIO</FormLabel>
                  <Textarea
                    placeholder="Comentarios adicionales de la entrega"
                    onChange={e =>
                      setIndice({ ...indice, comments: e.target.value })
                    }
                    rows={4}
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                _dark={{
                  bg: 'red.500',
                  color: 'white',
                  _hover: { bg: 'red.600' },
                }}
                size="lg"
                mr={3}
                onClick={handleModalClose}
                borderRadius="xl"
              >
                CANCELAR
              </Button>
              <Button
                colorScheme="purple"
                _dark={{
                  bg: 'purple.500',
                  color: 'white',
                  _hover: { bg: 'purple.600' },
                }}
                size="lg"
                mr={3}
                type="submit"
                // isDisabled={
                //   !indice.academic_year || !indice.estudiante || !indice.grado
                // }
                borderRadius="xl"
              >
                REGISTRAR MATRICULA
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default ModalRegistrarMatricula;
