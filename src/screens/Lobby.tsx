import {
  Container, Box, Heading, Mark, Stack, Wrap, WrapItem, Center, Text, Button, Divider,
} from '@chakra-ui/react';
import {useEffect, useMemo, useState} from 'react';
import shallow from 'zustand/shallow';
import {Player} from '../lib/state';
import {useRoomStore} from '../lib/room';
import styles from '../styles/fixes.module.scss';

export default function Lobby() {
  const [players, setPlayers] = useState<(Player & {id: string})[]>([]);
  const room = useRoomStore((s) => s.room);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    const update = () => {
      const p: (Player & {id: string})[] = [];
      room.state.players.forEach((v: any, key: string) => {
        p.push({
          id: key,
          nickname: v.nickname,
          isReady: v.isReady,
          emoji: v.emoji,
          score: v.score,
          answeredCurrentQuestion: v.answeredCurrentQuestion,
        });
      });
      setPlayers(p as any);
    };

    update();
    room.onStateChange(update);
  }, [room]);

  const toggleReady = async () => {
    await room.send('toggleReady', !isReady);
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
            {players.map((player, index) => (
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

const PlayerAvatar = ({player}: {player: Player & {id: string}}) => {
  const {sessionId} = useRoomStore((s) => s.room);
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);
  const backgroundColor = useMemo(() => {
    if (player.isReady) return 'green';
    if (player.id === sessionId) return 'black';
    return 'black';
  }, [player, sessionId]);
  return (
    <Box w="90px">
      <Stack alignItems="center">
        <Text fontSize="4xl">
          {player.emoji}
        </Text>
        <Text textAlign="center">
          <Mark bg={backgroundColor} color="white" px="1" py="1">
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
