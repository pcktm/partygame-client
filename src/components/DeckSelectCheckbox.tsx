import {QuestionIcon} from '@chakra-ui/icons';
import {
  useCheckbox, Box, Badge, Text, chakra, UseCheckboxProps, HStack,
} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';

export type Deck = {
  id: string,
  name: string,
  emoji: string,
  language: string,
  questionCount: number,
  isExplicit: boolean
};

export function DeckSelectCheckbox(props: UseCheckboxProps & {deck: Deck}) {
  const {
    state, getCheckboxProps, getInputProps, getLabelProps, htmlProps,
  } = useCheckbox(props);
  const {t} = useTranslation();

  return (
    <chakra.label
      cursor="pointer"
      userSelect="none"
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Badge
        px={4}
        py={3}
        variant="subtle"
        colorScheme={state.isChecked ? 'green' : 'gray'}
        {...getCheckboxProps()}
      >
        <Box {...getLabelProps()}>
          <Text fontSize="xl">
            {props.deck.emoji}
          </Text>
          <Text color="black" fontSize="md">
            {props.deck.name}
          </Text>
          <Badge variant="solid" colorScheme="green">
            <HStack spacing={1}>
              <QuestionIcon />
              <Text>
                {props.deck.questionCount}
              </Text>
            </HStack>

          </Badge>
          {props.deck.isExplicit && (
          <Badge ml={2} colorScheme="red">
            {t('adultContent')}
          </Badge>
          )}
        </Box>
      </Badge>
    </chakra.label>
  );
}
