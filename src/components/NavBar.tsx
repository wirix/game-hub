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
    <HStack padding="10px" spacing={4} justify="space-between" wrap="wrap">
      <HStack spacing={4}>
        <Link to={'/'}>
          <Image src={logo} boxSize="60px" objectFit="cover" />
        </Link>
        <SearchInput />
      </HStack>

      <HStack spacing={4}>
        <ColorModeSwitch />

        {user ? (
          // Пользователь авторизован - показываем аватар и меню
          <Menu>
            <MenuButton as={Button} variant="ghost" cursor="pointer" minW={0} rounded="full">
              <Avatar
                size="sm"
                name={user.fullName}
                src={user.avatar ? `http://localhost:7000${user.avatar}` : undefined}
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
          // Пользователь не авторизован - показываем кнопки входа и регистрации
          <HStack spacing={2}>
            <Button
              as={Link}
              to="/login"
              leftIcon={<FaSignInAlt />}
              colorScheme="purple"
              variant="ghost"
              size="sm">
              Вход
            </Button>
            <Button
              as={Link}
              to="/register"
              leftIcon={<FaUserPlus />}
              colorScheme="purple"
              size="sm">
              Регистрация
            </Button>
          </HStack>
        )}

        {/* Иконка настроек (только для авторизованных) */}
        {user && (
          <Link to={'/profile'}>
            <SettingsIcon boxSize={5} cursor="pointer" _hover={{ color: 'purple.500' }} />
          </Link>
        )}
      </HStack>
    </HStack>
  );
};

export default NavBar;
