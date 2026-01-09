import {
  Box,
  Heading,
  Text,
  Stack,
  Grid,
  GridItem,
  Container,
} from '@chakra-ui/react';

// Componente de Misión y Valores
export const MisionValores = () => {
  return (
    <Box py={{ base: 12, md: 20 }} id="mision">
      <Container maxW="container.lg">
        <Heading
          as="h2"
          size="xl"
          mb={12}
          textAlign="center"
          color="gray.600"
          fontWeight="medium"
        >
          Misión y Valores
        </Heading>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
          <GridItem>
            <Box p={6} borderRadius="lg" height="100%">
              <Heading
                as="h3"
                size="lg"
                mb={4}
                color="gray.600"
                fontWeight="medium"
              >
                Nuestra Misión
              </Heading>
              <Text color="gray.500" lineHeight="tall">
                La Unidad de Evaluación Estratégica tiene como misión producir
                evaluaciones estratégicas integrales mediante el análisis
                sistemático de información en los factores político, militar,
                económico y psicosocial, para asesorar al Ministerio de Defensa
                en la toma de decisiones que garanticen la seguridad del Estado
                y sus intereses nacionales.
              </Text>
            </Box>
          </GridItem>

          <GridItem>
            <Box p={6} borderRadius="lg" height="100%">
              <Heading
                as="h3"
                size="lg"
                mb={4}
                color="gray.600"
                fontWeight="medium"
              >
                Nuestros Valores
              </Heading>
              <Stack spacing={4}>
                <Box>
                  <Text fontWeight="medium" color="gray.400">
                    Rigor Analítico
                  </Text>
                  <Text color="gray.500">
                    Sustentamos nuestras evaluaciones en metodologías
                    estructuradas y análisis verificables.
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="medium" color="gray.400">
                    Oportunidad
                  </Text>
                  <Text color="gray.500">
                    Proporcionamos inteligencia procesada en los tiempos
                    requeridos por la cadena de mando.
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="medium" color="gray.400">
                    Integridad
                  </Text>
                  <Text color="gray.500">
                    Garantizamos el manejo ético de la información con estricto
                    apego a los protocolos de seguridad.
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="medium" color="gray.400">
                    Multidisciplinariedad
                  </Text>
                  <Text color="gray.500">
                    Integramos perspectivas diversas para un análisis
                    estratégico completo.
                  </Text>
                </Box>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
