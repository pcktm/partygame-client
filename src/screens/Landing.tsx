import {
  Box, Container, Heading, Stack, Text, Mark, HStack, PinInput, PinInputField, Button, useDisclosure, Modal, ModalBody,
  Center, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, Input, FormHelperText, Spinner,
  Alert, AlertIcon, Wrap, WrapItem, useCheckboxGroup,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import useSWR from 'swr';
import styles from '../styles/fixes.module.scss';
import {useRoomStore} from '../lib/room';
import {HeroTagline, HeroTitle} from '../components/Heros';
import QuestionCountIndicator from '../components/QuestionCountIndicator';
import LanguagePicker from '../components/LanguagePicker';
import {DeckSelectCheckbox, Deck} from '../components/DeckSelectCheckbox';

type FlowType = 'create' | 'join';

export default function Landing() {
  const [isConnecting, setConnecting] = useState(false);
  const [flow, setFlow] = useState<FlowType>('join');
  const [pin, setPin] = useState('');
  const joinRoomById = useRoomStore((s) => s.joinRoomById);
  const createRoom = useRoomStore((s) => s.createRoom);
  const modalDisclosure = useDisclosure();
  const {t} = useTranslation();

  const handlePinInput = (value: string) => {
    setConnecting(true);
    setFlow('join');
    setPin(value);
    modalDisclosure.onOpen();
  };

  const handleCreateButton = () => {
    setConnecting(true);
    setFlow('create');
    modalDisclosure.onOpen();
  };

  const handleModalSubmit = async (name: string, decks: string[] = []) => {
    if (flow === 'create') {
      await createRoom(name, decks);
    } else if (flow === 'join') {
      await joinRoomById(pin.trim().toLowerCase(), name);
    }
    setConnecting(false);
  };

  return (
    <>
      <NameModal {...modalDisclosure} onSubmit={handleModalSubmit} flow={flow} />
      <Stack className={styles.safarishit}>
        <Container
          flex={1}
          py="15px"
          display="flex"
          flexDirection="column"
        >
          <Box position="relative">
            <Stack
              as={Box}
              justifyContent="center"
            >
              <HStack alignItems="start">
                <Box flex={1}>
                  <HeroTitle />
                </Box>
                <Box>
                  <LanguagePicker />
                </Box>
              </HStack>

              <HeroTagline />
              <Box alignSelf="end">
                <QuestionCountIndicator />
              </Box>
            </Stack>
          </Box>

          <Center flex={1} flexDirection="column">
            {isConnecting ? <Spinner size="lg" /> : (
              <Stack pb="30px" alignItems="center">
                <Heading>
                  {t('landing.joinByCode')}
                </Heading>
                <HStack>
                  <PinInput type="alphanumeric" onComplete={handlePinInput} isDisabled={isConnecting}>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </Stack>
            )}
          </Center>

          <Button colorScheme="gray" size="lg" isDisabled={isConnecting} onClick={handleCreateButton}>
            {t('landing.createRoom')}
          </Button>

        </Container>
        {(import.meta.env.ENABLE_WARNING)
          && (
          <Alert status="warning">
            <AlertIcon />
            To już druga wersja ale prawdopodobieństwo ze sie popsuje jest takie samo
          </Alert>
          )}
      </Stack>
    </>
  );
}

const NameModal = ({
  isOpen, onClose, onSubmit, flow,
}: ReturnType<typeof useDisclosure> & {onSubmit: (v: string, d: string[]) => void, flow: FlowType}) => {
  const initialRef = React.useRef(null);
  const [input, setInput] = useState('');
  const {t, i18n} = useTranslation();
  const {value: selectedDecks, getCheckboxProps, setValue: setSelectedDecks} = useCheckboxGroup();
  const {data: decks} = useSWR<Deck[]>(`/decks?lang=${i18n.language}`, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    onSuccess: (d) => {
      setSelectedDecks(d.filter((deck) => (!deck.isExplicit)).map((deck) => deck.id));
    },
  });

  const handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => setInput(ev.currentTarget.value.trim());

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onClose();
    onSubmit(input, selectedDecks as string[]);
  };

  useEffect(() => {
    if (isOpen) {
      setInput('');
    }
  }, [isOpen]);

  return (
    <Modal onClose={onClose} size={{base: 'lg', md: 'xl'}} isOpen={isOpen} isCentered initialFocusRef={initialRef} closeOnOverlayClick={false}>
      <ModalOverlay backdropFilter="blur(20px)" bg="blackAlpha.400" />
      <ModalContent>
        <ModalHeader>{t('joinModal.header')}</ModalHeader>
        <FormControl as="form" onSubmit={handleSubmit}>

          <ModalBody>
            <Input
              ref={initialRef}
              placeholder={t('joinModal.inputPlaceholder')}
              onChange={handleInputChange}
            />
            <FormHelperText>{t('joinModal.helperText')}</FormHelperText>
            {flow === 'create' && (
              <Box mt={6}>
                {/* <Text mb={1}>
                  {t('joinModal.chooseDecks')}
                </Text> */}
                <Box>
                  <Wrap spacing={3}>
                    {
                      decks
                        ?.sort((a, b) => (+a.isExplicit - +b.isExplicit))
                        .map((d) => (
                          <WrapItem key={d.id}>
                            <DeckSelectCheckbox deck={d} {...getCheckboxProps({value: d.id})} />
                          </WrapItem>
                        ))
                    }
                  </Wrap>
                </Box>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              type="submit"
              disabled={input.length === 0 || input.length > 15 || selectedDecks.length === 0}
            >
              {t('joinModal.submit')}
            </Button>
          </ModalFooter>

        </FormControl>
      </ModalContent>
    </Modal>
  );
};
