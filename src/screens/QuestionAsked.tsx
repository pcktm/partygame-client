import {
  Box, Container, Heading, Stack, Text, Button,
  Center, FormControl, Input, HStack, Mark,
} from '@chakra-ui/react';
import React, {useMemo, useState} from 'react';
import shallow from 'zustand/shallow';
import {useTranslation} from 'react-i18next';
import {Question} from '../lib/state';
import ReadyPlayersList from '../components/ReadyPlayersList';
import {useRoomStore} from '../lib/room';
import styles from '../styles/fixes.module.scss';
import QuestionBox from '../components/QuestionBox';

export default function QuestionAskedScreen() {
  const {id, sessionId} = useRoomStore((s) => s.room);
  const {t} = useTranslation();
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
            {t('questionAsked.header')}
            {' '}
            <Mark bg="black" color="white" px="2" py="1">
              #
              {state.roundCount}
            </Mark>
          </Heading>
          <Text>
            {t('questionAsked.subheader')}
          </Text>
        </Box>

        <QuestionBox question={state.currentQuestion} />

        <Center flex={1} mb={4}>
          {
            state.players.get(sessionId)?.isReady && (
              <Text>
                {t('questionAsked.waitForOthers')}
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
