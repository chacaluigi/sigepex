import { Box, Heading, Text, Container } from '@chakra-ui/react';

// Componente del Banner
export const Banner = () => {
  return (
    <Box
      bg="gray.50"
      height={{ base: '300px', md: '400px' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      id="inicio"
      px={4}
    >
      <Container maxW="container.lg" textAlign="center">
        <Heading
          as="h2"
          size={{ base: 'xl', md: '2xl' }}
          color="gray.800"
          mb={4}
        >
          Unidad de Evaluación Estratégica del Ministerio de Defensa
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'xl' }}
          color="gray.600"
          maxW="2xl"
          mx="auto"
        >
          La Unidad de Evaluación Estratégica analiza y procesa información
          estratégica en base a los factores de poder para generar inteligencia
          que apoye la toma de decisiones del Ministerio de Defensa,
          garantizando la seguridad y protección de los intereses del Estado.
        </Text>
        {/*  <Button
          rightIcon={<FiArrowRight />}
          mt={8}
          colorScheme="blue"
          variant="outline"
          size="lg"
        >
          Conoce más
        </Button> */}
      </Container>
    </Box>
  );
};
