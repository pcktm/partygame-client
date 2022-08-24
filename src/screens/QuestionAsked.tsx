import {
  Box, Container, Heading, Stack, Text, Flex, Button,
  Center, FormControl, Input, FormHelperText, Spinner, Divider, HStack, Avatar, Tag, TagLabel, Wrap, WrapItem, Mark,
} from '@chakra-ui/react';
import React, {useMemo, useState} from 'react';
import shallow from 'zustand/shallow';
import {Question} from '../lib/state';
import ReadyPlayersList from '../components/ReadyPlayersList';
import {useRoomStore} from '../lib/room';
import styles from '../styles/fixes.module.scss';

export default function QuestionAskedScreen() {
  const {id, sessionId} = useRoomStore((s) => s.room);
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);

  return (
    <Stack className={styles.safarishit}>
      <Container flex={1} py="15px" display="flex" flexDirection="column">
        <Box mb={3}>
          <Heading
            mb={2}
            fontWeight="900"
            fontSize="5xl"
          >
            ROUND
            {' '}
            <Mark bg="black" color="white" px="2" py="1">
              #
              {state.roundCount}
            </Mark>
          </Heading>
          <Text>
            Answer as concisely as possible.
          </Text>
        </Box>

        <QuestionBox question={state.currentQuestion} />

        <Center flex={1} mb={4}>
          {
            state.players.get(sessionId)?.isReady && (
              <Text>
                Wait for others to answer...
              </Text>
            )
          }
        </Center>

        <Box>
          <ReadyPlayersList />
        </Box>

      </Container>
    </Stack>
  );
}

function QuestionBox({question}: {question: Question}) {
  const MAX_LENGTH = 35;
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState('');
  const room = useRoomStore((s) => s.room);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    room.send('submitAnswer', answer);
    setSubmitted(true);
  };

  const enableEditing = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(false);
  };

  const limitColor = answer.length > MAX_LENGTH ? 'red' : 'black';

  return (
    <Stack flexDirection="column" spacing={0} mb={4}>
      <Box px={3} py={4} bg="black" color="white">
        <Heading fontWeight={600} fontSize="3xl">
          {question.text}
        </Heading>
      </Box>
      <FormControl as="form" isRequired onSubmit={handleSubmit}>
        <Input
          borderRadius={0}
          placeholder="Answer here"
          size="lg"
          disabled={submitted}
          value={submitted ? '●●●●●●●●' : answer}
          onChange={(s) => setAnswer(s.currentTarget.value.trim())}
        />
        <HStack align="center" justifyContent="center" pt={2}>
          <Heading
            flex={1}
            color={submitted ? 'gray' : limitColor}
            size="md"
            fontWeight={500}
          >
            {answer.length}
            {' '}
            /
            {' '}
            {MAX_LENGTH}
          </Heading>
          {submitted ? (
            <Button size="lg" alignSelf="end" onClick={enableEditing}>
              Edit
            </Button>
          ) : (
            <Button
              alignSelf="end"
              disabled={answer.length === 0 || answer.length > MAX_LENGTH || submitted}
              size="lg"
              type="submit"
            >
              Submit
            </Button>
          )}

        </HStack>
      </FormControl>

    </Stack>
  );
}
