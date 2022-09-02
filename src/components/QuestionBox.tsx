import {
  Stack, Heading, FormControl, Input, HStack, Button, Box,
} from '@chakra-ui/react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useRoomStore} from '../lib/room';
import {Question} from '../lib/state';

function QuestionBox({question}: {question: Question}) {
  const MAX_LENGTH = 35;
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState('');
  const {t} = useTranslation();
  const room = useRoomStore((s) => s.room);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    room.send('submitAnswer', answer.trim());
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
          placeholder={t('questionBox.placeholder')}
          size="lg"
          disabled={submitted}
          value={submitted ? '●●●●●●●●' : answer}
          onChange={(s) => setAnswer(s.currentTarget.value)}
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
              {t('questionBox.edit')}
            </Button>
          ) : (
            <Button
              alignSelf="end"
              disabled={answer.length === 0 || answer.length > MAX_LENGTH || submitted}
              size="lg"
              type="submit"
            >
              {t('questionBox.submit')}
            </Button>
          )}

        </HStack>
      </FormControl>
    </Stack>
  );
}

export default QuestionBox;
