import React, { useState } from 'react';
import {
	Box,
	Container,
	VStack,
	Input,
	Button,
	Text,
	Heading,
	FormControl,
	FormLabel,
	InputGroup,
	InputLeftElement,
	useToast,
	Link,
	Divider
} from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Login = () => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { login: loginUser } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await loginUser(login, password);
			toast({
				title: 'Успешный вход',
				status: 'success',
				duration: 3000
			});
			navigate('/profile');
		} catch (error) {
			toast({
				title: 'Ошибка входа',
				description: error.response?.data?.message || 'Неверный логин или пароль',
				status: 'error',
				duration: 3000
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxW="md" py={12}>
			<Box bg="white" p={8} borderRadius="xl" boxShadow="xl">
				<VStack spacing={6}>
					<Heading size="xl" color="purple.600">🎮 Вход</Heading>

					<form onSubmit={handleSubmit} style={{ width: '100%' }}>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel>Email или имя пользователя</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<EmailIcon color="gray.300" />
									</InputLeftElement>
									<Input
										type="text"
										value={login}
										onChange={(e) => setLogin(e.target.value)}
										placeholder="example@mail.com или username"
									/>
								</InputGroup>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Пароль</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<LockIcon color="gray.300" />
									</InputLeftElement>
									<Input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="••••••"
									/>
								</InputGroup>
							</FormControl>

							<Button
								type="submit"
								colorScheme="purple"
								size="lg"
								width="100%"
								isLoading={loading}
							>
								Войти
							</Button>
						</VStack>
					</form>

					<VStack spacing={2} width="100%">
						<Link as={RouterLink} to="/forgot-password" color="purple.500" fontSize="sm">
							Забыли пароль?
						</Link>
						<Divider />
						<Text>
							Нет аккаунта?{' '}
							<Link as={RouterLink} to="/register" color="purple.500" fontWeight="bold">
								Зарегистрироваться
							</Link>
						</Text>
					</VStack>
				</VStack>
			</Box>
		</Container>
	);
};

export default Login;