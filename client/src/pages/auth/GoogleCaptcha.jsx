import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Box, Button, VStack, Text } from '@chakra-ui/react';

const GoogleCaptcha = ({ onVerify }) => {
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptchaChange = value => {
    if (value) {
      setCaptchaVerified(true);
      onVerify(value); // ✅ Envía el token al componente padre (ej. Login)
    }
  };

  return (
    <VStack spacing={4} align="center">
      <Box>
        <ReCAPTCHA
          sitekey="6LfGousqAAAAADlIxH2gWzm149UfySc_XcOK0vEE" // 🔹 Reemplázalo con tu clave pública de Google
          onChange={handleCaptchaChange}
        />
      </Box>
      <Button colorScheme="blue" isDisabled={!captchaVerified}>
        Iniciar Sesión
      </Button>
      {!captchaVerified && (
        <Text fontSize="sm" color="red.500">
          ⚠️ Debes completar el CAPTCHA antes de continuar.
        </Text>
      )}
    </VStack>
  );
};

export default GoogleCaptcha;
