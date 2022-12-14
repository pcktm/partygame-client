import {
  Wrap, WrapItem, Tag, Avatar, TagLabel, Text,
} from '@chakra-ui/react';
import shallow from 'zustand/shallow';
import {useRoomStore} from '../lib/room';

export default function ReadyPlayersList() {
  const {state, revision} = useRoomStore((s) => ({revision: s.revision, state: s.state}), shallow);
  const arr = Array.from(state.players.values());
  return (
    <Wrap>

      {
        arr.map((p) => (
          <WrapItem key={p.id}>
            <Tag size="lg" colorScheme={p.isReady ? 'green' : 'gray'} borderRadius="full">
              <Text
                fontSize="xl"
                ml={-1}
                mr={2}
              >
                {p.emoji}
              </Text>
              <TagLabel mb={0.2}>{p.nickname}</TagLabel>
            </Tag>
          </WrapItem>
        ))
      }

    </Wrap>
  );
}
