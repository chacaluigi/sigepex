import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Progress,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ProcesoFinalizado } from './ProcesoFinalizado';

export default function Proceso() {
  const [loading, setLoading] = useState(false);

  const [isFinished, setIsFinished] = useState(false);

  const [progressSteps, setProgressSteps] = useState({
    extract: 0,
    clean: 0,
    analyze: 0,
    report: 0,
  });
  const [finished, setFinished] = useState(false);

  // Activar modo de prueba
  const modoPrueba = false;

  // Función para llenar progresivamente una barra antes de pasar a la siguiente
  const startProgress = (step, nextStep) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 1; // Incremento aleatorio entre 1 y 5
      setProgressSteps(prev => ({
        ...prev,
        [step]: progress > 100 ? 100 : progress,
      }));

      if (progress >= 100) {
        clearInterval(interval);
        if (nextStep) {
          setTimeout(() => startProgress(nextStep, getNextStep(nextStep)), 500);
        } else {
          setTimeout(() => setFinished(true), 500);
          setTimeout(() => setIsFinished(true), 500);
        }
      }
    }, 1000); // Se actualiza cada segundo
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
    setFinished(false);
    setProgressSteps({ extract: 0, clean: 0, analyze: 0, report: 0 });

    if (!modoPrueba) {
      try {
        await fetch('http://localhost:4000/api/proceso', { method: 'POST' });
      } catch (error) {
        console.error('❌ Error al procesar noticias:', error);
      }
    }

    // Comenzar la primera barra
    startProgress('extract', 'clean');
    setLoading(false);
  };

  return (
    <VStack spacing={6} align="center" w="full" py={6}>
      {/* 📡 TÍTULO */}
      <Box textAlign="center">
        <Heading size="lg">🔍 Iniciar Proceso Automatizado</Heading>
        <Text fontSize="md" color="gray.500">
          Presiona el botón para comenzar el proceso de gestión de posts de la
          red social X.
        </Text>
      </Box>

      {/* 📡 BOTÓN DE INICIO */}
      <Button
        colorScheme="blue"
        size="lg"
        onClick={startAnalysis}
        isLoading={loading}
        loadingText="Analizando..."
        isDisabled={loading}
      >
        📡 Iniciar Proceso
      </Button>

      {/* ⏳ PROCESO DE ANÁLISIS */}
      <Stack spacing={4} w="80%" maxW="600px" pt="20px">
        {loading && (
          <Box textAlign="center">
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="md" color="gray.500">
              ⏳ Procesando Datos...
            </Text>
          </Box>
        )}

        <Text>📡 Extrayendo Posts...</Text>
        <Progress value={progressSteps.extract} size="lg" colorScheme="blue" />

        <Text>🧹 Limpiando Datos...</Text>
        <Progress value={progressSteps.clean} size="lg" colorScheme="blue" />

        <Text>📊 Analizando Posts...</Text>
        <Progress value={progressSteps.analyze} size="lg" colorScheme="blue" />

        <Text>📝 Generando Reporte...</Text>
        <Progress value={progressSteps.report} size="lg" colorScheme="blue" />

        {finished && (
          <ProcesoFinalizado
            isOpen={isFinished}
            onClose={() => setIsFinished(false)}
          />
        )}
      </Stack>
    </VStack>
  );
}
