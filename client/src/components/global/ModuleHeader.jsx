import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

export function ModuleHeader({ moduleName, submoduleName }) {
  const navigate = useNavigate();

  return (
    <Stack
      spacing={4}
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      py={4}
      px={0}
    >
      <IconButton
        icon={<ArrowBackIcon boxSize={8} />}
        onClick={() => navigate(-1)}
        aria-label="Volver"
        variant="ghost"
      />
      <Heading size="md" color="gray.600">
        {moduleName}
      </Heading>
      <Icon as={ChevronRightIcon} color="gray.500" boxSize={8} />
      <Heading size="lg">{submoduleName}</Heading>
    </Stack>
  );
}
