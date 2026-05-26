import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
  Badge,
  Tooltip,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { InfoIcon, StarIcon, AddIcon, ChatIcon } from '@chakra-ui/icons';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import authApi from '../services/authApi';
import { useAuth } from '../contexts/AuthContext';

interface LevelInfo {
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpProgress: number;
  stats: {
    totalComments: number;
    totalLikesGiven: number;
    totalLikesReceived: number;
    totalRepliesGiven: number;
    totalRepliesReceived: number;
  };
  recentActivity: Array<{
    action_type: string;
    xp_earned: number;
    created_at: string;
  }>;
  badges: Array<{
    badge_name: string;
    badge_description: string;
    badge_icon: string;
  }>;
}

const UserLevelInfo = () => {
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, loading: authLoading } = useAuth();
  const hasFetched = useRef(false);

  useEffect(() => {
    // Ждем загрузки пользователя и проверяем, что еще не делали запрос
    if (!authLoading && user && !hasFetched.current) {
      hasFetched.current = true;
      fetchLevelInfo();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const fetchLevelInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      const response = await authApi.get('/comments/user-level');
      setLevelInfo(response.data);
      setFetchError(false);
    } catch (error: any) {
      console.error('Error fetching level info:', error);
      setFetchError(true);
      // Не показываем ошибку пользователю
    } finally {
      setLoading(false);
    }
  };

  const getActionName = (actionType: string) => {
    const actions: Record<string, string> = {
      created_comment: 'Написал комментарий',
      liked_comment: 'Поставил лайк',
      received_like: 'Получил лайк',
      replied_to_comment: 'Ответил на комментарий',
      received_reply: 'Получил ответ',
    };
    return actions[actionType] || actionType;
  };

  const getActionIcon = (actionType: string) => {
    if (actionType.includes('created')) return <AddIcon />;
    if (actionType.includes('liked')) return <FaArrowUp />;
    if (actionType.includes('received_like')) return <FaArrowDown />;
    if (actionType.includes('reply')) return <ChatIcon />;
    return <StarIcon />;
  };

  // Если нет пользователя или загрузка, или была ошибка - не показываем компонент
  if (authLoading || loading || !user || fetchError) {
    return null;
  }

  if (!levelInfo) return null;

  return (
    <>
      <Tooltip label="Информация о прогрессе уровня" hasArrow>
        <IconButton
          aria-label="Level info"
          icon={<InfoIcon />}
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
              <StarIcon color="yellow.500" />
              <Text>Уровень {levelInfo.level} • Прогресс аккаунта</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              {/* XP Progress */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold">Уровень {levelInfo.level}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {levelInfo.xp} / {levelInfo.xp + levelInfo.xpToNextLevel} XP
                  </Text>
                </HStack>
                <Progress
                  value={levelInfo.xpProgress}
                  size="lg"
                  colorScheme="purple"
                  borderRadius="full"
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  До следующего уровня: {levelInfo.xpToNextLevel} XP
                </Text>
              </Box>

              <Divider />

              {/* Статистика */}
              <Box>
                <Text fontWeight="bold" mb={3}>
                  📊 Статистика активности
                </Text>
                <SimpleGrid columns={2} spacing={3}>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.500">
                      Комментариев
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {levelInfo.stats.totalComments}
                    </Text>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.500">
                      Получено лайков
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {levelInfo.stats.totalLikesReceived}
                    </Text>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.500">
                      Дано лайков
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {levelInfo.stats.totalLikesGiven}
                    </Text>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.500">
                      Ответов на комментарии
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {levelInfo.stats.totalRepliesGiven}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Как получить XP */}
              <Box>
                <Text fontWeight="bold" mb={3}>
                  🎯 Как получить следующий уровень?
                </Text>
                <VStack spacing={2} align="stretch">
                  <HStack>
                    <Badge colorScheme="green">+10 XP</Badge>
                    <Text>Написать комментарий</Text>
                  </HStack>
                  <HStack>
                    <Badge colorScheme="green">+5 XP</Badge>
                    <Text>Получить лайк на комментарий</Text>
                  </HStack>
                  <HStack>
                    <Badge colorScheme="green">+8 XP</Badge>
                    <Text>Ответить на чужой комментарий</Text>
                  </HStack>
                  <HStack>
                    <Badge colorScheme="green">+3 XP</Badge>
                    <Text>Получить ответ на комментарий</Text>
                  </HStack>
                  <HStack>
                    <Badge colorScheme="green">+2 XP</Badge>
                    <Text>Поставить лайк чужому комментарию</Text>
                  </HStack>
                </VStack>
              </Box>

              <Divider />

              {/* Достижения */}
              {levelInfo.badges && levelInfo.badges.length > 0 && (
                <Box>
                  <Text fontWeight="bold" mb={3}>
                    🏆 Полученные достижения
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {levelInfo.badges.map((badge, idx) => (
                      <HStack key={idx}>
                        <Text fontSize="24px">{badge.badge_icon || '🎖️'}</Text>
                        <Box>
                          <Text fontWeight="bold">{badge.badge_description}</Text>
                        </Box>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Недавняя активность */}
              {levelInfo.recentActivity && levelInfo.recentActivity.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Text fontWeight="bold" mb={3}>
                      📝 Недавняя активность
                    </Text>
                    <List spacing={2}>
                      {levelInfo.recentActivity.slice(0, 5).map((activity, idx) => (
                        <ListItem key={idx}>
                          <HStack>
                            <ListIcon as={getActionIcon} color="purple.500" />
                            <Text fontSize="sm" flex={1}>
                              {getActionName(activity.action_type)}
                            </Text>
                            <Badge colorScheme="purple">+{activity.xp_earned} XP</Badge>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserLevelInfo;
