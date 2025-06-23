import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Progress,
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
  Icon,
  Badge,
  Flex,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { ProcesoFinalizado } from './ProcesoFinalizado';
import { FiPlay, FiRefreshCw, FiInfo } from 'react-icons/fi';

export default function Proceso() {
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progressSteps, setProgressSteps] = useState({
    extract: { value: 0, status: 'pending' },
    clean: { value: 0, status: 'pending' },
    analyze: { value: 0, status: 'pending' },
    report: { value: 0, status: 'pending' },
  });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  // Activar modo de prueba
  const modoPrueba = false;

  // Efecto para el temporizador
  useEffect(() => {
    let timer;
    if (loading && !isFinished) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [loading, isFinished]);

  // Función para formatear el tiempo transcurrido
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Función para llenar progresivamente una barra
  const startProgress = (step, nextStep) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 1; // Incremento aleatorio entre 1 y 5
      setProgressSteps(prev => ({
        ...prev,
        [step]: {
          value: progress > 100 ? 100 : progress,
          status: progress >= 100 ? 'completed' : 'in-progress',
        },
      }));

      if (progress >= 100) {
        clearInterval(interval);
        if (nextStep) {
          setTimeout(() => startProgress(nextStep, getNextStep(nextStep)), 500);
        } else {
          setTimeout(() => {
            setIsFinished(true);
            toast({
              title: 'Proceso completado',
              description: 'El análisis se ha completado exitosamente',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          }, 500);
        }
      }
    }, 500); // Se actualiza cada 0.8 segundos
  };

  // Función auxiliar para obtener el siguiente paso
  const getNextStep = step => {
    const steps = ['extract', 'clean', 'analyze', 'report'];
    const index = steps.indexOf(step);
    return index !== -1 && index < steps.length - 1 ? steps[index + 1] : null;
  };

  // Iniciar el proceso
  const startAnalysis = async () => {
    setLoading(true);
    setIsFinished(false);
    setTimeElapsed(0);
    setProgressSteps({
      extract: { value: 0, status: 'pending' },
      clean: { value: 0, status: 'pending' },
      analyze: { value: 0, status: 'pending' },
      report: { value: 0, status: 'pending' },
    });

    if (!modoPrueba) {
      try {
        // 1. Obtener el usuario desde localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          throw new Error(
            'No hay sesión activa. Por favor inicie sesión nuevamente.'
          );
        }

        const response = await fetch('http://localhost:4000/api/proceso', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token, // Usar el token del objeto user
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Error en el servidor');
        }
        const result = await response.json();
        /* toast({
          title: 'Proceso exitoso',
          description: result.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        }); */
      } catch (error) {
        console.error('❌ Error al procesar noticias:', error);
        toast({
          title: 'Error en el proceso',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    // Comenzar la primera barra
    startProgress('extract', 'clean');
  };

  // Obtener color según estado del paso
  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'blue';
      default:
        return 'gray';
    }
  };

  // Obtener color de la barra de progreso
  const getProgressColor = status => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <VStack spacing={6} align="center" w="full" py={6} px={4}>
      {/* 📡 TÍTULO Y DESCRIPCIÓN */}
      <Box textAlign="center" maxW="2xl">
        <Heading
          size="xl"
          mb={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={FiPlay} mr={3} color="blue.500" />
          Análisis de Datos
        </Heading>
        <Text fontSize="lg" color="gray.500">
          Ejecuta el proceso completo de extracción, limpieza, análisis y
          generación de reportes de los posts de redes sociales.
        </Text>
      </Box>

      {/* 📊 PANEL DE CONTROL */}
      <Box
        w="full"
        maxW="3xl"
        bg={cardBg}
        p={6}
        borderRadius="xl"
        boxShadow="md"
        borderWidth="1px"
        borderColor="gray.100"
        _dark={{ borderColor: 'gray.600' }}
      >
        {/* CONTADOR Y BOTONES */}
        <Flex justify="space-between" align="center" mb={6}>
          <Badge
            colorScheme={loading ? 'blue' : 'gray'}
            fontSize="lg"
            px={3}
            py={1}
          >
            ⏱️ Tiempo: {formatTime(timeElapsed)}
          </Badge>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={startAnalysis}
            isLoading={loading}
            loadingText="Procesando..."
            leftIcon={<FiPlay />}
            isDisabled={loading}
          >
            Iniciar Proceso
          </Button>
        </Flex>

        {/* PASOS DEL PROCESO */}
        <Stack spacing={6}>
          {['extract', 'clean', 'analyze', 'report'].map(step => {
            const stepData = progressSteps[step];
            const stepNames = {
              extract: 'Extracción de Posts',
              clean: 'Limpieza de Datos',
              analyze: 'Análisis de Contenido',
              report: 'Generación de Reporte',
            };
            const stepDescriptions = {
              extract: 'Recopilando posts de las redes sociales',
              clean: 'Eliminando datos duplicados e irrelevantes',
              analyze: 'Procesando el contenido de los posts',
              report: 'Creando el reporte final con los resultados',
            };

            return (
              <Box key={step}>
                <Flex justify="space-between" align="center" mb={1}>
                  <Text fontWeight="semibold">
                    {stepNames[step]}
                    <Tooltip label={stepDescriptions[step]} hasArrow>
                      <span>
                        <Icon as={FiInfo} ml={2} color="gray.500" boxSize={4} />
                      </span>
                    </Tooltip>
                  </Text>
                  <Badge
                    colorScheme={getStatusColor(stepData.status)}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {stepData.status === 'completed'
                      ? 'Completado'
                      : stepData.status === 'in-progress'
                      ? 'En progreso'
                      : 'Pendiente'}
                  </Badge>
                </Flex>
                <Progress
                  value={stepData.value}
                  size="lg"
                  colorScheme={getProgressColor(stepData.status)}
                  borderRadius="md"
                  hasStripe={stepData.status === 'in-progress'}
                  isAnimated={stepData.status === 'in-progress'}
                />
              </Box>
            );
          })}
        </Stack>

        {/* MENSAJE DE PRUEBA */}
        {modoPrueba && (
          <Text mt={4} fontSize="sm" color="yellow.600" textAlign="center">
            <strong>Modo demostración:</strong> Este es un simulador del proceso
            real.
          </Text>
        )}
      </Box>

      {/* MODAL DE FINALIZACIÓN */}
      <ProcesoFinalizado
        isOpen={isFinished}
        onClose={() => {
          setIsFinished(false);
          setLoading(false);
        }}
      />
    </VStack>
  );
}
