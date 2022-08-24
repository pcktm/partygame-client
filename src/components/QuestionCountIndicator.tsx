import {
  Box, useToast, Text, Badge,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';

export default function QuestionCountIndicator() {
  const [count, setCount] = useState<number>(0);
  const toast = useToast();

  useEffect(() => {
    fetch(import.meta.env.VITE_COLYSEUS_SERVER_URL)
      .then(async (r) => {
        const body = await r.json();
        setCount(body.questionCount ?? 0);
      })
      .catch((r) => {
        setCount(-1);
        if (toast.isActive('colyseus-api-down')) return;
        toast({
          id: 'colyseus-api-down',
          title: 'Couldn\'t reach server',
          description: 'Something went wrong. You could try refreshing the page.',
          status: 'error',
          isClosable: false,
          duration: 9000,
          position: 'top-right',
        });
      });
  }, [toast]);

  return (
    <Box>
      {
        count && (
        <Badge variant="subtle" colorScheme={count > 0 ? 'green' : 'red'} fontWeight={500}>
          {count > 0 ? `${count} questions` : 'Not connected'}
        </Badge>
        )
      }
    </Box>
  );
}
