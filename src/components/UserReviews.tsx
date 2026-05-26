import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  useToast,
  Spinner,
  Card,
  CardBody,
  Flex,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
	Heading,
  useDisclosure,
  Link,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import commentService from '../services/comment.service';
import { Link as RouterLink } from 'react-router-dom';

interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
  game_slug: string;
  game_name: string;
  created_at: string;
  updated_at: string;
  likes_count?: number;
}

const UserReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const { user } = useAuth();
  const toast = useToast();

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await commentService.getMyReviews(limit, offset);
      setReviews(data.reviews);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить обзоры',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [offset]);

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'green';
    if (rating >= 7) return 'yellow';
    return 'red';
  };

  // Временные моковые данные, пока нет реальных обзоров в БД
  const mockReviews: Review[] = [
    {
      id: 1,
      title: 'Шедевр!',
      content:
        'Мастерpiece! Лучшая RPG десятилетия. Огромный мир, невероятная свобода выбора, отличная графика и музыка. Прошел 3 раза и каждый раз находил что-то новое.',
      rating: 10,
      game_slug: 'baldurs-gate-3',
      game_name: "Baldur's Gate 3",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes_count: 45,
    },
    {
      id: 2,
      title: 'Искупление',
      content:
        'CD Projekt искупили свои грехи. Отличный сюжет, харизматичный главный герой, крутые диалоги. Исправили баги, добавили новые механики. Рекомендую!',
      rating: 9,
      game_slug: 'cyberpunk-2077-phantom-liberty',
      game_name: 'Cyberpunk 2077: Phantom Liberty',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes_count: 32,
    },
    {
      id: 3,
      title: 'Атмосферный хоррор',
      content:
        'Атмосферный психологический хоррор. Инновационный нарратив, потрясающая графика, пугающая атмосфера. Одна из лучших игр года.',
      rating: 8.5,
      game_slug: 'alan-wake-2',
      game_name: 'Alan Wake 2',
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      likes_count: 28,
    },
    {
      id: 4,
      title: 'Ожидание шедевра',
      content:
        'Supergiant снова сделали шедевр. Дождёмся полного релиза! Уже сейчас видно, что игра будет потрясающей. Новые персонажи, механики и музыка.',
      rating: 9,
      game_slug: 'hades-ii',
      game_name: 'Hades II (Early Access)',
      created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      likes_count: 19,
    },
  ];

  // Если нет реальных обзоров, показываем моковые для демонстрации
  const displayReviews = reviews.length > 0 ? reviews : mockReviews;
  const displayTotal = total > 0 ? total : mockReviews.length;

  if (loading && reviews.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="purple.500" />
      </Box>
    );
  }

  if (displayReviews.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">У вас пока нет обзоров</Text>
        <Button as={RouterLink} to="/" colorScheme="purple" size="sm" mt={4}>
          Написать первый обзор
        </Button>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ru });
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {displayReviews.map((review) => (
          <Card key={review.id} variant="outline" borderRadius="lg">
            <CardBody>
              <VStack align="stretch" spacing={3}>
                {/* Заголовок с игрой */}
                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                  <Link
                    as={RouterLink}
                    to={`/games/${review.game_slug}`}
                    _hover={{ textDecoration: 'none' }}>
                    <Badge
                      colorScheme="purple"
                      fontSize="sm"
                      p={2}
                      borderRadius="full"
                      cursor="pointer"
                      _hover={{ bg: 'purple.600', color: 'white' }}>
                      🎮 {review.game_name} <ExternalLinkIcon ml={1} boxSize={3} />
                    </Badge>
                  </Link>

                  <Text fontSize="xs" color="gray.500">
                    {formatDate(review.created_at)}
                    {review.created_at !== review.updated_at && ' (изменено)'}
                  </Text>
                </Flex>

                {/* Заголовок обзора */}
                <Heading size="sm">{review.title}</Heading>

                {/* Рейтинг */}
                <Badge
                  colorScheme={getRatingColor(review.rating)}
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                  alignSelf="flex-start">
                  ⭐ {review.rating}/10
                </Badge>

                {/* Текст обзора */}
                <Text fontSize="sm" color="gray.600" noOfLines={3}>
                  {review.content}
                </Text>

                {/* Кнопка "Читать далее" */}
                <Button
                  as={RouterLink}
                  to={`/games/${review.game_slug}`}
                  size="xs"
                  variant="ghost"
                  colorScheme="purple"
                  alignSelf="flex-start">
                  Читать полностью →
                </Button>

                {/* Статистика лайков */}
                {review.likes_count && review.likes_count > 0 && (
                  <HStack spacing={1}>
                    <Text fontSize="xs" color="gray.500">
                      👍 {review.likes_count} лайков
                    </Text>
                  </HStack>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Пагинация */}
      {displayTotal > limit && (
        <HStack justify="center" spacing={4} mt={6}>
          <Button
            size="sm"
            onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
            isDisabled={offset === 0}>
            ← Назад
          </Button>
          <Text fontSize="sm">
            {Math.floor(offset / limit) + 1} / {Math.ceil(displayTotal / limit)}
          </Text>
          <Button
            size="sm"
            onClick={() => setOffset((prev) => prev + limit)}
            isDisabled={offset + limit >= displayTotal}>
            Вперед →
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default UserReviews;
