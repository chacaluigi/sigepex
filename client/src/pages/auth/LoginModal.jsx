import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Stack,
  Image,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { ToastChakra } from '../../helpers/toast';
import { login, setSede } from '../../features/authSlice';
import logo2 from '../../assets/img/logo.png';

export const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.auth);

  const initialValues = {
    correo: '',
    password: '',
    captcha: '',
  };

  const validationSchema = Yup.object({
    correo: Yup.string()
      .email('Ingrese un correo válido')
      .required('El correo es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
    captcha: Yup.string().required('Completar el CAPTCHA antes de ingresar.'),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const resultAction = await dispatch(login(values)).unwrap();
      const sedes = resultAction?.usuario?.sedes || [];

      if (sedes.length > 0) {
        const sedeSeleccionada = sedes[0];
        dispatch(setSede(sedeSeleccionada));
        localStorage.setItem(
          'sedeSeleccionada',
          JSON.stringify(sedeSeleccionada)
        );
      }

      onClose(); // Cerrar modal después de login exitoso
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        px={2}
        py={10}
        rounded="3xl"
        borderWidth={2}
        borderColor="primary.100"
        _dark={{
          borderColor: 'primary.800',
          bg: 'gray.800',
        }}
      >
        <ModalHeader textAlign="center">
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
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <Stack spacing={6}>
                  <LoginForm
                    isLoading={isSubmitting || isLoading}
                    setFieldValue={setFieldValue}
                  />
                </Stack>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
