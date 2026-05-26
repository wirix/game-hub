import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  Avatar,
  Text,
  Heading,
  Button,
  Input,
  IconButton,
  SimpleGrid,
  Badge,
  Divider,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Wrap,
  WrapItem,
  AvatarBadge,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { EditIcon, CalendarIcon, StarIcon, QuestionIcon, TimeIcon } from '@chakra-ui/icons';
import {
  FiMapPin,
  FiCamera,
  FiThumbsUp,
  FiMessageCircle,
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiClock,
} from 'react-icons/fi';
import { FaSteam, FaTwitch, FaDiscord, FaPlaystation } from 'react-icons/fa';
import UserLevelInfo from '../components/UserLevelInfo';
import { useAuth } from '../contexts/AuthContext';
import authApi from '../services/authApi';
import UserComments from '../components/UserComments';
import UserReviews from '../components/UserReviews';
import Wishlist from '../components/Wishlist';
import ActivityCalendar from '../components/ActivityCalendar';

const ProfilePage = () => {
  const { user: authUser, updateProfile, updateAvatar } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: authUser?.fullName || 'Артур Пономаренко',
    email: authUser?.email || 'arthur.ponomarenko@example.com',
    bio: '🎮 Заядлый геймер с 15-летним стажем. Специализируюсь на RPG, стратегиях и инди-играх. Пишу честные обзоры и делюсь впечатлениями о новинках игровой индустрии.',
    location: 'Санкт-Петербург, Россия',
    joinDate: authUser?.createdAt
      ? new Date(authUser.createdAt).toLocaleDateString('ru', { month: 'long', year: 'numeric' })
      : 'Март 2023',
    avatar:
      authUser?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    steamId: 'arthur_gamer',
    twitch: 'arthur_plays',
    discord: 'arthur#1234',
  });

  const [userLevel, setUserLevel] = useState(authUser?.level || 1);
  const [userXP, setUserXP] = useState(authUser?.xp || 0);
  const [userStats, setUserStats] = useState({
    totalComments: authUser?.total_comments || 0,
    totalLikesReceived: authUser?.total_likes_received || 0,
    totalLikesGiven: authUser?.total_likes_given || 0,
    totalRepliesGiven: authUser?.total_replies_given || 0,
  });

  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // XP награды за действия
  const xpRewards = [
    { action: 'Написать комментарий', xp: '+10 XP', icon: FiMessageCircle, color: 'blue.500' },
    { action: 'Получить лайк на комментарий', xp: '+5 XP', icon: FiThumbsUp, color: 'green.500' },
    {
      action: 'Ответить на чужой комментарий',
      xp: '+8 XP',
      icon: FiMessageCircle,
      color: 'purple.500',
    },
    { action: 'Получить ответ на комментарий', xp: '+3 XP', icon: FiUsers, color: 'orange.500' },
    {
      action: 'Поставить лайк чужому комментарию',
      xp: '+2 XP',
      icon: StarIcon,
      color: 'yellow.500',
    },
  ];

  // Загрузка актуальных данных пользователя
  useEffect(() => {
    if (authUser) {
      setUserData((prev) => ({
        ...prev,
        name: authUser.fullName || prev.name,
        email: authUser.email || prev.email,
        avatar: authUser.avatar || prev.avatar,
      }));
      setUserLevel(authUser.level || 1);
      setUserXP(authUser.xp || 0);
      setUserStats({
        totalComments: authUser.total_comments || 0,
        totalLikesReceived: authUser.total_likes_received || 0,
        totalLikesGiven: authUser.total_likes_given || 0,
        totalRepliesGiven: authUser.total_replies_given || 0,
      });
    }
  }, [authUser]);

  const stats = [
    { label: 'Обзоров', value: '47', icon: FiMessageCircle, color: 'blue.500' },
    {
      label: 'Комментариев',
      value: userStats.totalComments.toString(),
      icon: FiThumbsUp,
      color: 'green.500',
    },
    {
      label: 'Лайков',
      value: userStats.totalLikesReceived.toString(),
      icon: StarIcon,
      color: 'yellow.500',
    },
    { label: 'Рейтинг', value: '4.9', icon: FiTrendingUp, color: 'purple.500' },
    { label: 'Достижений', value: '32', icon: FiAward, color: 'orange.500' },
    { label: 'Игр в библиотеке', value: '156', icon: FiTrendingUp, color: 'red.500' },
  ];

  const recentReviews = [
    {
      game: "Baldur's Gate 3",
      rating: 10,
      date: '2 дня назад',
      text: 'Мастерpiece! Лучшая RPG десятилетия.',
    },
    {
      game: 'Cyberpunk 2077: Phantom Liberty',
      rating: 9,
      date: '1 неделя назад',
      text: 'CD Projekt искупили свои грехи. Отличный сюжет и персонажи.',
    },
    {
      game: 'Alan Wake 2',
      rating: 8.5,
      date: '2 недели назад',
      text: 'Атмосферный психологический хоррор. Инновационный нарратив.',
    },
    {
      game: 'Hades II (Early Access)',
      rating: 9,
      date: '3 недели назад',
      text: 'Supergiant снова сделали шедевр. Дождёмся полного релиза!',
    },
  ];

  const gamingPlatforms = [
    { icon: FaSteam, name: 'Steam', username: userData.steamId, color: 'gray.700' },
    { icon: FaTwitch, name: 'Twitch', username: userData.twitch, color: 'purple.600' },
    { icon: FaDiscord, name: 'Discord', username: userData.discord, color: 'blue.500' },
  ];

  const favoriteGamesList = [
    'The Witcher 3',
    'Disco Elysium',
    'Hades',
    'Baldurs Gate 3',
    'Elden Ring',
    'Hollow Knight',
  ];

  const badges = [
    { name: 'Эксперт RPG', icon: FiAward, color: 'purple' },
    { name: '100+ обзоров', icon: StarIcon, color: 'gold' },
    { name: 'Ранний доступ', icon: FiClock, color: 'blue' },
    { name: 'Помощник сообщества', icon: FiUsers, color: 'green' },
  ];

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} скопирован`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return 'green';
    if (rating >= 8) return 'blue';
    if (rating >= 7) return 'yellow';
    return 'red';
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await updateAvatar(file);
        toast({
          title: 'Аватар обновлен',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить аватар',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  // Расчет XP для следующего уровня
  const xpToNextLevel = Math.pow(userLevel, 2) * 100;
  const xpForCurrentLevel = Math.pow(userLevel - 1, 2) * 100;
  const xpProgress = ((userXP - xpForCurrentLevel) / (xpToNextLevel - xpForCurrentLevel)) * 100;
  const xpNeeded = xpToNextLevel - userXP;

  return (
    <Box minH="100vh" bg={bgColor}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleAvatarChange}
      />

      <Container maxW="container.xl" py={8} px={4}>
        <Card borderRadius="2xl" overflow="hidden" boxShadow="xl" bg={cardBgColor}>
          {/* Верхний баннер с геймерским градиентом */}
          <Box
            h="200px"
            bgGradient="linear(to-r, #0f0c29, #302b63, #24243e)"
            position="relative"
            backgroundImage="url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200')"
            backgroundSize="cover"
            backgroundPosition="center">
            <Box position="absolute" inset={0} bg="blackAlpha.600" />

            {/* Уровень и XP */}
            <Box
              position="absolute"
              bottom={4}
              left={4}
              zIndex={1}
              bg="blackAlpha.700"
              p={3}
              borderRadius="lg"
              backdropFilter="blur(10px)">
              <HStack spacing={4}>
                <Popover>
                  <PopoverTrigger>
                    <Badge
                      colorScheme="yellow"
                      fontSize="md"
                      p={2}
                      borderRadius="full"
                      cursor="pointer">
                      <HStack>
                        <StarIcon />
                        <Text>Уровень {userLevel}</Text>
                        <QuestionIcon boxSize={3} />
                      </HStack>
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent width="300px">
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody p={4}>
                      <VStack align="start" spacing={3}>
                        <Text fontWeight="bold" fontSize="md">
                          🎯 Как получить следующий уровень?
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          До уровня {userLevel + 1} осталось {xpNeeded} XP
                        </Text>
                        <Divider />
                        <List spacing={2} width="100%">
                          {xpRewards.map((reward, idx) => (
                            <ListItem key={idx}>
                              <HStack>
                                <ListIcon as={reward.icon} color={reward.color} />
                                <Text fontSize="sm" flex={1}>
                                  {reward.action}
                                </Text>
                                <Badge colorScheme="green">{reward.xp}</Badge>
                              </HStack>
                            </ListItem>
                          ))}
                        </List>
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>

                <Box>
                  <Text fontSize="xs" color="whiteAlpha.800">
                    Прогресс до уровня {userLevel + 1}
                  </Text>
                  <HStack>
                    <Progress
                      value={xpProgress}
                      size="sm"
                      width="150px"
                      colorScheme="yellow"
                      borderRadius="full"
                    />
                    <Text fontSize="xs" color="whiteAlpha.800">
                      {Math.floor(xpProgress)}%
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="whiteAlpha.600" mt={1}>
                    Осталось {xpNeeded} XP
                  </Text>
                </Box>
                <UserLevelInfo />
              </HStack>
            </Box>
          </Box>

          <Box px={6} pb={8} position="relative">
            {/* Аватар */}
            <Box position="relative" mt="-70px" mb={6} display="flex" justifyContent="center">
              <Avatar
                size="2xl"
                name={userData.name}
                src={
                  userData.avatar?.startsWith('http')
                    ? userData.avatar
                    : `http://localhost:7000${userData.avatar}`
                }
                border="4px solid"
                borderColor={cardBgColor}
                boxShadow="xl"
                cursor="pointer"
                onClick={() => fileInputRef.current?.click()}
                _hover={{ opacity: 0.8 }}>
                <AvatarBadge
                  as={IconButton}
                  aria-label="Change avatar"
                  icon={<FiCamera />}
                  size="sm"
                  rounded="full"
                  bottom="0"
                  right="0"
                  colorScheme="purple"
                  variant="solid"
                />
              </Avatar>
            </Box>

            {/* Информация о пользователе */}
            <VStack spacing={4} mb={8}>
              <Flex alignItems="center" gap={3} wrap="wrap" justify="center">
                {isEditing ? (
                  <Flex gap={2} wrap="wrap" justify="center">
                    <Input
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      placeholder="Ваше имя"
                      size="lg"
                      width="auto"
                    />
                    <Button colorScheme="purple" onClick={() => setIsEditing(false)}>
                      Сохранить
                    </Button>
                  </Flex>
                ) : (
                  <>
                    <Heading size="xl">🎮 {userData.name}</Heading>
                    <IconButton
                      aria-label="Edit name"
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                    />
                  </>
                )}
              </Flex>

              <Text color={secondaryTextColor} textAlign="center" maxW="2xl" fontSize="md">
                {userData.bio}
              </Text>

              <Flex gap={4} wrap="wrap" justify="center">
                <HStack spacing={1} color={secondaryTextColor}>
                  <Icon as={FiMapPin} />
                  <Text fontSize="sm">{userData.location}</Text>
                </HStack>
                <HStack spacing={1} color={secondaryTextColor}>
                  <CalendarIcon />
                  <Text fontSize="sm">На сайте с {userData.joinDate}</Text>
                </HStack>
              </Flex>

              {/* Платформы */}
              <Wrap spacing={3} justify="center">
                {gamingPlatforms.map((platform, idx) => (
                  <Tag
                    key={idx}
                    size="lg"
                    borderRadius="full"
                    variant="solid"
                    bg={platform.color}
                    color="white"
                    cursor="pointer"
                    onClick={() => handleCopy(platform.username, platform.name)}>
                    <TagLeftIcon as={platform.icon} />
                    <TagLabel>
                      {platform.name}: {platform.username}
                    </TagLabel>
                  </Tag>
                ))}
              </Wrap>

              {/* Бейджи */}
              <Wrap spacing={2} justify="center">
                {badges.map((badge, idx) => (
                  <Badge
                    key={idx}
                    px={3}
                    py={1}
                    borderRadius="full"
                    colorScheme={badge.color}
                    variant="subtle"
                    fontSize="sm">
                    <HStack spacing={1}>
                      <Icon as={badge.icon} />
                      <Text>{badge.name}</Text>
                    </HStack>
                  </Badge>
                ))}
              </Wrap>
            </VStack>

            {/* Статистика */}
            <SimpleGrid
              columns={{ base: 2, md: 3, lg: 6 }}
              spacing={4}
              mb={8}
              pb={8}
              borderBottomWidth="1px"
              borderColor={borderColor}>
              {stats.map((stat, index) => (
                <Stat key={index} textAlign="center">
                  <Icon as={stat.icon} w={6} h={6} color={stat.color} mb={2} />
                  <StatNumber fontSize="2xl" fontWeight="bold">
                    {stat.value}
                  </StatNumber>
                  <StatLabel color={secondaryTextColor}>{stat.label}</StatLabel>
                </Stat>
              ))}
            </SimpleGrid>

            {/* Tabs для контента */}
            <Tabs variant="soft-rounded" colorScheme="purple">
              <TabList mb={6} overflowX="auto" overflowY="hidden">
                <Tab>📝 Мои обзоры</Tab>
                <Tab>💬 Мои комментарии</Tab>
                <Tab>❤️ Желаемое</Tab> {/* Добавьте эту вкладку */}
                <Tab>🎮 Любимые игры</Tab>
                <Tab>🏆 Достижения</Tab>
                <Tab>📊 Активность</Tab>
                <Tab>📅 Календарь</Tab> {/* Добавьте эту вкладку */}
              </TabList>

              <TabPanels>
                {/* Панель с обзорами пользователя */}
                <TabPanel px={0}>
                  <UserReviews />
                </TabPanel>

                {/* Панель с комментариями пользователя */}
                <TabPanel px={0}>
                  <UserComments />
                </TabPanel>

                {/* Панель желаемого */}
                <TabPanel px={0}>
                  <Wishlist />
                </TabPanel>

                {/* Панель любимых игр */}
                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {favoriteGamesList.map((game, idx) => (
                      <Card key={idx} variant="outline" borderColor={borderColor} borderRadius="xl">
                        <CardBody>
                          <HStack>
                            <Icon as={FaPlaystation} w={8} h={8} color="purple.500" />
                            <VStack align="start" spacing={1}>
                              <Heading size="sm">{game}</Heading>
                              <Text fontSize="sm" color={secondaryTextColor}>
                                Прохождений: {Math.floor(Math.random() * 10) + 1} раз(а)
                              </Text>
                            </VStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>

                {/* Панель достижений */}
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    <Card variant="outline" borderColor={borderColor} borderRadius="xl">
                      <CardBody>
                        <Heading size="sm" mb={3}>
                          🎯 Недавние достижения
                        </Heading>
                        <VStack spacing={3}>
                          <Box w="100%">
                            <Flex justify="space-between" mb={1}>
                              <Text fontSize="sm">"Гуру обзоров" - 50 публикаций</Text>
                              <Text fontSize="sm" fontWeight="bold">
                                47/50
                              </Text>
                            </Flex>
                            <Progress
                              value={94}
                              size="sm"
                              colorScheme="purple"
                              borderRadius="full"
                            />
                          </Box>
                          <Box w="100%">
                            <Flex justify="space-between" mb={1}>
                              <Text fontSize="sm">"Помощник сообщества" - 1000 комментариев</Text>
                              <Text fontSize="sm" fontWeight="bold">
                                856/1000
                              </Text>
                            </Flex>
                            <Progress
                              value={85.6}
                              size="sm"
                              colorScheme="green"
                              borderRadius="full"
                            />
                          </Box>
                          <Box w="100%">
                            <Flex justify="space-between" mb={1}>
                              <Text fontSize="sm">"Эксперт RPG" - 20 обзоров RPG</Text>
                              <Text fontSize="sm" fontWeight="bold">
                                18/20
                              </Text>
                            </Flex>
                            <Progress
                              value={90}
                              size="sm"
                              colorScheme="orange"
                              borderRadius="full"
                            />
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>

                {/* Панель активности */}
                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Card variant="outline" borderColor={borderColor} borderRadius="xl">
                      <CardBody>
                        <Heading size="sm" mb={3}>
                          📊 Статистика обзоров по жанрам
                        </Heading>
                        <VStack spacing={2} align="stretch">
                          <Flex justify="space-between">
                            <Text>RPG</Text>
                            <Text fontWeight="bold">42%</Text>
                          </Flex>
                          <Progress value={42} size="sm" colorScheme="purple" />
                          <Flex justify="space-between" mt={2}>
                            <Text>Стратегии</Text>
                            <Text fontWeight="bold">28%</Text>
                          </Flex>
                          <Progress value={28} size="sm" colorScheme="blue" />
                          <Flex justify="space-between" mt={2}>
                            <Text>Инди</Text>
                            <Text fontWeight="bold">18%</Text>
                          </Flex>
                          <Progress value={18} size="sm" colorScheme="green" />
                          <Flex justify="space-between" mt={2}>
                            <Text>Экшен</Text>
                            <Text fontWeight="bold">12%</Text>
                          </Flex>
                          <Progress value={12} size="sm" colorScheme="red" />
                        </VStack>
                      </CardBody>
                    </Card>
                    <Card variant="outline" borderColor={borderColor} borderRadius="xl">
                      <CardBody>
                        <Heading size="sm" mb={3}>
                          🎯 Активность за месяц
                        </Heading>
                        <VStack spacing={2}>
                          <Flex justify="space-between" w="100%">
                            <Text>Обзоров: 8</Text>
                            <Text color="green.500">↑ +33%</Text>
                          </Flex>
                          <Flex justify="space-between" w="100%">
                            <Text>Комментариев: {userStats.totalComments}</Text>
                            <Text color="green.500">↑ +15%</Text>
                          </Flex>
                          <Flex justify="space-between" w="100%">
                            <Text>Лайков: {userStats.totalLikesReceived}</Text>
                            <Text color="green.500">↑ +47%</Text>
                          </Flex>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </TabPanel>

                {/* Панель календаря */}
                <TabPanel px={0}>
                  <ActivityCalendar />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
