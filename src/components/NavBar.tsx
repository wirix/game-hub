import { SettingsIcon } from '@chakra-ui/icons';
import {
  HStack,
  Image,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Box,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo.webp';
import ColorModeSwitch from './ColorModeSwitch';
import SearchInput from './SearchInput';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(10px)"
      bg="rgba(255, 255, 255, 0.1)"
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
      borderBottom="1px solid rgba(255, 255, 255, 0.3)"
      _dark={{
        bg: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
      <HStack
        padding="10px"
        spacing={4}
        justify="space-between"
        wrap="wrap"
        maxW="1400px"
        mx="auto">
        <HStack spacing={4}>
          <Link to={'/'}>
            <Image
              src={logo}
              boxSize="60px"
              objectFit="cover"
              transition="transform 0.3s ease"
              _hover={{ transform: 'scale(1.05)' }}
            />
          </Link>
          <SearchInput />
        </HStack>

        <HStack spacing={4}>
          <ColorModeSwitch />

          {user ? (
            <Menu>
              <MenuButton as={Button} variant="ghost" cursor="pointer" minW={0} rounded="full">
                <Avatar
                  size="sm"
                  name={user.fullName}
                  src={user.avatar ? `http://localhost:7000${user.avatar}` : undefined}
                  border="2px solid"
                  borderColor="purple.500"
                />
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaUser />} onClick={() => navigate('/profile')}>
                  Мой профиль
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout} color="red.500">
                  Выйти
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={2}>
              <Button
                as={Link}
                to="/login"
                leftIcon={<FaSignInAlt />}
                colorScheme="purple"
                variant="ghost"
                size="sm"
                _hover={{
                  bg: 'rgba(107, 70, 193, 0.2)',
                  transform: 'scale(1.05)',
                }}
                transition="all 0.2s ease">
                Вход
              </Button>
              <Button
                as={Link}
                to="/register"
                leftIcon={<FaUserPlus />}
                colorScheme="purple"
                size="sm"
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 15px rgba(107, 70, 193, 0.5)',
                }}
                transition="all 0.2s ease">
                Регистрация
              </Button>
            </HStack>
          )}

          {user && (
            <Link to={'/profile'}>
              <SettingsIcon
                boxSize={5}
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{
                  color: 'purple.500',
                  transform: 'rotate(90deg)',
                }}
              />
            </Link>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default NavBar;
