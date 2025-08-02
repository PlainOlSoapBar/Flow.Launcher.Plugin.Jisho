import open from 'open';
import axios from 'axios';
import { Flow, JSONRPCResponse } from 'flow-launcher-helper';
import { api } from './api.js';
import type { GetPackagesResponse } from './types.js';

type Methods = 'open_result';

const { params, showResult, on, run } = new Flow<Methods>('assets/favicon.png');

function fetchTerm(word: string, reading: string) {
  // Word and reading can be undefined if the word has no Kanji and the reading is the same as the word
  if (word && reading) {
    return `${word} | ${reading}`;
  } else if (word) {
    return `${word}`;
  }
  return `${reading}`;
}

function fetchDefinition(definitions: any) {
    // Multiple definitions is stored as a string array, but single definitions are stored as a string
    if (Array.isArray(definitions)) {
        return definitions.join(', ');
    }
    return definitions;
}

on('query', async () => {
  if (params.length < 1) {
    return showResult({
      title: 'English, Japanese, Romaji, words or text',
    });
  }

  try {
    const { data }: GetPackagesResponse = await api.get('/words', {
      params: {
        keyword: params,
      },
    });

    const results: JSONRPCResponse<Methods>[] = [];

    data.data.forEach(({ japanese: [japaneseResult], senses: [senseResult] }) => {
    results.push({
      title: fetchTerm(japaneseResult.word, japaneseResult.reading),
      subtitle: fetchDefinition(senseResult.english_definitions),
      method: 'open_result',
      params: [`https://jisho.org/search/${japaneseResult.word || japaneseResult.reading}`],
      iconPath: 'assets/favicon.png',
    });
    });

    if (results.length == 0) {
      showResult({
        title: 'No results found.',
      });
    } else {
      showResult(...results);
    }
  } catch (err) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      return showResult({
        title: 'Error!',
        subtitle: err.message,
      });
    }
  }
});

on('open_result', () => {
  const url = params;
  open(url);
});

run();
