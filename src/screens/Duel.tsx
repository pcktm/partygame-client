import {
  Box, Container, Heading, Stack, Text, Flex, Button,
  Center, Spinner, Divider, HStack, Avatar, Tag, TagLabel, Wrap, WrapItem, Mark,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import shallow from 'zustand/shallow';
import {useTranslation} from 'react-i18next';
import styles from '../styles/fixes.module.scss';
import {useRoomStore} from '../lib/room';
import ReadyPlayersList from '../components/ReadyPlayersList';
import {Player} from '../lib/state';

export default function DuelScreen() {
  const [myChoice, setMyChoice] = useState<string>();
  const {t} = useTranslation();
  const room = useRoomStore((s) => s.room);
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);

  const {left, right} = state.currentDuel;

  const handleChoiceSubmit = async (player: Player) => {
    if (!myChoice) {
      setMyChoice(player.id);
      room.send('submitDuelChoice', player.id);
    }
  };

  useEffect(() => {
    room.onMessage('beginNewDuel', () => {
      setMyChoice(undefined);
    });
  }, [room]);

  const requestNextDuel = () => {
    room.send('requestNextScreen');
  };

  return (
    <Stack className={styles.safarishit}>
      <Container flex={1} py="15px" display="flex" flexDirection="column">
        <Stack mb={2}>
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

          <Box>
            <Heading
              fontSize="xl"
            >
              <Mark bg="black" color="white" px="2" py="1">
                {t('duel.answer')}
              </Mark>
            </Heading>

            <Center
              backgroundColor="black"
              px={4}
              py={2}
            >
              <Heading
                color="white"
                fontWeight="900"
                fontSize="4xl"
                textAlign="left"
                wordBreak="break-word"
              >
                {state.currentDuel.answer}
              </Heading>
            </Center>
          </Box>

          <Center>
            <Text>
              <Mark bg="black" color="white" px="2" py="1">
                {t('duel.whoSaidThat')}
              </Mark>
            </Text>
          </Center>

        </Stack>
        <Stack flex={1} justifyContent="center">
          <HStack
            mt={state.currentDuel.revealVotes ? 10 : 0}
            alignItems={state.currentDuel.revealVotes ? 'baseline' : 'center'}
          >
            {
            !state.currentDuel.revealVotes ? (
              [left, right].map((player) => (
                <Box flex={1} key={player.id}>
                  <PlayerChoiceBox
                    player={player}
                    selected={myChoice === player.id}
                    fogged={!!myChoice}
                    onClick={() => handleChoiceSubmit(player)}
                  />
                </Box>
              ))
            ) : (
              [left, right].map((side) => {
                const voters: {id: string, nickname: string, emoji: string}[] = [];
                state.currentDuel.votes.forEach((choice, voterId) => {
                  const voter = state.players.get(voterId) ?? {id: voterId, nickname: 'Unknown Player', emoji: '❌'};
                  if (choice === side.id) {
                    voters.push(voter);
                  }
                });

                return (
                  <Box key={side.id} flex={1} textAlign="center">
                    <Heading color="black" size="md" mb={1}>
                      {side.nickname}
                    </Heading>
                    <Heading mb={3}>
                      <Mark bg="black" color="white" px="2" py="1">
                        {`${Math.floor((voters.length / state.currentDuel.votes.size) * 100)}%`}
                      </Mark>
                    </Heading>

                    <Wrap align="center" justify="center">
                      {
                        voters.map((v) => (
                          <WrapItem key={v.id}>
                            <Tag size="lg" borderRadius="full">
                              <Text
                                fontSize="xl"
                                ml={-1}
                                mr={2}
                              >
                                {v.emoji}
                              </Text>
                              <TagLabel mb={0.2}>{v.nickname}</TagLabel>
                            </Tag>
                          </WrapItem>
                        ))
                      }
                    </Wrap>
                    {voters.length === 0 && (
                    <Box>
                      {t('duel.noVotes')}
                    </Box>
                    )}
                  </Box>
                );
              })
            )
          }
          </HStack>
          {
            !state.currentDuel.revealVotes
            && [state.currentDuel.left.id, state.currentDuel.right.id].includes(room.sessionId)
            && (
            <Box>
              <Text textAlign="center" color="gray.600">
                {t('duel.hiddenFromOthers')}
              </Text>
            </Box>
            )
          }

        </Stack>

        {state.currentDuel.revealVotes && ((room.sessionId === state.host && state.currentDuel.revealVotes) ? (
          <>
            <Divider mt="15px" />
            <Button colorScheme="gray" size="lg" mt="15px" onClick={requestNextDuel}>
              {t('duel.nextDuel')}
            </Button>
          </>
        ) : (<>{t('duel.waitForHost')}</>))}

        <Box>
          {
            !state.currentDuel.revealVotes && <ReadyPlayersList />
          }
        </Box>

      </Container>
    </Stack>
  );
}

function PlayerChoiceBox(
  {
    player, selected, onClick, fogged,
  }: {player: Player, selected: boolean, onClick: () => void, fogged: boolean},
) {
  return (
    <Box filter={fogged && !selected ? 'saturate(0%);' : 'none'}>
      <Box
        flex={1}
        borderRadius="md"
        boxShadow={selected ? '2xl' : 'none'}
        p={3}
        bg={selected ? 'purple.500' : 'black'}
        color="white"
        borderColor={selected ? 'purple.700' : 'black'}
        borderWidth={selected ? '1px' : 0}
        fontSize="xl"
        textAlign="center"
        onClick={onClick}
        userSelect="none"
        filter={fogged && !selected ? 'blur(2px);' : 'none'}
      >
        <Stack alignItems="center">
          <Text fontSize="4xl">
            {player.emoji}
          </Text>
          <Text textAlign="center" wordBreak="break-all">
            {player.nickname}
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
