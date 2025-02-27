import React from 'react';
import { Box, Button, Center, Container, Image, Stack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotFoundPage = () => {

  const { sedeSeleccionada } = useSelector(state => state.auth);

  return (
    <>
        <Container w={'full'}>
            <Center h={'100vh'} w={'full}'}>
              <Stack spacing={4} px={4} direction="column">
                <Box as="h1" fontSize="3xl" fontWeight={'bold'} textAlign="center">404 - Not Found</Box>
                <Image src="https://media.giphy.com/media/3o7TKSjRrfIPjeNN3O/giphy.gif" alt="404 - Not Found" />
                <NavLink to={`/${sedeSeleccionada?._id}`}>
                  <Button mt={4} w="full" fontWeight={'bold'}  colorScheme={'purple'}>Go to Home</Button>
                </NavLink>
              </Stack>
            </Center>
        </Container>
    </>
  )
}

export default NotFoundPage