import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export const ProcesoFinalizado = ({ isOpen, onClose }) => {
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      isOpen={isOpen}
      isCentered
      size="xl"
    >
      <AlertDialogOverlay
        bg="rgba(11,15,25, 0.8)"
        backdropFilter="auto"
        backdropBlur="2px"
      />

      <AlertDialogContent
        py={6}
        _dark={{ bg: 'primary.1000' }}
        borderRadius="2xl"
      >
        <Flex textAlign="center" justifyContent="center" p={2}>
          <Icon as={AiOutlineCheckCircle} fontSize="9xl" color="green.500" />
        </Flex>

        <AlertDialogHeader textAlign="center" fontSize="3xl" fontWeight="bold">
          ✅ ¡Proceso Finalizado!
        </AlertDialogHeader>

        <AlertDialogBody textAlign="center" fontSize="xl">
          El proceso de gestión de posts ha sido completada con éxito.
        </AlertDialogBody>

        <AlertDialogFooter justifyContent="center" fontWeight="normal">
          <Button
            bg="primary.100"
            color="white"
            _hover={{ bg: 'primary.200' }}
            _dark={{
              bg: 'primary.100',
              color: 'white',
              _hover: { bg: 'primary.200' },
            }}
            size="lg"
            borderRadius="xl"
            onClick={onClose}
          >
            CERRAR
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
