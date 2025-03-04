import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUsuario } from '../../features/usuarioSlice';
import { getRoles } from '../../features/rolSlice';
import {
  ArrowBackIcon,
  ChevronRightIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';
import { FaSave, FaTimes } from 'react-icons/fa';

const RegistrarUsuario = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { roles } = useSelector(state => state.roles);

  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: '',
  });

  const handleChange = e => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSave = e => {
    e.preventDefault(); // Evita que el formulario se envíe automáticamente
    if (
      !usuario.nombre ||
      !usuario.correo ||
      !usuario.password ||
      !usuario.rol
    ) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }
    // Lógica para guardar el usuario
    dispatch(createUsuario(usuario));
    navigate(-1);
    console.log('Usuario guardado:', usuario);
  };

  if (!roles) {
    return <p>Cargando datos...</p>;
  }

  return (
    <>
      <Stack
        spacing={4}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        py={4}
        px={0}
      >
        <IconButton
          icon={<ArrowBackIcon boxSize={8} />}
          onClick={() => navigate(-1)}
          aria-label="Volver"
          variant="ghost"
        />
        <Heading size="md" color="gray.600">
          Usuarios
        </Heading>
        <Icon as={ChevronRightIcon} color="gray.500" boxSize={8} />
        <Heading size="lg">Registrar Usuario</Heading>
      </Stack>
      <form onSubmit={handleSave}>
        <Stack
          spacing={5}
          p={6}
          maxW="600px"
          mx="auto"
          borderRadius="2xl"
          borderTop={'2px'}
          borderTopColor={'primary.100'}
          overflow="hidden"
          boxShadow={'base'}
          bg="white"
          _dark={{ bg: 'primary.1000' }}
        >
          <FormControl isRequired>
            <FormLabel fontWeight="semibold">NOMBRES Y APELLIDOS</FormLabel>
            <Input
              name="nombre"
              placeholder="Ingrese los nombres y apellidos"
              type="text"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">CORREO</FormLabel>
            <Input
              name="correo"
              placeholder="Ingrese el correo"
              defaultValue={'@gmail.com'}
              type="email"
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>CONTRASEÑA</FormLabel>

            <InputGroup>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingrese la contraseña"
                onChange={handleChange}
              />
              <InputRightElement width="3rem">
                <Button
                  h="1.75rem"
                  bg="primary.100"
                  color="white"
                  _hover={{ bg: 'primary.200' }}
                  _dark={{
                    bg: 'primary.100',
                    color: 'white',
                    _hover: { bg: 'primary.200' },
                  }}
                  size="sm"
                  onClick={handleShowClick}
                >
                  {showPassword ? (
                    <Icon as={ViewIcon} />
                  ) : (
                    <Icon as={ViewOffIcon} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>ROL</FormLabel>
            <Select
              name="rol"
              placeholder="Seleccione rol de usuario"
              onChange={handleChange}
            >
              {roles?.map(rol => (
                <option key={rol._id} value={rol._id}>
                  {rol.nombre}
                </option>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={6} pt={4}>
            <Button
              borderRadius="xl"
              size="lg"
              onClick={() => navigate(-1)}
              leftIcon={<FaTimes />}
            >
              CANCELAR
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              borderRadius="xl"
              size="lg"
              leftIcon={<FaSave />}
            >
              GUARDAR
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default RegistrarUsuario;
