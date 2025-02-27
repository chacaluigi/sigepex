import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../theme/solarizedTheme';
import { Loading } from '../../helpers/Loading';
import ModalSeleccionarMatricula from './ModalSeleccionarMatricula';
import { getGrados, reset } from '../../features/gradoSlice';
import { CgArrowRight, CgEye } from 'react-icons/cg';

const Matriculas = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { grados, isLoading } = useSelector(state => state.grados);

  useEffect(() => {
    dispatch(getGrados());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Stack spacing={4} direction="row" justifyContent="space-between" py={4}>
        <Heading size="lg" fontWeight="bold">
          Matriculas
        </Heading>
        <ModalSeleccionarMatricula grados={grados} />
      </Stack>
      <Box
  borderRadius="2xl"
  overflow="hidden"
  boxShadow="base"
  bg="white"
  _dark={{ bg: 'gray.800' }}
  mt={4}
  pt={4}
>
  <Stack
    spacing={8}
    w="full"
    direction="column"
    p={6}
    justifyContent="center"
    alignItems="center"
  >
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
      {grados.map(data => (
        <Box
          key={data._id}
          p={6}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="2xl"
          boxShadow="md"
          bg="white"
          _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
          transition="all 0.3s ease-in-out"
          _hover={{
            transform: 'translateY(-5px)',
            boxShadow: 'xl',
          }}
          position="relative"
          overflow="hidden"
        >
          {/* Efecto de fondo decorativo */}
          <Box
            position="absolute"
            top={-10}
            right={-10}
            w={20}
            h={20}
            bg="primary.100"
            _dark={{ bg: 'primary.200' }}
            borderRadius="full"
            opacity={0.2}
          />
          <VStack spacing={4} align="center" textAlign="center">
            {/* Icono decorativo */}
            <Box
              p={3}
              bg="primary.50"
              _dark={{ bg: 'primary.100' }}
              borderRadius="full"
            >
              <Icon as={CgEye} w={6} h={6} color="primary.500" _dark={{ color: 'primary.600' }} />
            </Box>
            {/* Título del grado */}
            <Heading size="lg" color="primary.700" _dark={{ color: 'primary.100' }}>
              {data.nombre}
            </Heading>
            {/* Descripción */}
            <Text fontSize="md" color="gray.600" _dark={{ color: 'gray.300' }}>
              {data.descripcion || 'Sin descripción'}
            </Text>
            {/* Botón de acción */}
            <Button
              mt={4}
              colorScheme="primary"
              variant="solid"
              rightIcon={<Icon as={CgArrowRight} />}
              onClick={() => navigate(`/matriculas/grado/${data._id}`)}
            >
              Ver detalles
            </Button>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  </Stack>
</Box>
    </>
  );
};

export default Matriculas;
