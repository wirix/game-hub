import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Wrap,
  WrapItem,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaEdit, FaSearch, FaCheck, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import authApi from '../services/authApi';

// Список всех доступных игровых жанров
const AVAILABLE_GENRES = [
  { id: 'action', name: 'Action', icon: '⚔️', description: 'Экшен, шутеры, файтинги' },
  { id: 'rpg', name: 'RPG', icon: '🗡️', description: 'Ролевые игры' },
  { id: 'strategy', name: 'Strategy', icon: '♟️', description: 'Стратегии' },
  { id: 'adventure', name: 'Adventure', icon: '🗺️', description: 'Приключения' },
  { id: 'indie', name: 'Indie', icon: '🎨', description: 'Инди-игры' },
  { id: 'horror', name: 'Horror', icon: '👻', description: 'Хорроры' },
  { id: 'simulation', name: 'Simulation', icon: '🎮', description: 'Симуляторы' },
  { id: 'sports', name: 'Sports', icon: '⚽', description: 'Спортивные игры' },
  { id: 'racing', name: 'Racing', icon: '🏎️', description: 'Гонки' },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩', description: 'Головоломки' },
  { id: 'platformer', name: 'Platformer', icon: '🎯', description: 'Платформеры' },
  { id: 'fighting', name: 'Fighting', icon: '🥊', description: 'Файтинги' },
  { id: 'stealth', name: 'Stealth', icon: '🥷', description: 'Стелс' },
  { id: 'survival', name: 'Survival', icon: '🏕️', description: 'Выживание' },
  { id: 'open_world', name: 'Open World', icon: '🌍', description: 'Открытый мир' },
  { id: 'roguelike', name: 'Roguelike', icon: '🎲', description: 'Roguelike' },
  { id: 'mmo', name: 'MMO', icon: '👥', description: 'Многопользовательские' },
  { id: 'visual_novel', name: 'Visual Novel', icon: '📖', description: 'Визуальные новеллы' },
];

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
  isEditing?: boolean;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenres,
  onGenresChange,
  isEditing = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState<string[]>(selectedGenres);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const filteredGenres = AVAILABLE_GENRES.filter(
    (genre) =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genre.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleToggleGenre = (genreId: string) => {
    if (tempSelected.includes(genreId)) {
      setTempSelected(tempSelected.filter((id) => id !== genreId));
    } else {
      setTempSelected([...tempSelected, genreId]);
    }
  };

  const handleSave = () => {
    onGenresChange(tempSelected);
    onClose();
  };

  const handleCancel = () => {
    setTempSelected(selectedGenres);
    onClose();
  };

  const getGenreName = (genreId: string) => {
    return AVAILABLE_GENRES.find((g) => g.id === genreId)?.name || genreId;
  };

  const getGenreIcon = (genreId: string) => {
    return AVAILABLE_GENRES.find((g) => g.id === genreId)?.icon || '🎮';
  };

  if (!isEditing) {
    // Режим просмотра - показываем выбранные жанры
    return (
      <Wrap spacing={2}>
        {selectedGenres.length === 0 ? (
          <Text color="gray.500" fontSize="sm">
            Не выбраны
          </Text>
        ) : (
          selectedGenres.map((genreId) => (
            <WrapItem key={genreId}>
              <Badge
                px={3}
                py={1}
                borderRadius="full"
                colorScheme="purple"
                variant="solid"
                fontSize="sm">
                {getGenreIcon(genreId)} {getGenreName(genreId)}
              </Badge>
            </WrapItem>
          ))
        )}
      </Wrap>
    );
  }

  return (
    <>
      <Button size="sm" leftIcon={<FaEdit />} onClick={onOpen} variant="outline">
        Выбрать жанры
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text>🎮 Выберите любимые жанры</Text>
              <Badge colorScheme="purple" ml={2}>
                {tempSelected.length} выбрано
              </Badge>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <VStack spacing={4}>
              {/* Поиск */}
              <InputGroup>
                <InputLeftElement>
                  <FaSearch />
                </InputLeftElement>
                <Input
                  placeholder="Поиск жанров..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {/* Список жанров */}
              <Wrap spacing={3} maxH="400px" overflowY="auto">
                {filteredGenres.map((genre) => {
                  const isSelected = tempSelected.includes(genre.id);
                  return (
                    <WrapItem key={genre.id}>
                      <Badge
                        as="button"
                        onClick={() => handleToggleGenre(genre.id)}
                        px={4}
                        py={2}
                        borderRadius="full"
                        fontSize="md"
                        colorScheme={isSelected ? 'purple' : 'gray'}
                        variant={isSelected ? 'solid' : 'subtle'}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ transform: 'scale(1.05)' }}>
                        <HStack spacing={2}>
                          <Text>{genre.icon}</Text>
                          <Text>{genre.name}</Text>
                          {isSelected && <FaCheck size={12} />}
                        </HStack>
                      </Badge>
                    </WrapItem>
                  );
                })}
              </Wrap>

              {/* Выбранные жанры */}
              {tempSelected.length > 0 && (
                <Box w="100%">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Выбранные жанры:
                  </Text>
                  <Wrap spacing={2}>
                    {tempSelected.map((genreId) => (
                      <WrapItem key={genreId}>
                        <Badge
                          px={2}
                          py={1}
                          borderRadius="full"
                          colorScheme="purple"
                          variant="solid">
                          {getGenreIcon(genreId)} {getGenreName(genreId)}
                          <IconButton
                            aria-label="Remove"
                            icon={<FaPlus style={{ transform: 'rotate(45deg)' }} />}
                            size="xs"
                            ml={1}
                            onClick={() => handleToggleGenre(genreId)}
                          />
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              )}

              <HStack spacing={3} w="100%" pt={4}>
                <Button colorScheme="purple" onClick={handleSave} flex={1}>
                  Сохранить ({tempSelected.length})
                </Button>
                <Button onClick={handleCancel} flex={1}>
                  Отмена
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GenreSelector;
