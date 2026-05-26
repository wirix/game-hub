import { Card, CardBody, Heading, HStack, Image, IconButton, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Game from '../entities/Game';
import getCroppedImageUrl from '../services/image-url';
import CriticScore from './CriticScore';
import Emoji from './Emoji';
import PlatformIconList from './PlatformIconList';
import { useAuth } from '../contexts/AuthContext';
import wishlistService from '../services/wishlist.service';

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  const { user } = useAuth();
  const toast = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем статус игры в вишлисте при загрузке
  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, game.id]);

  const checkWishlistStatus = async () => {
    try {
      const data = await wishlistService.checkWishlistStatus(game.id);
      setIsInWishlist(data.inWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в аккаунт чтобы добавить игру в желаемое',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(game.id);
        setIsInWishlist(false);
        toast({
          title: 'Удалено из желаемого',
          status: 'success',
          duration: 2000,
        });
      } else {
        await wishlistService.addToWishlist(game);
        setIsInWishlist(true);
        toast({
          title: 'Добавлено в желаемое!',
          status: 'success',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card position="relative">
      {/* Кнопка добавления в желаемое */}
      <IconButton
        aria-label="Add to wishlist"
        icon={isInWishlist ? <FaHeart /> : <FaRegHeart />}
        position="absolute"
        top={2}
        right={2}
        zIndex={2}
        colorScheme={isInWishlist ? 'red' : 'gray'}
        variant="solid"
        size="sm"
        borderRadius="full"
        opacity={0.9}
        _hover={{ opacity: 1, transform: 'scale(1.1)' }}
        transition="all 0.2s"
        onClick={handleWishlistClick}
        isLoading={isLoading}
      />

      <Image src={getCroppedImageUrl(game.background_image)} />
      <CardBody>
        <HStack justifyContent="space-between" marginBottom={3}>
          <PlatformIconList platforms={game.parent_platforms?.map((p) => p.platform)} />
          <CriticScore score={game.metacritic} />
        </HStack>
        <Heading fontSize="2xl">
          <Link to={'/games/' + game.slug}>{game.name}</Link>
          <Emoji rating={game.rating_top} />
        </Heading>
      </CardBody>
    </Card>
  );
};

export default GameCard;
