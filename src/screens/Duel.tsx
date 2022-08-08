import {
  Box, Container, Heading, Stack, Text, Flex, Button,
  Center, Spinner, Divider, HStack, Avatar, Tag, TagLabel, Wrap, WrapItem, Mark,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import shallow from 'zustand/shallow';
import styles from '../styles/fixes.module.scss';
import {useRoomStore} from '../lib/room';
import ReadyPlayersList from '../components/ReadyPlayersList';
import {Player} from '../lib/state';

export default function DuelScreen() {
  const [myChoice, setMyChoice] = useState<string>();
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
  });

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
                Question:
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
                Answer:
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
              >
                {state.currentDuel.answer}
              </Heading>
            </Center>
          </Box>

          <Center>
            <Text>
              <Mark bg="black" color="white" px="2" py="1">
                ...who said that?
              </Mark>
            </Text>
          </Center>
        </Stack>

        <HStack flex={1} alignItems="center">

          {[left, right].map((player) => (
            <Box flex={1} key={player.id}>
              <PlayerChoiceBox
                player={player}
                selected={myChoice === player.id}
                fogged={!!myChoice}
                onClick={() => handleChoiceSubmit(player)}
              />
            </Box>
          ))}

        </HStack>

        <Box>
          <ReadyPlayersList />
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
    <Box
      flex={1}
      borderRadius="5px"
      boxShadow={selected ? 'dark-lg' : 'none'}
      p={3}
      bg={selected ? 'purple.400' : 'black'}
      color="white"
      fontSize="xl"
      textAlign="center"
      onClick={onClick}
      userSelect="none"
      filter={fogged && !selected ? 'blur(2px)' : 'none'}
    >
      <Stack alignItems="center">
        <Text fontSize="4xl">
          {player.emoji}
        </Text>
        <Text textAlign="center">
          {player.nickname}
        </Text>
      </Stack>
    </Box>
  );
}
