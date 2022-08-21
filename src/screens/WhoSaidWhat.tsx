import {
  Box, Container, Heading, Stack, Text, Flex, Button,
  Center, Spinner, Divider, HStack, Avatar, Tag, TagLabel, Wrap, WrapItem, Mark,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import shallow from 'zustand/shallow';
import styles from '../styles/fixes.module.scss';
import {useRoomStore} from '../lib/room';
import {Player} from '../lib/state';

export default function WhoSaidWhatScreen() {
  const room = useRoomStore((s) => s.room);
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);

  const rawAns = Array.from(state.currentQuestion.answers).map(([id, text]) => ({
    player: state.players.get(id) ?? {
      id, nickname: 'Unknown Player', emoji: '❌',
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
                Question:
              </Mark>
            </Heading>

            <Text fontWeight="900" fontSize="3xl" textAlign="right">
              {state.currentQuestion.text}
            </Text>
          </Stack>

          <Center>
            <Mark bg="black" color="white" px="2" py="1">
              who said what:
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
              NEXT ROUND
            </Button>
          </>
        ) : (
          <Text>wait for the host to start next round</Text>
        )}
      </Container>
    </Stack>
  );
}
