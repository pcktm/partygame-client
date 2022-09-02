import {
  Heading, Mark, Stack, Text, Box,
} from '@chakra-ui/react';
import {Trans} from 'react-i18next';

export const HeroTitle = () => (
  <Box
    fontSize="4xl"
    lineHeight={1.5}
    mb="10px"
    position="relative"
  >
    <Mark bg="black" fontWeight="900" color="white" px="2" py="1">
      @PCKTM&apos;S
    </Mark>
    {' '}
    <br />
    <Mark bg="black" fontWeight="600" color="white" px="2" py="1">
      PARTY
    </Mark>
    {' '}
    <br />
    <Mark bg="black" fontWeight="600" color="white" px="2" py="1">
      GAME
    </Mark>
    {' '}
    <br />
  </Box>
);

export const HeroTagline = () => (
  <Stack alignItems="end">
    <Text textAlign="right" fontSize="md">
      <Trans i18nKey="tagline">
        A game where you
        {' '}
        <Mark bg="black" color="white" px="2" py="1">answer questions</Mark>
        <br />
        and
        {' '}
        <Mark bg="black" color="white" px="2" py="1">lose friends.</Mark>
      </Trans>
    </Text>
  </Stack>
);
