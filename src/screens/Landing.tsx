import {
  Box, Container, Heading, Stack, Text, Mark, HStack, PinInput, PinInputField, Button, useDisclosure, Modal, ModalBody,
  Center, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, Input, FormHelperText, Spinner,
  Alert, AlertIcon, Badge,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import styles from '../styles/fixes.module.scss';
import {useRoomStore} from '../lib/room';
import {HeroTagline, HeroTitle} from '../components/Heros';
import QuestionCountIndicator from '../components/QuestionCountIndicator';

export default function Landing() {
  const [isConnecting, setConnecting] = useState(false);
  const [flow, setFlow] = useState<'join' | 'create'>();
  const [pin, setPin] = useState('');
  const joinRoomById = useRoomStore((s) => s.joinRoomById);
  const createRoom = useRoomStore((s) => s.createRoom);
  const modalDisclosure = useDisclosure();

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
        <Container flex={1} py="15px" display="flex" flexDirection="column">
          <Box position="relative">
            <Stack
              as={Box}
              justifyContent="center"
            >
              <HeroTitle />
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
                  JOIN BY CODE
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
            CREATE ROOM
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

  const handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => setInput(ev.currentTarget.value.trim());

  const handleSubmit = () => {
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
        <ModalHeader>First, introduce yourself! 🙈</ModalHeader>
        <ModalBody>
          <FormControl>
            {/* <FormLabel>Tell them your name...</FormLabel> */}
            <Input ref={initialRef} placeholder="Your name" onChange={handleInputChange} />
            <FormHelperText>Best enter something that clearly points to you.</FormHelperText>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" onClick={handleSubmit} disabled={input.length === 0 || input.length > 15}>Done!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
