import { useStorage } from '@plasmohq/storage/hook';
import { useEffect, useState } from 'react';
import { callApi } from '~resources/utils';

function useLanguageModelOptions() {
  const [options, setOptions] = useState([]);

  const [languageModel, setLanguageModel] = useStorage('model', options[0] ?? process.env.PLASMO_PUBLIC_DEFAULT_MODEL);

  useEffect(() => {
    callApi(`${process.env.PLASMO_PUBLIC_API_URL}/models?filter=name`, null, 'application/json', 'GET')
      .then(data => {
        const names = data.map(lm => lm.name);
        setOptions(names)
      })
      .catch(error => {
        console.error('Error fetching LM names: ', error);
      });
  }, []);

  return [languageModel, setLanguageModel, options];
}

export default useLanguageModelOptions