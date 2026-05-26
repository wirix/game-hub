import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  ColorPicker,
} from '@chakra-ui/react';
import { FaPalette, FaSave, FaUndo } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import authApi from '../services/authApi';

interface GradientPreset {
  name: string;
  value: string;
  colors: string[];
}

const gradientPresets: GradientPreset[] = [
  {
    name: 'Фиолетовый',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    colors: ['#667eea', '#764ba2'],
  },
  {
    name: 'Синий',
    value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    colors: ['#1e3c72', '#2a5298'],
  },
  {
    name: 'Зеленый',
    value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    colors: ['#134e5e', '#71b280'],
  },
  {
    name: 'Оранжевый',
    value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    colors: ['#ff6b6b', '#feca57'],
  },
  {
    name: 'Розовый',
    value: 'linear-gradient(135deg, #ee5a87 0%, #f39293 100%)',
    colors: ['#ee5a87', '#f39293'],
  },
  {
    name: 'Темный',
    value: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    colors: ['#2c3e50', '#3498db'],
  },
  {
    name: 'Красный',
    value: 'linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)',
    colors: ['#cb2d3e', '#ef473a'],
  },
  {
    name: 'Неон',
    value: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    colors: ['#00f2fe', '#4facfe'],
  },
  {
    name: 'Солнечный',
    value: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)',
    colors: ['#f2994a', '#f2c94c'],
  },
  {
    name: 'Космос',
    value: 'linear-gradient(135deg, #20002c 0%, #cbb4d4 100%)',
    colors: ['#20002c', '#cbb4d4'],
  },
];

const GradientPicker = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, updateBackground } = useAuth();
  const [customGradient, setCustomGradient] = useState({
    angle: 135,
    color1: '#667eea',
    color2: '#764ba2',
    color3: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyGradient = async (gradientValue: string) => {
    setIsLoading(true);
    try {
      await authApi.post('/user/background', { background: gradientValue });
      if (updateBackground) {
        // Обновляем локальное состояние
        window.location.reload(); // Временно для обновления UI
      }
    } catch (error) {
      console.error('Error applying gradient:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleCustomGradient = async () => {
    let gradient = `linear-gradient(${customGradient.angle}deg, ${customGradient.color1} 0%, ${customGradient.color2} 100%`;
    if (customGradient.color3) {
      gradient += `, ${customGradient.color3} 100%`;
    }
    gradient += ')';

    await handleApplyGradient(gradient);
  };

  const getRandomGradient = () => {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
    return `linear-gradient(135deg, ${randomColor()} 0%, ${randomColor()} 100%)`;
  };

  return (
    <>
      <Tooltip label="Выбрать градиент" hasArrow>
        <IconButton
          aria-label="Choose gradient"
          icon={<FaPalette />}
          variant="ghost"
          size="sm"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FaPalette />
              <Text>Выбор градиента для фона профиля</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              {/* Предустановленные градиенты */}
              <Box>
                <Text fontWeight="bold" mb={3}>
                  🎨 Популярные градиенты
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                  {gradientPresets.map((gradient, idx) => (
                    <Box
                      key={idx}
                      onClick={() => handleApplyGradient(gradient.value)}
                      cursor="pointer"
                      transition="transform 0.2s"
                      _hover={{ transform: 'scale(1.05)' }}>
                      <Box h="80px" borderRadius="lg" bgGradient={gradient.value} mb={2} />
                      <Text fontSize="sm" textAlign="center">
                        {gradient.name}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>

              {/* Случайный градиент */}
              <Box>
                <Button
                  onClick={() => handleApplyGradient(getRandomGradient())}
                  colorScheme="purple"
                  variant="outline"
                  width="100%"
                  isLoading={isLoading}>
                  🎲 Случайный градиент
                </Button>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={3}>
                  ✨ Свой градиент
                </Text>

                <VStack spacing={3}>
                  {/* Превью градиента */}
                  <Box
                    w="100%"
                    h="100px"
                    borderRadius="lg"
                    bgGradient={`linear-gradient(${customGradient.angle}deg, ${customGradient.color1} 0%, ${customGradient.color2} 100%${customGradient.color3 ? `, ${customGradient.color3} 100%` : ''})`}
                    mb={2}
                  />

                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} width="100%">
                    <FormControl>
                      <FormLabel fontSize="xs">Угол</FormLabel>
                      <Input
                        type="number"
                        value={customGradient.angle}
                        onChange={(e) =>
                          setCustomGradient({ ...customGradient, angle: parseInt(e.target.value) })
                        }
                        min={0}
                        max={360}
                        size="sm"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="xs">Цвет 1</FormLabel>
                      <Input
                        type="color"
                        value={customGradient.color1}
                        onChange={(e) =>
                          setCustomGradient({ ...customGradient, color1: e.target.value })
                        }
                        size="sm"
                        p={1}
                        h="40px"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="xs">Цвет 2</FormLabel>
                      <Input
                        type="color"
                        value={customGradient.color2}
                        onChange={(e) =>
                          setCustomGradient({ ...customGradient, color2: e.target.value })
                        }
                        size="sm"
                        p={1}
                        h="40px"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="xs">Цвет 3 (необязательно)</FormLabel>
                      <Input
                        type="color"
                        value={customGradient.color3 || '#000000'}
                        onChange={(e) =>
                          setCustomGradient({ ...customGradient, color3: e.target.value })
                        }
                        size="sm"
                        p={1}
                        h="40px"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <Button
                    onClick={handleCustomGradient}
                    colorScheme="purple"
                    width="100%"
                    leftIcon={<FaSave />}
                    isLoading={isLoading}>
                    Применить свой градиент
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GradientPicker;
