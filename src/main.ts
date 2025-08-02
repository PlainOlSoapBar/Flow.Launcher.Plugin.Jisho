import open from 'open';
import axios from 'axios';
import { Flow, JSONRPCResponse } from 'flow-launcher-helper';
import { api } from './api.js';
import type { GetPackagesResponse } from './types.js';

type Methods = 'open_result';

const { params, showResult, on, run } = new Flow<Methods>('assets/favicon.png');

on('query', async () => {
    if (params.length < 1) {
        return showResult({
           title: 'English, Japanese, Romaji, words or text' 
        });
    }

    try {
        const { data }: GetPackagesResponse = await api.get('/words', {
          params: {
            keyword: params,
          },
        });

        const results: JSONRPCResponse<Methods>[] = [];

    data.data.forEach(({ japanese: [result] }) => {
      results.push({
        title: result.word,
        subtitle: result.reading,
        method: 'open_result',
        iconPath: 'assets/favicon.png',
      });
    });

    showResult(...results);
  } catch (err) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      return showResult({
        title: 'Error',
        subtitle: err.message,
      });
    }
  }
});

on('open_result', () => {
  const url = `https://jisho.org/search/${params}`;
  open(url);
});

run();