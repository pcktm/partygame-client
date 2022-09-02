import {Select} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import shallow from 'zustand/shallow';

const LanguagePicker = () => {
  const {t, i18n} = useTranslation();

  const handleChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(ev.currentTarget.value);
  };
  return (
    <Select value={i18n.language} mt={2} variant="unstyled" onChange={handleChange}>
      <option value="en">🇬🇧</option>
      <option value="pl">🇵🇱</option>
    </Select>
  );
};

export default LanguagePicker;
