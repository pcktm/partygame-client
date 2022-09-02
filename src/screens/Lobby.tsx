import {
  Container, Box, Heading, Mark, Stack, Wrap, WrapItem, Center, Text, Button, Divider, HStack, CloseButton,
} from '@chakra-ui/react';
import {
  useEffect, useMemo, useRef, useState, Fragment,
} from 'react';
import {motion} from 'framer-motion';
import shallow from 'zustand/shallow';
import {useTranslation} from 'react-i18next';
import {Player} from '../lib/state';
import {useRoomStore} from '../lib/room';
import styles from '../styles/fixes.module.scss';

export default function Lobby() {
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);
  const {t} = useTranslation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const players = Array.from(state.players.values());
  const room = useRoomStore((s) => s.room);
  const [isReady, setReady] = useState(false);

  const toggleReady = async () => {
    room.send('toggleReady', !isReady);
    setReady((s) => !s);
  };

  const leaveLobby = async () => {
    room.leave();
  };

  return (
    <Stack className={styles.safarishit}>
      <Container flex={1} py="15px" display="flex" flexDirection="column">

        <Box>
          <HStack>
            <Heading
              fontWeight="900"
              fontSize="5xl"
              flex={1}
            >
              {t('lobby.header')}
            </Heading>
            <Box>
              <CloseButton size="lg" onClick={leaveLobby} />
            </Box>
          </HStack>
          <Text>
            {t('lobby.subheader')}
          </Text>
        </Box>

        <Center flex={1}>
          <JoinCodeDisplay code={room.id} />
        </Center>

        <Center flex={1}>
          <PlayerList players={players} />
        </Center>

        <Divider mt="15px" />

        <Button colorScheme="gray" size="lg" mt="15px" onClick={toggleReady}>
          {isReady ? t('notReady') : t('ready')}
        </Button>
      </Container>
    </Stack>
  );
}

const PlayerList = ({players}: {players: Player[]}) => (
  <Wrap shouldWrapChildren={false} spacing="30px" align="center" justify="center">
    {players.map((player) => (
      <WrapItem key={player.id}>
        <PlayerAvatar player={player} />
      </WrapItem>
    ))}
  </Wrap>
);

const PlayerAvatar = ({player}: {player: Player}) => {
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);

  return (
    <Box w="90px">
      <Stack alignItems="center">
        <Text fontSize="4xl">
          {player.emoji}
        </Text>
        <Box
          bg={player.isReady ? 'green' : 'black'}
          color="white"
          px="1"
          py="1"
          wordBreak="break-all"
          textAlign="center"
        >
          {player.nickname}
          {player.id === state.host && <> 👑</>}
        </Box>
      </Stack>
    </Box>
  );
};

const JoinCodeDisplay = ({code}: {code: string}) => {
  const {t} = useTranslation();

  return (
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
          {t('lobby.joinCode')}
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
};
