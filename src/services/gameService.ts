import type { PlayGameDto } from '@/types';
import { makeRequest } from '@/utils/makeRequest';
import axios from 'axios';

export const gameService = {
  getReplay(playGameDto: PlayGameDto) {
    return makeRequest(() => axios.post('/game', playGameDto), {
      successStatuses: [200],
      errorStatuses: {
        400: 'Invalid inputs.',
      },
    });
  },
};
