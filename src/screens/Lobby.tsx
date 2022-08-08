import {
  Container, Box, Heading, Mark, Stack, Wrap, WrapItem, Center, Text, Button, Divider,
} from '@chakra-ui/react';
import {useEffect, useMemo, useState} from 'react';
import shallow from 'zustand/shallow';
import {Player} from '../lib/state';
import {useRoomStore} from '../lib/room';
import styles from '../styles/fixes.module.scss';

export default function Lobby() {
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const players = Array.from(state.players.values());
  const room = useRoomStore((s) => s.room);
  const [isReady, setReady] = useState(false);

  const toggleReady = async () => {
    room.send('toggleReady', !isReady);
    setReady((s) => !s);
  };

  return (
    <Stack className={styles.safarishit}>
      <Container flex={1} py="15px" display="flex" flexDirection="column">
        <Box>
          <Heading
            fontWeight="900"
            fontSize="5xl"
          >
            LOBBY
          </Heading>
          <Text>
            How long will you call these people friends?
          </Text>
        </Box>

        <Center flex={1}>
          <JoinCodeDisplay code={room.id} />
        </Center>

        <Center flex={1}>
          <Wrap spacing="30px" align="center" justify="center">
            {players.map((player) => (
              <WrapItem key={player.id}>
                <PlayerAvatar player={player} />
              </WrapItem>
            ))}
          </Wrap>
        </Center>

        <Divider mt="15px" />

        <Button colorScheme="gray" size="lg" mt="15px" onClick={toggleReady}>
          {isReady ? 'NOT READY' : 'READY'}
        </Button>
      </Container>
    </Stack>
  );
}

const PlayerAvatar = ({player}: {player: Player}) => {
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);

  return (
    <Box w="90px">
      <Stack alignItems="center">
        <Text fontSize="4xl">
          {player.emoji}
        </Text>
        <Text textAlign="center">
          <Mark bg={player.isReady ? 'green' : 'black'} color="white" px="1" py="1">
            {player.nickname}
            {player.id === state.host && <> 👑</>}
          </Mark>
        </Text>
      </Stack>
    </Box>
  );
};

const JoinCodeDisplay = ({code}: {code: string}) => (
  <Box>
    <Stack
      as={Box}
      alignItems="center"
      spacing={1}
    >
      <Heading
        fontWeight="900"
        fontSize="4xl"
      >
        JOIN CODE:
      </Heading>
      <Heading
        fontWeight="900"
        fontSize="6xl"
      >
        <Mark bg="black" color="white" px="4" py="2" fontFamily="mono">
          {code}
        </Mark>
      </Heading>
    </Stack>
  </Box>
);
