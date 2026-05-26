import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Tooltip,
  useColorModeValue,
  Button,
  Badge,
  Grid,
  GridItem,
  Spinner,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import authApi from '../services/authApi';

interface CommentsData {
  [date: string]: number;
}

const ActivityCalendar: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentsData>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Получение дней в месяце
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  // Загрузка комментариев
  useEffect(() => {
    if (user) {
      fetchComments();
    } else {
      setLoading(false);
    }
  }, [currentDate, user]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await authApi.get('/comments/user/activity-calendar', {
        params: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
        },
      });
      // Убеждаемся, что comments всегда объект
      setComments(response.data.comments || {});
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments({});
    } finally {
      setLoading(false);
    }
  };

  // Получение цвета для ячейки в зависимости от количества комментариев
  const getCellColor = (count: number) => {
    if (count === 0) return 'gray.100';
    if (count === 1) return 'green.100';
    if (count <= 3) return 'green.200';
    if (count <= 5) return 'green.300';
    if (count <= 10) return 'green.400';
    if (count <= 20) return 'green.500';
    return 'green.600';
  };

  const getCellColorDark = (count: number) => {
    if (count === 0) return 'gray.700';
    if (count === 1) return 'green.900';
    if (count <= 3) return 'green.800';
    if (count <= 5) return 'green.700';
    if (count <= 10) return 'green.600';
    if (count <= 20) return 'green.500';
    return 'green.400';
  };

  // Получение текста для тултипа
  const getTooltipText = (count: number, date: string) => {
    if (count === 0) return 'Нет комментариев';

    const endings = ['комментарий', 'комментария', 'комментариев'];
    let ending;
    if (count % 10 === 1 && count % 100 !== 11) ending = endings[0];
    else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20))
      ending = endings[1];
    else ending = endings[2];

    return `📝 ${count} ${ending}`;
  };

  // Смена месяца
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // Статистика за месяц - с проверкой на существование comments
  const getMonthlyStats = () => {
    // Безопасная проверка: если comments нет или пустой
    if (!comments || typeof comments !== 'object' || Object.keys(comments).length === 0) {
      return { totalComments: 0, activeDays: 0, avgComments: 0, maxComments: 0, maxDate: '' };
    }

    let totalComments = 0;
    let maxComments = 0;
    let maxDate = '';
    let activeDays = 0;

    try {
      Object.entries(comments).forEach(([date, count]) => {
        if (count && count > 0) {
          totalComments += count;
          activeDays++;
          if (count > maxComments) {
            maxComments = count;
            maxDate = date;
          }
        }
      });
    } catch (err) {
      console.error('Error processing comments:', err);
      return { totalComments: 0, activeDays: 0, avgComments: 0, maxComments: 0, maxDate: '' };
    }

    const avgComments = activeDays > 0 ? (totalComments / activeDays).toFixed(1) : 0;

    return { totalComments, activeDays, avgComments, maxComments, maxDate };
  };

  // Рендер календаря
  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    // Корректируем начало недели (в JS воскресенье = 0)
    let startOffset = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const calendarDays = [];

    // Пустые ячейки в начале
    for (let i = 0; i < startOffset; i++) {
      calendarDays.push(<GridItem key={`empty-${i}`} />);
    }

    // Ячейки с днями
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const commentCount = comments && comments[dateStr] ? comments[dateStr] : 0;

      const bgColorLight = getCellColor(commentCount);
      const bgColorDark = getCellColorDark(commentCount);

      calendarDays.push(
        <GridItem key={day}>
          <Tooltip
            label={getTooltipText(commentCount, dateStr)}
            hasArrow
            placement="top"
            openDelay={300}>
            <Box
              as="button"
              w="100%"
              h="55px"
              minW="40px"
              bg={useColorModeValue(bgColorLight, bgColorDark)}
              borderRadius="md"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.05)',
                zIndex: 1,
                boxShadow: 'lg',
              }}
              onClick={() => setSelectedDate(dateStr)}>
              <Text
                fontSize="md"
                fontWeight="bold"
                color={commentCount > 0 ? 'white' : useColorModeValue('gray.600', 'gray.400')}>
                {day}
              </Text>
              {commentCount > 0 && (
                <Text fontSize="xs" color="white" opacity={0.9}>
                  💬 {commentCount}
                </Text>
              )}
            </Box>
          </Tooltip>
        </GridItem>,
      );
    }

    return (
      <Box>
        <SimpleGrid columns={7} spacing={2} mb={2}>
          {daysOfWeek.map((day) => (
            <Text key={day} textAlign="center" fontSize="sm" fontWeight="bold" color="gray.500">
              {day}
            </Text>
          ))}
        </SimpleGrid>
        <Grid templateColumns="repeat(7, 1fr)" gap={2}>
          {calendarDays}
        </Grid>
      </Box>
    );
  };

  const stats = getMonthlyStats();

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="purple.500" />
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Заголовок и навигация */}
        <HStack justify="space-between" wrap="wrap" spacing={4}>
          <HStack>
            <Button size="sm" onClick={prevMonth} leftIcon={<ChevronLeftIcon />} variant="ghost">
              {new Date(currentDate.getFullYear(), currentDate.getMonth() - 1).toLocaleString(
                'ru',
                { month: 'long' },
              )}
            </Button>

            <Text fontSize="xl" fontWeight="bold" minW="200px" textAlign="center">
              {currentDate.toLocaleString('ru', { month: 'long', year: 'numeric' })}
            </Text>

            <Button size="sm" onClick={nextMonth} rightIcon={<ChevronRightIcon />} variant="ghost">
              {new Date(currentDate.getFullYear(), currentDate.getMonth() + 1).toLocaleString(
                'ru',
                { month: 'long' },
              )}
            </Button>
          </HStack>

          <Button size="sm" onClick={goToToday} colorScheme="purple" variant="outline">
            Сегодня
          </Button>
        </HStack>

        {/* Статистика за месяц */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
          <Box
            textAlign="center"
            p={3}
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderRadius="lg">
            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
              {stats.totalComments}
            </Text>
            <Text fontSize="xs" color="gray.500">
              всего комментариев
            </Text>
          </Box>
          <Box
            textAlign="center"
            p={3}
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderRadius="lg">
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {stats.activeDays}
            </Text>
            <Text fontSize="xs" color="gray.500">
              дней с активностью
            </Text>
          </Box>
          <Box
            textAlign="center"
            p={3}
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderRadius="lg">
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {stats.avgComments}
            </Text>
            <Text fontSize="xs" color="gray.500">
              в среднем в день
            </Text>
          </Box>
          <Box
            textAlign="center"
            p={3}
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderRadius="lg">
            <Text fontSize="2xl" fontWeight="bold" color="orange.500">
              {stats.maxComments}
            </Text>
            <Text fontSize="xs" color="gray.500">
              максимум в день
            </Text>
          </Box>
        </SimpleGrid>

        {/* Календарь */}
        <Box
          bg={bgColor}
          p={4}
          borderRadius="xl"
          border="1px solid"
          borderColor={borderColor}
          overflowX="auto">
          {renderCalendar()}
        </Box>

        {/* Легенда */}
        <HStack justify="center" spacing={3} wrap="wrap" fontSize="xs">
          <HStack spacing={1}>
            <Box
              w="20px"
              h="20px"
              bg={useColorModeValue('gray.100', 'gray.700')}
              borderRadius="sm"
            />
            <Text>0</Text>
          </HStack>
          <HStack spacing={1}>
            <Box
              w="20px"
              h="20px"
              bg={useColorModeValue('green.100', 'green.900')}
              borderRadius="sm"
            />
            <Text>1</Text>
          </HStack>
          <HStack spacing={1}>
            <Box
              w="20px"
              h="20px"
              bg={useColorModeValue('green.200', 'green.800')}
              borderRadius="sm"
            />
            <Text>2-3</Text>
          </HStack>
          <HStack spacing={1}>
            <Box
              w="20px"
              h="20px"
              bg={useColorModeValue('green.300', 'green.700')}
              borderRadius="sm"
            />
            <Text>4-5</Text>
          </HStack>
          <HStack spacing={1}>
            <Box
              w="20px"
              h="20px"
              bg={useColorModeValue('green.400', 'green.600')}
              borderRadius="sm"
            />
            <Text>6-10</Text>
          </HStack>
          <HStack spacing={1}>
            <Box
              w="20px"
              h="20px"
              bg={useColorModeValue('green.500', 'green.500')}
              borderRadius="sm"
            />
            <Text>11-20</Text>
          </HStack>
          <HStack spacing={1}>
            <Box
              w="20px"
              h="20px"
              bg={useColorModeValue('green.600', 'green.400')}
              borderRadius="sm"
            />
            <Text>20+</Text>
          </HStack>
        </HStack>

        {/* Детали выбранного дня */}
        {selectedDate && (
          <Box
            bg={bgColor}
            p={4}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            textAlign="center">
            <Text fontWeight="bold" mb={2}>
              📅{' '}
              {new Date(selectedDate).toLocaleDateString('ru', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="green.500">
              {comments && comments[selectedDate] ? comments[selectedDate] : 0} комментариев
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ActivityCalendar;
