import {
  Box, Container, Heading, Stack, Text, Mark, HStack, PinInput, PinInputField, Button, useDisclosure, Modal, ModalBody,
  Center, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, Input, FormHelperText, Spinner,
  Alert, AlertIcon, Badge, VStack, Select,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import shallow from 'zustand/shallow';
import {useTranslation} from 'react-i18next';
import styles from '../styles/fixes.module.scss';
import {useRoomStore} from '../lib/room';
import {HeroTagline, HeroTitle} from '../components/Heros';
import QuestionCountIndicator from '../components/QuestionCountIndicator';
import LanguagePicker from '../components/LanguagePicker';

export default function Landing() {
  const [isConnecting, setConnecting] = useState(false);
  const [flow, setFlow] = useState<'join' | 'create'>();
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

  const handleModalSubmit = async (name: string) => {
    if (flow === 'create') {
      await createRoom(name);
    } else if (flow === 'join') {
      await joinRoomById(pin.trim().toLowerCase(), name);
    }
    setConnecting(false);
  };

  return (
    <>
      <NameModal {...modalDisclosure} onSubmit={handleModalSubmit} />
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

const NameModal = ({isOpen, onClose, onSubmit}: ReturnType<typeof useDisclosure> & {onSubmit: (v: string) => void}) => {
  const initialRef = React.useRef(null);
  const [input, setInput] = useState('');
  const {t} = useTranslation();

  const handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => setInput(ev.currentTarget.value.trim());

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onClose();
    onSubmit(input);
  };

  useEffect(() => {
    if (isOpen) {
      setInput('');
    }
  }, [isOpen]);

  return (
    <Modal onClose={onClose} size={{base: 'sm', md: 'lg'}} isOpen={isOpen} isCentered initialFocusRef={initialRef} closeOnOverlayClick={false}>
      <ModalOverlay backdropFilter="blur(20px)" bg="blackAlpha.400" />
      <ModalContent>
        <ModalHeader>{t('joinModal.header')}</ModalHeader>
        <FormControl as="form" onSubmit={handleSubmit}>

          <ModalBody>
            {/* <FormLabel>Tell them your name...</FormLabel> */}
            <Input
              ref={initialRef}
              placeholder={t('joinModal.inputPlaceholder')}
              onChange={handleInputChange}
            />
            <FormHelperText>{t('joinModal.helperText')}</FormHelperText>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              type="submit"
              disabled={input.length === 0 || input.length > 15}
            >
              {t('joinModal.submit')}
            </Button>
          </ModalFooter>

        </FormControl>
      </ModalContent>
    </Modal>
  );
};
