import {
  Heading, Mark, Stack, Text,
} from '@chakra-ui/react';

export const HeroTitle = () => (
  <Heading
    fontWeight="900"
    fontSize="4xl"
    lineHeight="tall"
    mb="10px"
  >
    <Mark bg="black" color="white" px="2" py="1">
      UNNAMED
    </Mark>
    {' '}
    <br />
    <Mark bg="black" color="white" px="2" py="1">
      PARTY
    </Mark>
    {' '}
    <br />
    <Mark bg="black" color="white" px="2" py="1">
      GAME
    </Mark>
    {' '}
    <br />
  </Heading>
);

export const HeroTagline = () => (
  <Stack alignItems="end">
    <Text textAlign="right" fontSize="md">
      A game where you
      {' '}
      <Mark bg="black" color="white" px="2" py="1">anwser questions</Mark>
      <br />
      and
      {' '}
      <Mark bg="black" color="white" px="2" py="1">lose friends.</Mark>
    </Text>
  </Stack>
);
