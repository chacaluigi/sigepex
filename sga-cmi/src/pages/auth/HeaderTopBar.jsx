import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const HeaderTopBar = () => {
  return (
    <Box
      bg="primary.100"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      color="white"
      py={3}
      px={6}
      mb={2}
      boxShadow="md"
      zIndex="1000"
    >
      <Flex justify="space-between" align="center">
        <Text fontSize="md" fontWeight="bold">
          SIGEPEX - Sistema de Gestión de Posts en X
        </Text>
        <Link
          href="http://127.0.0.1:5500/mindef.html" // 🔹 Reemplaza con la URL de la empresa
          fontSize="md"
          color="white"
          fontWeight="semibold"
          _hover={{ textDecoration: 'underline' }}
        >
          Volver a Página Informativa <ExternalLinkIcon mx="2px" />
        </Link>
      </Flex>
    </Box>
  );
};

export default HeaderTopBar;
