import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  Grid,
  GridItem,
  Container,
} from '@chakra-ui/react';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

// Componente de Contacto
export const Contacto = () => {
  return (
    <Box py={{ base: 12, md: 20 }} id="contacto">
      <Container maxW="container.lg">
        <Heading
          as="h2"
          size="xl"
          mb={12}
          textAlign="center"
          color="gray.200"
          fontWeight="medium"
        >
          Contacto
        </Heading>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={10}>
          <GridItem>
            <Box>
              <Heading
                as="h3"
                size="lg"
                mb={6}
                color="gray.200"
                fontWeight="medium"
              >
                Información de Contacto
              </Heading>
              <Stack spacing={6} color="gray.400">
                <Flex align="center">
                  <Box mr={4} color="blue.500">
                    <FiMapPin size={20} />
                  </Box>
                  <Text>Sopocachi. Av. 20 de Octubre, La Paz, Bolivia</Text>
                </Flex>
                <Flex align="center">
                  <Box mr={4} color="blue.500">
                    <FiPhone size={20} />
                  </Box>
                  <Text>(+591-2) 2432525 - 2610400</Text>
                </Flex>
                <Flex align="center">
                  <Box mr={4} color="blue.500">
                    <FiMail size={20} />
                  </Box>
                  <Text>uevaluacionestrategica22@gmail.com</Text>
                </Flex>
                <Flex align="center">
                  <Box mr={4} color="blue.500">
                    <FiClock size={20} />
                  </Box>
                  <Text>Lunes a Viernes de 8:00 a 17:00</Text>
                </Flex>
              </Stack>
            </Box>
          </GridItem>

          <GridItem>
            <Box p={6} borderRadius="lg" border="1px" borderColor="gray.200">
              <Heading
                as="h3"
                size="lg"
                mb={6}
                color="gray.200"
                fontWeight="medium"
              >
                Envíanos un mensaje
              </Heading>
              <Stack spacing={4} color="gray.400">
                <Box>
                  <Text mb={2}>Nombre completo</Text>
                  <Box
                    as="input"
                    width="100%"
                    p={3}
                    border="1px"
                    borderColor="gray.300"
                    borderRadius="md"
                  />
                </Box>
                <Box>
                  <Text mb={2}>Correo electrónico</Text>
                  <Box
                    as="input"
                    width="100%"
                    p={3}
                    border="1px"
                    borderColor="gray.300"
                    borderRadius="md"
                  />
                </Box>
                <Box>
                  <Text mb={2}>Mensaje</Text>
                  <Box
                    as="textarea"
                    width="100%"
                    p={3}
                    border="1px"
                    borderColor="gray.300"
                    borderRadius="md"
                    rows="4"
                  />
                </Box>
                <Button colorScheme="blue" width="100%" mt={2}>
                  Enviar mensaje
                </Button>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
