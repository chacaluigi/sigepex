import React, { useState, useRef } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Button,
  Stack,
  Text,
  Divider,
  Tooltip,
  Image,
} from '@chakra-ui/react';
import { CgEyeAlt } from 'react-icons/cg';

export const ModalDetallesReporte = ({ reporte }) => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const btnRef = useRef();
  const handleOpenDrawer = () => {
    setIsOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  return (
    <>
      <Tooltip hasArrow label="Ver Detalles" placement="auto">
        <IconButton
          aria-label="Ver"
          icon={<CgEyeAlt />}
          fontSize="xl"
          bg="primary.100"
          color="white"
          _hover={{ bg: 'primary.200' }}
          _dark={{
            bg: 'primary.100',
            color: 'white',
            _hover: { bg: 'primary.200' },
          }}
          variant={'ghost'}
          onClick={handleOpenDrawer}
          ml={2}
        />
      </Tooltip>
      <Drawer
        isOpen={isOpenDrawer}
        placement="bottom"
        onClose={handleCloseDrawer}
        finalFocusRef={btnRef}
        size="xl"
      >
        <DrawerOverlay />
        <DrawerContent _dark={{ bg: 'primary.1000' }}>
          <DrawerHeader
            fontWeight="bold"
            bg="primary.100"
            color="gray.200"
            textAlign="center"
          >
            DETALLES DEL REPORTE
          </DrawerHeader>
          <DrawerBody>
            <Stack direction="column" mt={6} px={[0, 10, 40, 60]}>
              {reporte?.image && (
                <Stack direction="row" justifyContent="center">
                  <Image
                    src={reporte.image}
                    alt="Imagen del reporte"
                    boxSize="200px"
                    borderRadius="md"
                  />
                </Stack>
              )}
              <Divider />
              <Stack
                direction={{ base: 'column', lg: 'row' }}
                justifyContent="space-between"
              >
                <Text fontWeight="bold">TÍTULO:</Text>
                <Text>{reporte?.tema}</Text>
              </Stack>
              <Divider />
              <Stack
                direction={{ base: 'column', lg: 'row' }}
                justifyContent="space-between"
              >
                <Text fontWeight="bold">FACTORES:</Text>
                <Text>{reporte?.factor?.join(', ')}</Text>
              </Stack>
              <Divider />
              <Stack
                direction={{ base: 'column', lg: 'row' }}
                justifyContent="space-between"
              >
                <Text fontWeight="bold">FUENTES:</Text>
                <Text>{reporte?.fuentes?.join(', ')}</Text>
              </Stack>
              <Divider />
              <Stack
                direction={{ base: 'column', lg: 'row' }}
                justifyContent="space-between"
              >
                <Text fontWeight="bold">FECHA Y HORA:</Text>
                <Text>
                  {reporte?.fecha} - {reporte?.hora}
                </Text>
              </Stack>
              <Divider />
              <Stack direction="column">
                <Text fontWeight="bold">HECHO:</Text>
                <Text>{reporte?.hecho}</Text>
              </Stack>
              <Divider />
              <Stack direction="column">
                <Text fontWeight="bold">ACTORES INVOLUCRADOS:</Text>
                {reporte?.actores?.map((actor, index) => (
                  <Text key={index}>
                    {actor.nombre} - {actor.cargo}
                  </Text>
                ))}
              </Stack>
              <Divider />
              <Stack direction="column">
                <Text fontWeight="bold">PROBABLE EVOLUCIÓN:</Text>
                <Text>{reporte?.probable_evolucion}</Text>
              </Stack>
              <Divider />
            </Stack>
          </DrawerBody>

          <DrawerFooter
            w="full"
            justifyContent="center"
            textAlign="center"
            alignItems="center"
            display="flex"
          >
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
              onClick={handleCloseDrawer}
              borderRadius="xl"
            >
              OK
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
