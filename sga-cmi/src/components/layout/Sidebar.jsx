import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Importar useLocation
import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Spacer,
  Text,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import logo from '../../assets/img/logo.png';
import * as RiIcons from 'react-icons/ri';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

const getIconComponent = iconName => {
  // Buscar el icono en la biblioteca correspondiente
  if (iconName.startsWith('Ri')) {
    return RiIcons[iconName] || RiIcons.RiFileListFill; // Definir icono predeterminado
  }
  if (iconName.startsWith('Fa')) {
    return FaIcons[iconName] || FaIcons.FaRegFileAlt; // Definir icono predeterminado
  }
  if (iconName.startsWith('Md')) {
    return MdIcons[iconName] || MdIcons.MdFileCopy; // Definir icono predeterminado
  }
  return RiIcons.RiFileListFill; // Default if no match
};

export const NavItem = props => {
  const bgActiveLinkColor = useColorModeValue('gray.800', 'gray.800');
  const { icon, iconSize, children, isSelected, onClick, ...rest } = props;

  return (
    <Flex
      align="center"
      py="7px"
      borderRadius={'lg'}
      px={'4px'}
      cursor="pointer"
      _hover={{
        bg: bgActiveLinkColor,
      }}
      role="group"
      transition=".1s ease"
      onClick={onClick}
      {...rest}
    >
      {icon && (
        <Icon
          mx="4"
          ml={{ base: '1', md: '3' }}
          fontSize="23px"
          as={icon}
          color={isSelected ? 'primary.300' : 'inherit'}
          {...rest}
        />
      )}
      {children}
    </Flex>
  );
};

function Sidebar({ isOpen }) {
  const location = useLocation(); // Obtener la ubicación actual
  const { user, sedeSeleccionada } = useSelector(state => state.auth);

  const activeLinkcolor = useColorModeValue('white', 'white');
  const bgActiveLinkColor = useColorModeValue('gray.800', 'gray.800');

  const [activeMenu, setActiveMenu] = useState(null); // Estado para rastrear el menú abierto

  const toggleMenu = index => {
    setActiveMenu(activeMenu === index ? null : index); // Cerrar si se hace clic de nuevo
  };

  // Función para generar rutas dinámicas
  const generateRoute = path => {
    const cleanPath = path.startsWith('/') ? path : `${path}`; // Asegurar que la ruta comience con /
    return `/${sedeSeleccionada?._id}${cleanPath}`;
  };

  // Función para verificar si la ruta está activa
  const isRouteActive = path => {
    return location.pathname === generateRoute(path);
  };

  // Detectar si alguna subruta está activa para expandir el menú
  useEffect(() => {
    user?.usuario?.rol?.modulos?.forEach((item, index) => {
      if (
        isRouteActive(item.path) ||
        item.submenus?.some(sub => isRouteActive(sub.path))
      ) {
        setActiveMenu(index);
      }
    });
  }, [location.pathname, user, isRouteActive]);

  return (
    <Box
      w={{ base: isOpen ? '0' : '0', lg: '280px' }}
      display={{
        base: isOpen ? 'block' : 'none',
      }}
      bgColor="primary.1000"
      _dark={{
        bgColor: 'primary.1000',
        color: 'white',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      borderRight="0.1px solid rgba(0, 0, 0, 0.02)"
      color="white"
      pos="fixed"
      top="0"
      left="0"
      bottom="0"
      h="calc(100vh - 0rem)"
      overflow="hidden"
      overflowY="auto"
      zIndex="0"
      transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
      transition="width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms"
      sx={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('#909090', '#717171'),
          borderRadius: '24px',
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb:active': {
          backgroundColor: useColorModeValue('#909090', '#717171'),
        },
        '&::-webkit-scrollbar-track': {
          borderRadius: '24px',
        },
      }}
    >
      <Flex
        direction="column"
        as="nav"
        fontSize="15px"
        px={4}
        py={2}
        aria-label="Main Navigation"
        h="100%"
      >
        <Flex
          direction="row"
          px={1.5}
          py={4}
          mb={2}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Stack
            alignItems={'center'}
            px={2}
            direction="row"
            spacing={6}
            w="full"
          >
            <Box w="30px" h="30px">
              <Image
                src={logo}
                alt="logo"
                w="full"
                alignSelf={'center'}
                h="full"
                objectFit="cover"
              />
            </Box>
            <Stack direction="column" spacing={0}>
              <Heading
                fontSize="16px"
                fontWeight="bold"
                color="white"
                alignSelf={'start'}
                justifySelf={'start'}
                textAlign="start"
              >
                SIGEPEX
              </Heading>
              <Text
                fontSize="14px"
                color="gray.400"
                _dark={{
                  color: 'gray.400',
                }}
                alignSelf={'start'}
                justifySelf={'start'}
                textAlign="start"
              >
                {sedeSeleccionada?.nombre}
              </Text>
            </Stack>
          </Stack>
        </Flex>

        {/* Módulos del usuario */}
        {user?.usuario?.rol?.modulos?.map((item, index) => {
          const route = generateRoute(item.path); // Generar la ruta dinámica
          const isSelected = isRouteActive(item.path); // Verificar si la ruta está activa
          const IconComponent = getIconComponent(item.icon); // Obtener el icono dinámicamente

          return (
            <Box key={index}>
              <Link
                as={NavLink}
                to={route}
                fontSize={'15px'}
                fontWeight={'semibold'}
                color={'gray.400'}
                _dark={{ color: 'gray.400' }}
                borderRadius={'lg'}
                mb={1}
                _activeLink={{
                  color: activeLinkcolor,
                  bg: bgActiveLinkColor,
                  _dark: { color: 'white' },
                }}
                _hover={{ textDecoration: 'none' }}
              >
                <NavItem
                  isSelected={isSelected}
                  //iconSize={item.iconSize}
                  icon={IconComponent}
                  onClick={() => {
                    toggleMenu(index); // Cambiar estado al hacer clic
                  }}
                >
                  {item.name}
                </NavItem>
              </Link>

              {/* Renderizar submenús si existen */}
              {activeMenu === index &&
                item.submenus &&
                item.submenus.length > 0 && (
                  <Stack pl={6} spacing={1}>
                    {item.submenus.map((submenu, subIndex) => {
                      const subRoute = generateRoute(submenu.path);
                      const SubIconComponent = getIconComponent(submenu.icon);
                      return (
                        <Link
                          key={subIndex}
                          as={NavLink}
                          to={subRoute}
                          fontSize={'14px'}
                          fontWeight={'medium'}
                          color={'gray.500'}
                          _dark={{ color: 'gray.500' }}
                          borderRadius={'lg'}
                          mb={0.5}
                          _activeLink={{
                            color: activeLinkcolor,
                            bg: bgActiveLinkColor,
                            _dark: { color: 'white' },
                          }}
                          _hover={{ textDecoration: 'none' }}
                        >
                          <NavItem
                            isSelected={isRouteActive(submenu.path)}
                            iconSize="18px"
                            icon={SubIconComponent}
                          >
                            {submenu.name}
                          </NavItem>
                        </Link>
                      );
                    })}
                  </Stack>
                )}
            </Box>
          );
        })}

        <Spacer />
      </Flex>
    </Box>
  );
}

export default Sidebar;
