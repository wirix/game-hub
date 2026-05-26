import React, { useRef } from 'react';
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
  IconButton,
  HStack,
  Text,
} from '@chakra-ui/react';
import { FaCamera, FaPalette, FaTrash, FaUpload } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import authApi from '../services/authApi';
import GradientPicker from './GradientPicker';

interface BackgroundManagerProps {
  onBackgroundChange?: (background: string | null) => void;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ onBackgroundChange }) => {
  const { user, removeBackground } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Неверный формат',
        description: 'Пожалуйста, выберите изображение',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Проверка размера (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Файл слишком большой',
        description: 'Максимальный размер 5MB',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('background', file);

    try {
      const response = await authApi.post('/user/background', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({
        title: 'Фон обновлен',
        description: 'Изображение успешно загружено',
        status: 'success',
        duration: 3000,
      });

      if (onBackgroundChange) {
        onBackgroundChange(response.data.backgroundUrl);
      }

      // Перезагружаем страницу для обновления фона
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error uploading background:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить изображение',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleRemoveBackground = async () => {
    try {
      await authApi.delete('/user/background');
      toast({
        title: 'Фон удален',
        description: 'Фон профиля удален',
        status: 'success',
        duration: 3000,
      });

      if (onBackgroundChange) {
        onBackgroundChange(null);
      }

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error removing background:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить фон',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileUpload}
      />

      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<FaPalette />}
          size="sm"
          variant="outline"
          colorScheme="purple">
          Изменить фон
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FaCamera />} onClick={() => fileInputRef.current?.click()}>
            Загрузить изображение
          </MenuItem>

          <MenuItem as="div" closeOnSelect={false}>
            <HStack width="100%" justify="space-between">
              <Text>Выбрать градиент</Text>
              <GradientPicker />
            </HStack>
          </MenuItem>

          {user?.background_image && (
            <MenuItem icon={<FaTrash />} onClick={handleRemoveBackground} color="red.500">
              Удалить фон
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </>
  );
};

export default BackgroundManager;
