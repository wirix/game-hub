import React, { useState } from 'react';
import {
	Box,
	Container,
	VStack,
	HStack,
	Input,
	Button,
	Text,
	Heading,
	FormControl,
	FormLabel,
	FormErrorMessage,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	useToast,
	Link,
	Divider,
	Icon,
	Progress,
	Textarea
} from '@chakra-ui/react';
import {
	EmailIcon,
	LockIcon,
	ViewIcon,
	ViewOffIcon,
	InfoIcon
} from '@chakra-ui/icons';
import { FaUser, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Register = () => {
	const auth = useAuth();
	const { register } = auth;

	if (!register) {
		console.error('register function not found in auth context', auth);
		return (
			<Container maxW="md" py={8}>
				<Box bg="white" p={8} borderRadius="xl" boxShadow="xl">
					<Text color="red.500">
						Ошибка: функция регистрации не найдена. Проверьте настройки AuthProvider.
					</Text>
				</Box>
			</Container>
		);
	}
	const [formData, setFormData] = useState({
		fullName: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const toast = useToast();
	const navigate = useNavigate();

	// Валидация пароля
	const validatePassword = (password) => {
		const errors = [];
		if (password.length < 6) {
			errors.push('Минимум 6 символов');
		}
		if (!/[A-Z]/.test(password)) {
			errors.push('Хотя бы одну заглавную букву');
		}
		if (!/[0-9]/.test(password)) {
			errors.push('Хотя бы одну цифру');
		}
		return errors;
	};

	const passwordStrength = (password) => {
		let strength = 0;
		if (password.length >= 6) strength++;
		if (password.length >= 8) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[0-9]/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;
		return Math.min(strength, 4);
	};

	const getPasswordColor = (strength) => {
		switch (strength) {
			case 1: return 'red.500';
			case 2: return 'orange.500';
			case 3: return 'yellow.500';
			case 4: return 'green.500';
			default: return 'gray.300';
		}
	};

	const getPasswordText = (strength) => {
		switch (strength) {
			case 1: return 'Слабый';
			case 2: return 'Средний';
			case 3: return 'Хороший';
			case 4: return 'Сильный';
			default: return '';
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));

		// Очищаем ошибку для этого поля
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.fullName.trim()) {
			newErrors.fullName = 'Введите ваше полное имя';
		}

		if (!formData.username.trim()) {
			newErrors.username = 'Введите имя пользователя';
		} else if (formData.username.length < 3) {
			newErrors.username = 'Имя пользователя должно содержать минимум 3 символа';
		} else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
			newErrors.username = 'Имя пользователя может содержать только буквы, цифры и подчеркивание';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Введите email';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Введите корректный email';
		}

		if (!formData.password) {
			newErrors.password = 'Введите пароль';
		} else {
			const passwordErrors = validatePassword(formData.password);
			if (passwordErrors.length > 0) {
				newErrors.password = passwordErrors;
			}
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Пароли не совпадают';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			toast({
				title: 'Ошибка валидации',
				description: 'Пожалуйста, проверьте правильность заполнения формы',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
			return;
		}

		setLoading(true);

		try {
			await register({
				fullName: formData.fullName,
				username: formData.username,
				email: formData.email,
				password: formData.password
			});

			toast({
				title: 'Регистрация успешна!',
				description: 'Пожалуйста, проверьте вашу почту для подтверждения email адреса',
				status: 'success',
				duration: 6000,
				isClosable: true
			});

			// Перенаправляем на страницу профиля или верификации
			setTimeout(() => {
				navigate('/profile');
			}, 2000);

		} catch (error) {
			console.error('Registration error:', error);

			let errorMessage = 'Ошибка при регистрации';
			if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message) {
				errorMessage = error.message;
			}

			toast({
				title: 'Ошибка регистрации',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		} finally {
			setLoading(false);
		}
	};

	const passwordStrengthValue = passwordStrength(formData.password);
	const passwordErrors = Array.isArray(errors.password) ? errors.password : [];

	return (
		<Container maxW="md" py={8}>
			<Box
				bg="white"
				p={8}
				borderRadius="2xl"
				boxShadow="xl"
				border="1px solid"
				borderColor="gray.200"
			>
				<VStack spacing={6}>
					<VStack spacing={2} textAlign="center">
						<Icon as={FaUserCircle} w={12} h={12} color="purple.500" />
						<Heading size="xl" color="purple.600">
							🎮 Регистрация
						</Heading>
						<Text color="gray.500">
							Создайте аккаунт чтобы начать общаться с геймерами
						</Text>
					</VStack>

					<form onSubmit={handleSubmit} style={{ width: '100%' }}>
						<VStack spacing={4}>
							{/* ФИО */}
							<FormControl isRequired isInvalid={!!errors.fullName}>
								<FormLabel>ФИО</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<InfoIcon color="gray.300" />
									</InputLeftElement>
									<Input
										name="fullName"
										type="text"
										value={formData.fullName}
										onChange={handleChange}
										placeholder="Иванов Иван Иванович"
									/>
								</InputGroup>
								<FormErrorMessage>{errors.fullName}</FormErrorMessage>
							</FormControl>

							{/* Имя пользователя */}
							<FormControl isRequired isInvalid={!!errors.username}>
								<FormLabel>Имя пользователя</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<FaUser color="gray.300" />
									</InputLeftElement>
									<Input
										name="username"
										type="text"
										value={formData.username}
										onChange={handleChange}
										placeholder="gamer_ivan"
									/>
								</InputGroup>
								<FormErrorMessage>{errors.username}</FormErrorMessage>
								<Text fontSize="xs" color="gray.500" mt={1}>
									Только буквы, цифры и подчеркивание
								</Text>
							</FormControl>

							{/* Email */}
							<FormControl isRequired isInvalid={!!errors.email}>
								<FormLabel>Email</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<EmailIcon color="gray.300" />
									</InputLeftElement>
									<Input
										name="email"
										type="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="ivan@example.com"
									/>
								</InputGroup>
								<FormErrorMessage>{errors.email}</FormErrorMessage>
							</FormControl>

							{/* Пароль */}
							<FormControl isRequired isInvalid={passwordErrors.length > 0}>
								<FormLabel>Пароль</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<LockIcon color="gray.300" />
									</InputLeftElement>
									<Input
										name="password"
										type={showPassword ? 'text' : 'password'}
										value={formData.password}
										onChange={handleChange}
										placeholder="••••••"
									/>
									<InputRightElement>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? <ViewOffIcon /> : <ViewIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>

								{/* Индикатор сложности пароля */}
								{formData.password && (
									<Box mt={2}>
										<Progress
											value={(passwordStrengthValue / 4) * 100}
											size="sm"
											colorScheme={getPasswordColor(passwordStrengthValue)}
											borderRadius="full"
										/>
										<Text fontSize="xs" color={getPasswordColor(passwordStrengthValue)} mt={1}>
											{getPasswordText(passwordStrengthValue)} пароль
										</Text>
									</Box>
								)}

								{/* Список требований к паролю */}
								<Box mt={2}>
									{validatePassword(formData.password).map((error, idx) => (
										<Text key={idx} fontSize="xs" color="red.500">
											• {error}
										</Text>
									))}
								</Box>
							</FormControl>

							{/* Подтверждение пароля */}
							<FormControl isRequired isInvalid={!!errors.confirmPassword}>
								<FormLabel>Подтверждение пароля</FormLabel>
								<InputGroup>
									<InputLeftElement>
										<LockIcon color="gray.300" />
									</InputLeftElement>
									<Input
										name="confirmPassword"
										type={showConfirmPassword ? 'text' : 'password'}
										value={formData.confirmPassword}
										onChange={handleChange}
										placeholder="••••••"
									/>
									<InputRightElement>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										>
											{showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
								<FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
							</FormControl>

							<Button
								type="submit"
								colorScheme="purple"
								size="lg"
								width="100%"
								isLoading={loading}
								loadingText="Регистрация..."
								mt={4}
							>
								Зарегистрироваться
							</Button>
						</VStack>
					</form>

					<VStack spacing={3} width="100%">
						<Divider />

						<HStack spacing={2} fontSize="sm">
							<Text color="gray.600">Уже есть аккаунт?</Text>
							<Link as={RouterLink} to="/login" color="purple.500" fontWeight="bold">
								Войти
							</Link>
						</HStack>

						<Text fontSize="xs" color="gray.500" textAlign="center">
							Регистрируясь, вы соглашаетесь с нашими{' '}
							<Link color="purple.500">Условиями использования</Link> и{' '}
							<Link color="purple.500">Политикой конфиденциальности</Link>
						</Text>
					</VStack>
				</VStack>
			</Box>
		</Container>
	);
};

export default Register;