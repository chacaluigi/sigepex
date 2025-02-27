import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  Select,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { createEstudiante } from '../../features/estudianteSlice';
import { ToastChakra } from '../../helpers/toast';
import { useNavigate } from 'react-router-dom';
import { getAllAcademicYear } from '../../features/academicYearSlice';
import { getGrados, reset } from '../../features/gradoSlice';
import { createMatricula } from '../../features/matriculaSlice';
import { RiFileList2Fill } from 'react-icons/ri';

const ModalRegistrarNuevaMatricula = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { grados, isError, message } = useSelector(state => state.grados);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.token) {
      navigate('/login');
    }

    dispatch(getAllAcademicYear());
    dispatch(getGrados());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);

  if (isError) {
    ToastChakra('Error', message, 'error', 1500);
    console.log(message);
  }

  const initialValues = {
    nombres: '',
    apellidos: '',
    dni: '',
    sexo: '',
    correo: '',
    celular: '',
    domicilio: '',
    fecha_nacimiento: '',
    nombre_padres: '',
    celular_padres: '',
    correo_padres: '',
    colegio_procedencia: '',
    tipo_estudiante: '',
    modalidad: '',
    grado: '',
    turno: '',
    img: '',
    observaciones: '',
    estado: '',
  };

  const [indice, setIndice] = useState(initialValues);

  const [cargando, setCargando] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIndice(initialValues);
  };

  const handleSave = e => {
    dispatch(createEstudiante(indice)).then(() => {
      setCargando(false);
      navigate('/estudiantes');
    });
    dispatch(createMatricula({

    }));
    setIsModalOpen(false);
    setIndice(initialValues);
  };

  return (
    <>
      <Button
        colorScheme="messenger"
        size="lg"
        fontSize={'sm'}
        onClick={handleModalOpen}
      >
        MATRICULAR ESTUDIANTE NUEVO
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
              <form onSubmit={handleSave}>
                <Box
                  borderRadius="2xl"
                  boxShadow="base"
                  overflow="hidden"
                  bg="white"
                  _dark={{ bg: 'primary.1000' }}
                  mt={4}
                  p={6}
                >
                  <Stack
                    spacing={4}
                    direction="column"
                    justifyContent="space-between"
                    p={2}
                  >
                    <Stack
                      spacing={2}
                      direction={{ base: 'column', lg: 'row' }}
                      justifyContent="space-between"
                    >
                      <FormControl isRequired>
                        <FormLabel fontWeight={'semibold'}>APELLIDOS</FormLabel>
                        <Input
                          placeholder="Escribe el apellidos"
                          type="text"
                          onChange={e =>
                            setIndice({
                              ...indice,
                              apellidos: e.target.value.toUpperCase(),
                            })
                          }
                          textTransform={'uppercase'}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontWeight={'semibold'}>NOMBRES</FormLabel>
                        <Input
                          placeholder="Escribe el nombre"
                          type="text"
                          onChange={e =>
                            setIndice({
                              ...indice,
                              nombres: e.target.value.toUpperCase(),
                            })
                          }
                          textTransform={'uppercase'}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontWeight={'semibold'}>DNI</FormLabel>
                        <Input
                          placeholder="Ejemplo: 70408950"
                          type="number"
                          onChange={e =>
                            setIndice({ ...indice, dni: e.target.value })
                          }
                        />
                        <FormHelperText textColor={'red.500'}>
                          {indice.dni?.length > 0 && indice.dni?.length < 8
                            ? 'El DNI debe tener al menos 8 caracteres'
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    </Stack>

                    <Stack
                      spacing={2}
                      direction={{ base: 'column', lg: 'row' }}
                      justifyContent="space-between"
                    >
                      <FormControl isRequired>
                        <FormLabel fontWeight={'semibold'}>GRADO</FormLabel>
                        <Select
                          placeholder="Selecciona una opción"
                          onChange={e =>
                            setIndice({ ...indice, grado: e.target.value })
                          }
                        >
                          {grados.map(grado => (
                            <option key={grado._id} value={grado._id}>
                              {grado.nombre}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                    <FormControl isRequired>
                      <FormLabel fontWeight={'semibold'}>SEXO</FormLabel>
                      <RadioGroup
                        onChange={e => setIndice({ ...indice, sexo: e })}
                      >
                        <Stack direction="row">
                          <Radio value={'M'}>MASCULINO</Radio>
                          <Radio value={'F'}>FEMENINO</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight={'semibold'}>CORREO</FormLabel>
                      <Input
                        placeholder="Escribe su correo"
                        type="email"
                        onChange={e =>
                          setIndice({ ...indice, correo: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight={'semibold'}>CELULAR</FormLabel>
                      <Input
                        placeholder="Escribe su # celular"
                        type="number"
                        onChange={e =>
                          setIndice({ ...indice, celular: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight={'semibold'}>DOMICILIO</FormLabel>
                      <Input
                        placeholder="Escribe su domicilio"
                        type="text"
                        onChange={e =>
                          setIndice({ ...indice, domicilio: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight={'semibold'}>
                        FECHA DE NACIMIENTO
                      </FormLabel>
                      <Input
                        type="date"
                        onChange={e =>
                          setIndice({
                            ...indice,
                            fecha_nacimiento: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                  </Stack>
                </Box>

                <Stack
                  spacing={4}
                  direction="row"
                  justifyContent="space-between"
                  py={6}
                  px={8}
                >
                  <Text fontSize="md">Más Detalles del estudiante</Text>
                  <Icon as={RiFileList2Fill} fontSize="xl" />
                </Stack>

                <Box
                  borderRadius="2xl"
                  boxShadow="base"
                  overflow="hidden"
                  bg="white"
                  _dark={{ bg: 'primary.1000' }}
                  p={6}
                >
                  <Stack
                    spacing={4}
                    direction="column"
                    justifyContent="space-between"
                    p={2}
                  >
                    <FormControl>
                      <FormLabel fontWeight={'semibold'}>
                        NOMBRES Y APELLIDOS DE LOS PADRE
                      </FormLabel>
                      <Input
                        placeholder="Ejemplo: JUAN"
                        type="text"
                        onChange={e =>
                          setIndice({
                            ...indice,
                            nombre_padres: e.target.value.toUpperCase(),
                          })
                        }
                        textTransform={'uppercase'}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight={'semibold'}>
                        CELULAR DE LOS PADRES
                      </FormLabel>
                      <Input
                        placeholder="Ejemplo: 987654321"
                        type="number"
                        onChange={e =>
                          setIndice({
                            ...indice,
                            celular_padres: e.target.value,
                          })
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight={'semibold'}>
                        CORREO DE LOS PADRES
                      </FormLabel>
                      <Input
                        placeholder="Ejemplo: usuario@gmail.com"
                        type="email"
                        onChange={e =>
                          setIndice({
                            ...indice,
                            correo_padres: e.target.value,
                          })
                        }
                      />
                    </FormControl>

                    <Stack
                      spacing={2}
                      direction={{ base: 'column', lg: 'row' }}
                    >
                      <FormControl>
                        <FormLabel fontWeight={'semibold'}>
                          COLEGIO DE PROCEDENCIA
                        </FormLabel>
                        <Input
                          placeholder="Ejemplo: MARIA AUXILIADORA"
                          type="text"
                          onChange={e =>
                            setIndice({
                              ...indice,
                              colegio_procedencia: e.target.value.toUpperCase(),
                            })
                          }
                          textTransform={'uppercase'}
                        />
                      </FormControl>
                    </Stack>

                    <Stack
                      spacing={2}
                      direction={{ base: 'column', lg: 'row' }}
                    >
                      <FormControl isRequired>
                        <FormLabel fontWeight={'semibold'}>TURNO</FormLabel>
                        <RadioGroup
                          onChange={e => setIndice({ ...indice, turno: e })}
                        >
                          <Stack direction="row">
                            <Radio value={'MAÑANA'}>MAÑANA</Radio>
                            <Radio value={'TARDE'}>TARDE</Radio>
                            <Radio value={'NORMAL'}>NORMAL</Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                    <Stack spacing={2}>
                      <FormControl>
                        <FormLabel fontWeight={'semibold'}>
                          OBSERVACIONES
                        </FormLabel>
                        <Textarea
                          defaultValue={indice ? indice.observaciones : ''}
                          type="text"
                          onChange={e =>
                            setIndice({
                              ...indice,
                              observaciones: e.target.value,
                            })
                          }
                          placeholder="Escribe las observaciones acerca de la estudiante"
                          rows={2}
                        />
                      </FormControl>
                      <Stack spacing={4} direction="row">
                        <FormControl isRequired>
                          <FormLabel fontWeight={'semibold'}>ESTADO</FormLabel>
                          <RadioGroup
                            onChange={e => setIndice({ ...indice, estado: e })}
                          >
                            <Stack direction="row">
                              <Radio value={'ACTIVO'}>ACTIVO</Radio>
                              <Radio value={'INACTIVO'}>INACTIVO</Radio>
                              <Radio value={'RETIRADO'}>RETIRADO</Radio>
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                      </Stack>
                    </Stack>

                    <Stack spacing={4} direction="row" justifyContent="right">
                      <Button
                        colorScheme="purple"
                        _dark={{
                          bg: 'purple.500',
                          color: 'white',
                          _hover: { bg: 'purple.600' },
                        }}
                        loadingText="Guardando..."
                        spinnerPlacement="start"
                        isLoading={cargando ? true : false}
                        size="lg"
                        type="submit"
                        disabled={
                          indice.nombres === '' ||
                          indice.apellidos === '' ||
                          indice.dni === '' ||
                          indice.sexo === '' ||
                          indice.marca === ''
                            ? true
                            : false
                        }
                        borderRadius="xl"
                      >
                        Guardar
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </form>
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

export default ModalRegistrarNuevaMatricula;
