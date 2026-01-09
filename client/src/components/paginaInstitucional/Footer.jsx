import {
  Box,
  Heading,
  Text,
  Stack,
  Grid,
  GridItem,
  Container,
  Link,
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

// Componente del Footer
export const Footer = () => {
  return (
    <Box as="footer" bg="blue.900" color="white" py={12}>
      <Container maxW="container.lg">
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
          gap={8}
          mb={8}
        >
          <GridItem>
            <Heading as="h3" size="lg" mb={4} fontWeight="medium">
              U.E.E.
            </Heading>
            <Text color="gray.400">
              Garantizando la seguridad y protección de los intereses del
              Estado.
            </Text>
          </GridItem>

          <GridItem>
            <Heading as="h3" size="sm" mb={4} fontWeight="medium">
              Enlaces
            </Heading>
            <Stack spacing={2}>
              <Link href="#mision" color="gray.400" _hover={{ color: 'white' }}>
                Misión
              </Link>
              <Link
                href="#organizacion"
                color="gray.400"
                _hover={{ color: 'white' }}
              >
                Organización
              </Link>
              <Link
                href="#contacto"
                color="gray.400"
                _hover={{ color: 'white' }}
              >
                Contacto
              </Link>
            </Stack>
          </GridItem>

          <GridItem>
            <Heading as="h3" size="sm" mb={4} fontWeight="medium">
              Contacto
            </Heading>
            <Stack spacing={2} color="gray.400">
              <Text>Av. 20 de Octubre, La Paz</Text>
              <Text>uevaluacionestrategica22@gmail.com</Text>
              <Text>(+591-2) 2432525 - 2610400</Text>
            </Stack>
          </GridItem>

          <GridItem>
            <Heading as="h3" size="sm" mb={4} fontWeight="medium">
              Síguenos
            </Heading>
            <Stack direction="row" spacing={4}>
              <Link href="#" color="gray.400" _hover={{ color: 'white' }}>
                <FaFacebook size={20} />
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: 'white' }}>
                <FaTwitter size={20} />
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: 'white' }}>
                <FaLinkedin size={20} />
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: 'white' }}>
                <FaYoutube size={20} />
              </Link>
            </Stack>
          </GridItem>
        </Grid>

        <Box borderTop="1px" borderColor="gray.500" pt={4} textAlign="center">
          <Text color="gray.400">
            © {new Date().getFullYear()} Unidad de Evaluación Estratégica. Todos
            los derechos reservados.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};
