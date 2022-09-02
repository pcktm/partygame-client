import {
  Box, Container, Heading, Stack, Text, Button,
  Center, Divider, Mark,
} from '@chakra-ui/react';
import shallow from 'zustand/shallow';
import {useTranslation} from 'react-i18next';
import styles from '../styles/fixes.module.scss';
import {useRoomStore} from '../lib/room';

export default function WhoSaidWhatScreen() {
  const {t} = useTranslation();
  const room = useRoomStore((s) => s.room);
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);

  const rawAns = Array.from(state.currentQuestion.answers).map(([id, text]) => ({
    player: state.players.get(id) ?? {
      id, nickname: t('unknownPlayer'), emoji: '❌',
    },
    text,
  }));

  const requestNextRound = () => {
    room.send('requestNextScreen');
  };

  return (
    <Stack className={styles.safarishit}>
      <Container flex={1} py="15px" display="flex" flexDirection="column">
        <Stack mb={2} flex={1}>
          <Stack mb={1}>

            <Heading
              alignSelf="end"
              fontSize="xl"
            >
              <Mark bg="black" color="white" px="2" py="1">
                {t('question')}
              </Mark>
            </Heading>

            <Text fontWeight="900" fontSize="3xl" textAlign="right">
              {state.currentQuestion.text}
            </Text>
          </Stack>

          <Center>
            <Mark bg="black" color="white" px="2" py="1">
              {t('whoSaidWhat.whoSaidWhat')}
            </Mark>
          </Center>

          <Stack flex={1} spacing={7} pt={5}>
            {
              rawAns.map(({player, text}, index) => (
                <Box key={player.id} alignSelf="start">
                  <Stack spacing={2}>
                    <Heading
                      size="lg"
                      wordBreak="break-word"
                      pr="50px"
                    >
                      {`“${text}”`}
                    </Heading>
                    <Box
                      alignSelf="end"

                    >
                      {' — '}
                      <Mark bg="black" color="white" px="2" py="1" wordBreak="break-word">
                        {player.emoji}
                        {' '}
                        {player.nickname}
                      </Mark>
                    </Box>
                  </Stack>
                </Box>
              ))
            }
          </Stack>
        </Stack>
        {room.sessionId === state.host ? (
          <>
            <Divider mt="15px" />

            <Button colorScheme="gray" size="lg" mt="15px" onClick={requestNextRound}>
              {t('whoSaidWhat.nextRound')}
            </Button>
          </>
        ) : (
          <Text>{t('whoSaidWhat.waitForHost')}</Text>
        )}
      </Container>
    </Stack>
  );
}
