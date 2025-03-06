import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Stack, Text, Image } from '@chakra-ui/react';
import { LoginForm } from './LoginForm';
import { ToastChakra } from '../../helpers/toast';
import { login, setSede } from '../../features/authSlice';
import bgGradient from '../../assets/img/gradient-bg.svg';
import logo2 from '../../assets/img/logo.png';
import HeaderTopBar from './HeaderTopBar';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.auth);

  // 🔹 Valores iniciales del formulario
  const initialValues = {
    correo: '',
    password: '',
    captcha: '',
  };

  // 🔹 Esquema de validación con Yup
  const validationSchema = Yup.object({
    correo: Yup.string()
      .email('Ingrese un correo válido')
      .required('El correo es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
    captcha: Yup.string().required(
      '⚠️ Debes completar el CAPTCHA antes de ingresar.'
    ),
  });

  // 🔹 Manejo del login
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      console.log(values);
      const resultAction = await dispatch(login(values)).unwrap(); // 🔹 Unwrap para manejar errores correctamente

      // 🔹 Obtener las sedes del usuario
      const sedes = resultAction?.usuario?.sedes || [];
      if (sedes.length > 0) {
        const sedeSeleccionada = sedes[0]; // Selecciona automáticamente la primera sede
        dispatch(setSede(sedeSeleccionada));
        localStorage.setItem(
          'sedeSeleccionada',
          JSON.stringify(sedeSeleccionada)
        );
      }
      navigate(`/${sedes[0]?._id}/`, { replace: true });
    } catch (error) {
      ToastChakra(
        'Error',
        error?.message || 'Credenciales incorrectas',
        'error',
        2500,
        'bottom'
      );
    }

    setSubmitting(false);
  };

  return (
    <>
      <HeaderTopBar />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Flex
              align="center"
              justify="center"
              minH="100vh"
              bgImage={bgGradient}
              bgSize="cover"
              bgPosition="center"
            >
              <Box
                bg="white"
                px={6}
                py={14}
                rounded="3xl"
                shadow="lg"
                maxW="xl"
                w="full"
                mx={4}
                borderWidth={1}
                borderColor="primary.100"
                _dark={{
                  borderColor: 'primary.800',
                  bg: 'gray.800',
                }}
              >
                <Stack spacing={6}>
                  <Header />
                  <LoginForm
                    isLoading={isSubmitting || isLoading}
                    setFieldValue={setFieldValue}
                  />
                </Stack>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>
    </>
  );
};

// 🔹 Componente de encabezado
const Header = () => (
  <Box textAlign="center">
    <Image
      src={logo2}
      alt="Logo del colegio"
      width={100}
      height={100}
      margin="0 auto"
    />
    <Heading fontSize="2xl" mt={4} fontWeight="black">
      SIGEPEX
    </Heading>
    <Text fontSize="md" color="gray.600" mt={2}>
      Sistema para la Gestión de Posts en X
    </Text>
  </Box>
);

export default Login;
