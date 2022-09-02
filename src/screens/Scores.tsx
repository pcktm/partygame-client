import {
  Box, Button, Center, Container, Divider, Heading, HStack, Mark, Spinner, Stack, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr,
} from '@chakra-ui/react';

import shallow from 'zustand/shallow';
import React, {Ref, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styles from '../styles/fixes.module.scss';
import {useRoomStore} from '../lib/room';
import {HeroTitle} from '../components/Heros';
import {Player} from '../lib/state';
import {CanvasBackgroundConfetti} from '../components/CanvasConfetti';

export default function ScoresScreen() {
  const {t} = useTranslation();
  const {room} = useRoomStore((s) => ({room: s.room}));
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);

  const sortedPlayers = state.finalScores.sort((a, b) => b.score - a.score);

  const first = sortedPlayers[0];
  const podium = sortedPlayers.slice(1, 3);

  const restartGame = () => {
    room.send('restartGame');
    console.debug('restarting game');
  };

  return (
    <Stack className={styles.safarishit}>
      <Container flex={1} py="15px" display="flex" flexDirection="column">
        <HeroTitle />
        <Stack flex={1}>
          <Heading textAlign="center" mb={6}>
            {t('scores.header')}
          </Heading>

          {sortedPlayers.length > 0 ? (
            <Stack flex={1} spacing={1}>

              <Box flex={1} mb={6}>

                <Podium player={first} place={1} mb={6} />
                <HStack flex={1} align="start">
                  {podium.map((player, i) => (
                    <Box key={player.id} flex={1}>
                      <Podium player={player} place={i + 2} />
                    </Box>
                  ))}
                </HStack>

              </Box>

              <Box>
                <LeaderBoard players={sortedPlayers} />
              </Box>

            </Stack>
          ) : <Spinner size="lg" alignSelf="center" />}

        </Stack>
        {room.sessionId === state.host && (
          <Button colorScheme="gray" size="lg" mt="20px" onClick={restartGame}>
            {t('scores.restartGame')}
          </Button>
        )}
        <CanvasBackgroundConfetti />
      </Container>
    </Stack>
  );
}

const Podium = ({player, place, mb}: {player: Player, place: number, mb?: number}) => {
  // eslint-disable-next-line no-nested-ternary
  const award = place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉';

  return (
    <Box textAlign="center" mb={mb}>
      <Heading fontSize="5xl">
        {award}
      </Heading>
      <Text fontSize="lg">
        <Mark bg="black" color="white" px="2" py="1" shadow={place === 1 ? 'xl' : 'none'}>

          {player.nickname}
        </Mark>
      </Text>
    </Box>
  );
};

Podium.defaultProps = {
  mb: 0,
};

const LeaderBoard = ({players}: {players: Player[]}) => (
  <TableContainer flex={1} borderRadius="md" py={4} backdropFilter="blur(4px)" bg="whiteAlpha.400">
    <Table flex={1}>
      <Thead>
        <Tr>
          <Th>Player</Th>
          <Th isNumeric>Score</Th>
        </Tr>
      </Thead>
      <Tbody>

        {players.map((player) => (
          <Tr key={player.id}>
            <Td>
              {`${player.emoji} ${player.nickname}`}
            </Td>
            <Td isNumeric>{player.score}</Td>
          </Tr>
        ))}

      </Tbody>

    </Table>
  </TableContainer>
);
