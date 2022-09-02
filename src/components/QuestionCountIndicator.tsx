import {
  Box, useToast, Text, Badge,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

export default function QuestionCountIndicator() {
  const {t} = useTranslation();
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
          title: t('errors.apiDown.title'),
          description: t('errors.apiDown.description'),
          status: 'error',
          isClosable: false,
          duration: 9000,
          position: 'top-right',
        });
      });
  }, [toast, t]);

  return (
    <Box>
      {
        count && (
        <Badge variant="subtle" colorScheme={count > 0 ? 'green' : 'red'} fontWeight={500}>
          {count > 0 ? t('questionCount.question', {count}) : t('errors.notConnected')}
        </Badge>
        )
      }
    </Box>
  );
}
