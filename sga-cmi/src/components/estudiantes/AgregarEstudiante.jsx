import React, { useState } from 'react'
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Icon,
    IconButton,
    Input,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Textarea
} from '@chakra-ui/react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { RiFileList2Fill } from 'react-icons/ri';
import { createEstudiante } from '../../features/estudianteSlice';

const AgregarEstudiante = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        turno: '',
        observaciones: '',
        estado: '',
    }

    const [indice, setIndice] = useState(initialValues);

    const [cargando, setCargando] = useState(false);

    const handleSave = (e) => {
        setCargando(true);
        e.preventDefault();
        dispatch(createEstudiante(indice)).then(() => {
            setCargando(false);

            navigate('/estudiantes');
        });
        setIndice(initialValues);
    };

    return (
        <>

            <Stack spacing={4} direction="row" justifyContent="space-between" py={4}>
                <HStack spacing={4} direction="row">
                    <Link to={'/estudiantes'}>
                        <IconButton icon={<FaArrowLeft />} colorScheme="gray" rounded="full" />
                    </Link>
                    <Text fontSize={{base: "xs", lg: "md"}}>Regresar</Text>
                </HStack>
                <HStack spacing={4} direction="row">
                    <Text fontSize={{ base: "xs", lg: "lg" }}>Agregar Nuevo Estudiante</Text>
                </HStack>
            </Stack>

            <form onSubmit={handleSave}>
                <Box
                    borderRadius="2xl"
                    boxShadow="base"
                    overflow="hidden"
                    bg="white"
                    _dark={{ bg: "primary.1000" }}
                    mt={4}
                    p={6}
                >

                    <Stack spacing={4} direction="column" justifyContent="space-between" p={2}>
                        <Stack spacing={2} direction={{ base: 'column', lg: "row" }} justifyContent="space-between">
                            <FormControl isRequired>
                                <FormLabel fontWeight={'semibold'}>APELLIDOS</FormLabel>
                                <Input
                                    placeholder="Escribe el apellidos"
                                    type="text"
                                    onChange={(e) => setIndice({ ...indice, apellidos: e.target.value.toUpperCase() })}
                                    textTransform={'uppercase'}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontWeight={'semibold'}>NOMBRES</FormLabel>
                                <Input
                                    placeholder="Escribe el nombre"
                                    type="text"
                                    onChange={(e) => setIndice({ ...indice, nombres: e.target.value.toUpperCase() })}
                                    textTransform={'uppercase'}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontWeight={'semibold'}>DNI</FormLabel>
                                <Input
                                    placeholder="Ejemplo: 70408950"
                                    type="number"
                                    onChange={(e) => setIndice({ ...indice, dni: e.target.value })}
                                />
                                <FormHelperText textColor={'red.500'}>
                                    {
                                        indice.dni?.length > 0 && indice.dni?.length < 8 ? 'El DNI debe tener al menos 8 caracteres' : ''
                                    }
                                </FormHelperText>
                            </FormControl>
                        </Stack>

                        <FormControl isRequired>
                            <FormLabel fontWeight={'semibold'}>SEXO</FormLabel>
                            <RadioGroup
                                onChange={(e) => setIndice({ ...indice, sexo: e })}
                            >
                                <Stack direction='row'>
                                    <Radio value={"M"}>MASCULINO</Radio>
                                    <Radio value={"F"}>FEMENINO</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontWeight={'semibold'}>CORREO</FormLabel>
                            <Input
                                placeholder="Escribe su correo"
                                type="email"
                                onChange={(e) => setIndice({ ...indice, correo: e.target.value })}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel fontWeight={'semibold'}>CELULAR</FormLabel>
                            <Input
                                placeholder="Escribe su # celular"
                                type="number"
                                onChange={(e) => setIndice({ ...indice, celular: e.target.value })}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel fontWeight={'semibold'}>DOMICILIO</FormLabel>
                            <Input
                                placeholder="Escribe su domicilio"
                                type="text"
                                onChange={(e) => setIndice({ ...indice, domicilio: e.target.value })}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel fontWeight={'semibold'}>FECHA DE NACIMIENTO</FormLabel>
                            <Input
                                type="date"
                                onChange={(e) => setIndice({ ...indice, fecha_nacimiento: e.target.value })}
                            />
                        </FormControl>

                    </Stack>

                </Box>

                <Stack spacing={4} direction="row" justifyContent="space-between" py={6}>
                    <Text fontSize="md">Más Detalles del estudiante</Text>
                    <Icon as={RiFileList2Fill} fontSize="xl" />
                </Stack>

                <Box
                    borderRadius="2xl"
                    boxShadow="base"
                    overflow="hidden"
                    bg="white"
                    _dark={{ bg: "primary.1000" }}
                    p={6}
                >

                    <Stack spacing={4} direction="column" justifyContent="space-between" p={2}>
                        <FormControl>
                            <FormLabel fontWeight={'semibold'}>NOMBRES Y APELLIDOS DE LOS PADRE</FormLabel>
                            <Input
                                placeholder='Ejemplo: JUAN'
                                type="text"
                                onChange={(e) => setIndice({ ...indice, nombre_padres: e.target.value.toUpperCase() })}
                                textTransform={'uppercase'}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel fontWeight={'semibold'}>CELULAR DE LOS PADRES</FormLabel>
                            <Input
                                placeholder='Ejemplo: 987654321'
                                type="number"
                                onChange={(e) => setIndice({ ...indice, celular_padres: e.target.value })}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel fontWeight={'semibold'}>CORREO DE LOS PADRES</FormLabel>
                            <Input
                                placeholder='Ejemplo: usuario@gmail.com'
                                type="email"
                                onChange={(e) => setIndice({ ...indice, correo_padres: e.target.value })}
                            />
                        </FormControl>

                        <Stack spacing={2} direction={{ base: 'column', lg: "row" }}>

                            <FormControl isRequired>
                                <FormLabel fontWeight={'semibold'}>TURNO</FormLabel>
                                <RadioGroup
                                    onChange={(e) => setIndice({ ...indice, turno: e })}
                                >
                                    <Stack direction='row'>
                                        <Radio value={"MAÑANA"}>MAÑANA</Radio>
                                        <Radio value={"TARDE"}>TARDE</Radio>
                                        <Radio value={"NORMAL"}>NORMAL</Radio>
                                    </Stack>
                                </RadioGroup>
                            </FormControl>

                        </Stack>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel fontWeight={'semibold'}>OBSERVACIONES</FormLabel>
                                <Textarea
                                    defaultValue={indice ? indice.observaciones : ''}
                                    type="text"
                                    onChange={(e) => setIndice({ ...indice, observaciones: e.target.value })}
                                    placeholder="Escribe las observaciones acerca de la estudiante"
                                    rows={2}
                                />
                            </FormControl>
                            <Stack spacing={4} direction="row">
                                <FormControl isRequired>
                                    <FormLabel fontWeight={'semibold'}>ESTADO</FormLabel>
                                    <RadioGroup
                                        onChange={(e) => setIndice({ ...indice, estado: e })}
                                    >
                                        <Stack direction='row'>
                                            <Radio value={"ACTIVO"}>ACTIVO</Radio>
                                            <Radio value={"INACTIVO"}>INACTIVO</Radio>
                                            <Radio value={"RETIRADO"}>RETIRADO</Radio>
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                            </Stack>

                        </Stack>

                        <Stack spacing={4} direction="row" justifyContent="right">
                            <Button
                                 colorScheme="primary"
                                 _dark={{
                                   bg: 'primary.100',
                                   color: 'white',
                                   _hover: { bg: 'primary.300' },
                                 }}
                                loadingText='Guardando...'
                                spinnerPlacement='start'
                                isLoading={cargando ? true : false}
                                size="lg"
                                type='submit'
                                isDisabled={indice.nombres === '' || indice.apellidos === '' || indice.dni === '' || indice.sexo === '' ? true : false}
                                borderRadius="xl"
                            >
                                Guardar registro
                            </Button>
                        </Stack>

                    </Stack>
                </Box>
            </form>

        </>
    )
}

export default AgregarEstudiante;