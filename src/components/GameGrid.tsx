import { Button, SimpleGrid } from '@chakra-ui/react';
import { GameQuery } from '../App';
import useGames from '../hooks/useGames';
import GameCard from './GameCard';
import GameCardContainer from './GameCardContainer';
import GameCardSkeleton from './GameCardSkeleton';
import { Fragment } from 'react';

interface Props {
  gameQuery: GameQuery;
}

const GameGrid = ({ gameQuery }: Props) => {
  const { data, isError, isLoading, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGames(gameQuery);

    const skeletons = [1, 2, 3, 4, 5, 6];

  if (isError) return <div>Something went wrong</div>;

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} padding="10px" spacing={6}>
      {isLoading &&
        skeletons.map((skeleton) => (
          <GameCardContainer key={skeleton}>
            <GameCardSkeleton />
          </GameCardContainer>
        ))}
      {isSuccess &&
        (data?.pages || []).map((page, index) => (
          <Fragment key={index}>
            {page.results.map((game) => (
              <GameCardContainer key={game.id}>
                <GameCard game={game} />
              </GameCardContainer>
            ))}
          </Fragment>
        ))}
      {hasNextPage && (
        <Button disabled={isFetchingNextPage} onClick={fetchNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </SimpleGrid>
  );
};

export default GameGrid;
