import React from 'react';
import { Button, keyframes } from '@chakra-ui/react';

const pulseRing = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(107, 70, 193, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(107, 70, 193, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(107, 70, 193, 0);
  }
`;

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  colorScheme?: string;
  size?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  colorScheme = 'purple',
  size = 'md',
}) => {
  return (
    <Button
      colorScheme={colorScheme}
      size={size}
      onClick={onClick}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        transition: 'left 0.5s ease',
      }}
      _hover={{
        transform: 'translateY(-2px)',
        animation: `${pulseRing} 1.5s ease infinite`,
        _before: {
          left: '100%',
        },
      }}
      transition="all 0.3s ease">
      {children}
    </Button>
  );
};

export default AnimatedButton;
