import {
  Box,
  Heading,
  Text,
  Container,
  Flex,
  Image,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { FiShield, FiCpu, FiDatabase } from 'react-icons/fi';
import orgChart from '../../assets/img/organizacion.png';

// Componente de Organización
export const Organizacion = () => {
  const features = [
    {
      title: 'Área de Análisis de Inteligencia',
      description: 'Procesamiento de información estratégica.',
      icon: <FiShield size={24} color="#3182CE" />, // Shield azul para seguridad nacional
      iconLabel: 'Icono de escudo representando seguridad estratégica',
    },
    {
      title: 'Área de Análisis de Datos Técnicos',
      description: 'Validación de fuentes de información.',
      icon: <FiCpu size={24} color="#00B5D8" />, // CPU en color cyan para tecnología
      iconLabel: 'Icono de CPU representando análisis técnico',
    },
    {
      title: 'Área de Base de Datos',
      description: 'Gestión documental clasificada.',
      icon: <FiDatabase size={24} color="#805AD5" />, // Base de datos en morado
      iconLabel: 'Icono de base de datos para gestión de información',
    },
  ];

  return (
    <Box py={{ base: 12, md: 20 }} bg="gray.50" id="organizacion">
      <Container maxW="container.lg">
        <Heading
          as="h2"
          size="xl"
          mb={12}
          textAlign="center"
          color="gray.800"
          fontWeight="medium"
        >
          Nuestra Organización
        </Heading>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={10}
          alignItems="start"
        >
          {/* Imagen del organigrama a la izquierda */}
          <Box
            position="relative"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            height="100%"
          >
            <Image
              src={orgChart}
              alt="Organigrama de la Unidad de Evaluación Estratégica"
              objectFit="contain"
              w="100%"
            />
            <Text
              fontSize="sm"
              textAlign="center"
              mt={2}
              color="gray.500"
              fontStyle="italic"
            >
              Estructura organizacional de la Unidad de Evaluación Estratégica
            </Text>
          </Box>

          {/* Áreas organizacionales en columna a la derecha */}
          <Stack spacing={6}>
            {features.map((item, index) => (
              <Box
                key={index}
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="sm"
                height="100%"
              >
                <Flex align="center" mb={4}>
                  <Box color="blue.500" mr={4}>
                    {item.icon}
                  </Box>
                  <Heading
                    as="h3"
                    size="md"
                    color="gray.800"
                    fontWeight="medium"
                  >
                    {item.title}
                  </Heading>
                </Flex>
                <Text color="gray.600" pl={10}>
                  {item.description}
                </Text>
              </Box>
            ))}
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
