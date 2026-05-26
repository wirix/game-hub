import React, { ReactNode } from 'react';
import { Box, Card, CardBody, keyframes } from '@chakra-ui/react';

const neonPulse = keyframes`
  0% {
    box-shadow: 0 0 5px #667eea, 0 0 10px #667eea, 0 0 15px #667eea;
  }
  50% {
    box-shadow: 0 0 10px #764ba2, 0 0 20px #764ba2, 0 0 30px #764ba2;
  }
  100% {
    box-shadow: 0 0 5px #667eea, 0 0 10px #667eea, 0 0 15px #667eea;
  }
`;

interface NeonCardProps {
  children: ReactNode;
  color?: string;
  onClick?: () => void;
}

const NeonCard: React.FC<NeonCardProps> = ({ children, color = '#667eea', onClick }) => {
  return (
    <Card
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        animation: `${neonPulse} 1.5s ease infinite`,
      }}
      sx={{
        '&:hover': {
          boxShadow: `0 0 15px ${color}, 0 0 30px ${color}`,
        },
      }}>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

export default NeonCard;
