import React, { useState } from 'react';
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
  Grid,
  GridItem,
  Badge,
  Divider,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
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
} from '@chakra-ui/react';
import {
  EditIcon,
  SettingsIcon,
  BellIcon,
  LockIcon,
  EmailIcon,
  CalendarIcon,
  StarIcon,
  InfoIcon,
  ExternalLinkIcon,
  AddIcon,
  TimeIcon,
} from '@chakra-ui/icons';
import {
  FiMapPin,
  FiBriefcase,
  FiLogOut,
  FiCamera,
  FiThumbsUp,
  FiMessageCircle,
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiClock,
} from 'react-icons/fi';
import { FaSteam, FaTwitch, FaDiscord, FaPlaystation, FaXbox } from 'react-icons/fa';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Артур Пономаренко',
    email: 'arthur.ponomarenko@example.com',
    bio: '🎮 Заядлый геймер с 15-летним стажем. Специализируюсь на RPG, стратегиях и инди-играх. Пишу честные обзоры и делюсь впечатлениями о новинках игровой индустрии.',
    location: 'Санкт-Петербург, Россия',
    favoriteGenres: 'RPG, Стратегии, Инди, Roguelike',
    joinDate: 'Март 2023',
    favoriteGames: 'The Witcher 3, Disco Elysium, Hades, Baldurs Gate 3',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    steamId: 'arthur_gamer',
    twitch: 'arthur_plays',
    discord: 'arthur#1234',
  });

  const toast = useToast();

  const stats = [
    { label: 'Обзоров', value: '47', icon: FiMessageCircle, color: 'blue.500' },
    { label: 'Комментариев', value: '1.2K', icon: FiThumbsUp, color: 'green.500' },
    { label: 'Лайков', value: '3.4K', icon: StarIcon, color: 'yellow.500' },
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

  const favoriteGenres = ['RPG', 'Стратегии', 'Инди', 'Roguelike', 'Action', 'Приключения'];
  const favoriteGames = [
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
  const textColor = useColorModeValue('gray.800', 'white');
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

  return (
    <Box minH="100vh" bg={bgColor} py={8} px={4}>
      <Container maxW="container.xl">
        {/* Основная карточка */}
        <Card borderRadius="2xl" overflow="hidden" boxShadow="xl" bg={cardBgColor}>
          {/* Верхний баннер с геймерским градиентом */}
          <Box
            h="200px"
            bgGradient="linear(to-r, #0f0c29, #302b63, #24243e)"
            position="relative"
            backgroundImage="url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200')"
            backgroundSize="cover"
            backgroundPosition="center">
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-r, blackAlpha.800, blackAlpha.600)"
            />
            <IconButton
              aria-label="Edit banner"
              icon={<EditIcon />}
              position="absolute"
              top={4}
              right={4}
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.300' }}
              zIndex={1}
            />
            <Flex
              position="relative"
              zIndex={1}
              h="100%"
              alignItems="center"
              justifyContent="center">
              <Badge
                px={4}
                py={2}
                borderRadius="full"
                fontSize="lg"
                colorScheme="yellow"
                variant="solid">
                🎮 Игровой критик • Уровень 15 🎮
              </Badge>
            </Flex>
          </Box>

          <Box px={6} pb={8} position="relative">
            {/* Аватар */}
            <Box position="relative" mt="-70px" mb={6} display="flex" justifyContent="center">
              <Avatar
                size="2xl"
                name={userData.name}
                src={userData.avatar}
                border="4px solid"
                borderColor={cardBgColor}
                boxShadow="xl">
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
                  <Text fontSize="sm">Любимые жанры: {userData.favoriteGenres}</Text>
                </HStack>
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
                <Tab>📝 Последние обзоры</Tab>
                <Tab>🎮 Любимые игры</Tab>
                <Tab>🏆 Достижения</Tab>
                <Tab>📊 Активность</Tab>
              </TabList>

              <TabPanels>
                {/* Панель обзоров */}
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    {recentReviews.map((review, idx) => (
                      <Card key={idx} variant="outline" borderColor={borderColor} borderRadius="xl">
                        <CardBody>
                          <Flex justify="space-between" align="start" wrap="wrap" gap={3}>
                            <VStack align="start" spacing={2} flex={1}>
                              <Heading size="md">{review.game}</Heading>
                              <Text color={secondaryTextColor}>{review.text}</Text>
                              <HStack>
                                <TimeIcon w={3} h={3} color={secondaryTextColor} />
                                <Text fontSize="sm" color={secondaryTextColor}>
                                  {review.date}
                                </Text>
                              </HStack>
                            </VStack>
                            <Box textAlign="center">
                              <Badge
                                colorScheme={getRatingColor(review.rating)}
                                fontSize="lg"
                                px={3}
                                py={2}
                                borderRadius="full">
                                {review.rating}/10
                              </Badge>
                            </Box>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                    <Button variant="ghost" colorScheme="purple" mt={2}>
                      Смотреть все обзоры →
                    </Button>
                  </VStack>
                </TabPanel>

                {/* Панель любимых игр */}
                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {favoriteGames.map((game, idx) => (
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
                            <Text>Комментариев: 127</Text>
                            <Text color="green.500">↑ +15%</Text>
                          </Flex>
                          <Flex justify="space-between" w="100%">
                            <Text>Лайков: 892</Text>
                            <Text color="green.500">↑ +47%</Text>
                          </Flex>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Card>

        {/* Секция с жанрами */}
        <Card mt={8} borderRadius="xl" boxShadow="md" bg={cardBgColor}>
          <CardBody>
            <Heading size="md" mb={4}>
              🎮 Любимые игровые жанры
            </Heading>
            <Wrap spacing={3}>
              {favoriteGenres.map((genre, index) => (
                <WrapItem key={index}>
                  <Badge
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="md"
                    colorScheme="purple"
                    variant="subtle">
                    🎯 {genre}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
