import React, { ReactNode } from 'react';
import { Box, keyframes } from '@chakra-ui/react';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

interface AnimatedGradientCardProps {
  children: ReactNode;
  isHovered?: boolean;
}

const AnimatedGradientCard: React.FC<AnimatedGradientCardProps> = ({
  children,
  isHovered = false,
}) => {
  return (
    <Box
      position="relative"
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: '2xl',
      }}>
      {/* Анимированный градиентный бордер */}
      <Box
        position="absolute"
        inset={0}
        borderRadius="xl"
        padding="2px"
        bgGradient="linear(90deg, #667eea, #764ba2, #f093fb, #4facfe, #667eea)"
        backgroundSize="300% 300%"
        animation={`${gradientAnimation} 3s ease infinite`}
        opacity={isHovered ? 1 : 0}
        transition="opacity 0.3s ease">
        <Box bg="white" borderRadius="xl" h="100%" w="100%" />
      </Box>

      {/* Контент */}
      <Box position="relative" zIndex={1} bg="white" borderRadius="xl" _dark={{ bg: 'gray.800' }}>
        {children}
      </Box>
    </Box>
  );
};

export default AnimatedGradientCard;
