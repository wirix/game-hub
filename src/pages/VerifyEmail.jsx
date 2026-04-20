import React, { useEffect, useState } from 'react';
import {
	Box,
	Container,
	VStack,
	Heading,
	Text,
	Button,
	Spinner,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	useToast
} from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail = () => {
	const [searchParams] = useSearchParams();
	const [status, setStatus] = useState('verifying'); // verifying, success, error
	const [message, setMessage] = useState('');
	const { verifyEmail } = useAuth();
	const navigate = useNavigate();
	const toast = useToast();

	useEffect(() => {
		const token = searchParams.get('token');

		if (!token) {
			setStatus('error');
			setMessage('Отсутствует токен подтверждения');
			return;
		}

		const verify = async () => {
			try {
				await verifyEmail(token);
				setStatus('success');
				setMessage('Email успешно подтвержден!');
				toast({
					title: 'Email подтвержден',
					description: 'Теперь вы можете пользоваться всеми функциями',
					status: 'success',
					duration: 5000
				});
			} catch (error) {
				setStatus('error');
				setMessage(error.response?.data?.message || 'Ошибка при подтверждении email');
				toast({
					title: 'Ошибка',
					description: error.response?.data?.message || 'Не удалось подтвердить email',
					status: 'error',
					duration: 5000
				});
			}
		};

		verify();
	}, [searchParams, verifyEmail, toast]);

	return (
		<Container maxW="md" py={12}>
			<Box bg="white" p={8} borderRadius="xl" boxShadow="xl" textAlign="center">
				{status === 'verifying' && (
					<VStack spacing={4}>
						<Spinner size="xl" color="purple.500" />
						<Heading size="md">Подтверждение email...</Heading>
						<Text color="gray.500">Пожалуйста, подождите</Text>
					</VStack>
				)}

				{status === 'success' && (
					<VStack spacing={4}>
						<Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" p={6}>
							<AlertIcon boxSize="40px" mr={0} />
							<AlertTitle mt={4} mb={1} fontSize="lg">
								✅ Email подтвержден!
							</AlertTitle>
							<AlertDescription maxWidth="sm">
								{message}
							</AlertDescription>
						</Alert>
						<Button colorScheme="purple" onClick={() => navigate('/profile')}>
							Перейти в профиль
						</Button>
					</VStack>
				)}

				{status === 'error' && (
					<VStack spacing={4}>
						<Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" p={6}>
							<AlertIcon boxSize="40px" mr={0} />
							<AlertTitle mt={4} mb={1} fontSize="lg">
								❌ Ошибка
							</AlertTitle>
							<AlertDescription maxWidth="sm">
								{message}
							</AlertDescription>
						</Alert>
						<Button colorScheme="purple" onClick={() => navigate('/login')}>
							Вернуться к входу
						</Button>
					</VStack>
				)}
			</Box>
		</Container>
	);
};

export default VerifyEmail;