import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  useToast,
  Spinner,
  SimpleGrid,
  IconButton,
  Heading,
  Card,
  CardBody,
  Badge,
} from '@chakra-ui/react';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import wishlistService from '../services/wishlist.service';
import getCroppedImageUrl from '../services/image-url';

interface WishlistGame {
  id: number;
  game_id: number;
  game_slug: string;
  game_name: string;
  game_image: string;
  added_at: string;
}

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 12;

  const { user } = useAuth();
  const toast = useToast();

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getUserWishlist(limit, offset);
      setWishlist(data.wishlist);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список желаемого',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user, offset]);

  const handleRemove = async (gameId: number, gameName: string) => {
    try {
      await wishlistService.removeFromWishlist(gameId);
      toast({
        title: 'Удалено из желаемого',
        description: `${gameName} удалена`,
        status: 'success',
        duration: 2000,
      });
      loadWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить игру',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (loading && wishlist.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color="purple.500" />
      </Box>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500" fontSize="lg">
          💔 В вашем списке желаемого пока нет игр
        </Text>
        <Button as={Link} to="/" colorScheme="purple" size="lg" mt={4}>
          Найти игры
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {wishlist.map((game) => (
          <Card key={game.id} position="relative" borderRadius="lg" overflow="hidden">
            {/* Кнопка удаления */}
            <IconButton
              aria-label="Remove from wishlist"
              icon={<FaTrash />}
              position="absolute"
              top={2}
              right={2}
              zIndex={2}
              colorScheme="red"
              variant="solid"
              size="sm"
              borderRadius="full"
              opacity={0.9}
              _hover={{ opacity: 1, transform: 'scale(1.1)' }}
              transition="all 0.2s"
              onClick={() => handleRemove(game.game_id, game.game_name)}
            />

            {/* Изображение */}
            <Image
              src={getCroppedImageUrl(game.game_image)}
              alt={game.game_name}
              h="200px"
              w="100%"
              objectFit="cover"
            />

            <CardBody>
              <VStack align="start" spacing={2}>
                <Heading size="md" noOfLines={2}>
                  <Link to={`/games/${game.game_slug}`} style={{ _hover: { color: 'purple.500' } }}>
                    {game.game_name}
                  </Link>
                </Heading>

                <HStack justify="space-between" w="100%">
                  <Badge colorScheme="purple" fontSize="xs">
                    🎮 В желаемом
                  </Badge>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(game.added_at).toLocaleDateString('ru-RU')}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Пагинация */}
      {total > limit && (
        <HStack justify="center" spacing={4} mt={8}>
          <Button
            size="sm"
            onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
            isDisabled={offset === 0}>
            ← Назад
          </Button>
          <Text fontSize="sm">
            {Math.floor(offset / limit) + 1} / {Math.ceil(total / limit)}
          </Text>
          <Button
            size="sm"
            onClick={() => setOffset((prev) => prev + limit)}
            isDisabled={offset + limit >= total}>
            Вперед →
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default Wishlist;
