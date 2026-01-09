import {
  Flex,
  Heading,
  Button,
  Stack,
  Link,
  useBreakpointValue,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';
import { LoginModal } from '../../pages/auth/LoginModal';

const UEELogo = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="45" fill="#1A365D" />
    <path
      d="M30 35L50 20L70 35M50 20V80M30 35V65L50 80L70 65V35"
      stroke="#F7FAFC"
      strokeWidth="3"
    />
    <circle cx="50" cy="50" r="10" fill="#ECC94B" />
  </svg>
);

// Componente del Header con Menú de Navegación
export const Header = ({ onSectionClick }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={4}
      bg="white"
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      {/* Logo a la izquierda */}
      <Link href="#inicio" onClick={() => onSectionClick('inicio')}>
        <Flex align="center">
          <UEELogo size={48} />
          <Heading as="h1" size="lg" color="gray.800" fontWeight="medium">
            U.E.E.
          </Heading>
        </Flex>
      </Link>

      {/* Menú de navegación */}
      {!isMobile ? (
        <Stack direction="row" spacing={8}>
          <Link
            href="#mision"
            onClick={() => onSectionClick('mision')}
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: 'gray.900' }}
          >
            Misión
          </Link>
          <Link
            href="#organizacion"
            onClick={() => onSectionClick('organizacion')}
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: 'gray.900' }}
          >
            Organización
          </Link>
          <Link
            href="#contacto"
            onClick={() => onSectionClick('contacto')}
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: 'gray.900' }}
          >
            Contacto
          </Link>
        </Stack>
      ) : (
        <Button variant="ghost" onClick={onToggle}>
          ☰
        </Button>
      )}

      {/* Menú móvil */}
      {isMobile && isOpen && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          bg="white"
          p={4}
          boxShadow="md"
        >
          <Stack spacing={4}>
            <Link
              href="#mision"
              onClick={() => {
                onSectionClick('mision');
                onToggle();
              }}
              fontWeight="medium"
              color="gray.600"
              _hover={{ color: 'gray.900' }}
            >
              Misión
            </Link>
            <Link
              href="#organizacion"
              onClick={() => {
                onSectionClick('organizacion');
                onToggle();
              }}
              fontWeight="medium"
              color="gray.600"
              _hover={{ color: 'gray.900' }}
            >
              Organización
            </Link>
            <Link
              href="#contacto"
              onClick={() => {
                onSectionClick('contacto');
                onToggle();
              }}
              fontWeight="medium"
              color="gray.600"
              _hover={{ color: 'gray.900' }}
            >
              Contacto
            </Link>
          </Stack>
        </Box>
      )}

      {/* Botón de inicio de sesión */}
      <Button
        variant="outline"
        leftIcon={<FiUser />}
        size="sm"
        color="gray.600"
        _hover={{ bg: 'gray.50' }}
        onClick={onOpen}
      >
        Acceder
      </Button>
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};
