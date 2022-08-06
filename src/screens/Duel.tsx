import {
  Box, Container, Heading, Stack, Text, Flex, Button,
  Center, Spinner, Divider, HStack, Avatar, Tag, TagLabel, Wrap, WrapItem, Mark,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import shallow from 'zustand/shallow';
import styles from '../styles/fixes.module.scss';
import {useRoomStore} from '../lib/room';
import PlayersThatAnsweredList from '../components/PlayersThatAnsweredList';

export default function DuelScreen() {
  const {id, sessionId} = useRoomStore((s) => s.room);
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);

  return (
    <Stack className={styles.safarishit}>
      <Container flex={1} py="15px" display="flex" flexDirection="column">
        <Stack mb={2}>
          <Stack alignItems="end" mb={1}>
            <Heading
              fontSize="xl"
            >
              <Mark bg="black" color="white" px="2" py="1">
                Question:
              </Mark>
            </Heading>
            <Text fontWeight="900" fontSize="3xl" textAlign="right">
              {state.currentQuestion}
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

            <Box
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
                za rozjebanie przystanku w 2019 w krakowie
              </Heading>
            </Box>
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
          <Box flex={1}>
            left choice here l8r
          </Box>
          <Box flex={1}>
            right choice here l8r
          </Box>
        </HStack>

        <Box>
          <PlayersThatAnsweredList />
        </Box>

      </Container>
    </Stack>
  );
}
