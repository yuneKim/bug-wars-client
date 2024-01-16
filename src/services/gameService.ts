import type { PlayGameDto } from '@/types';
import { makeRequest } from '@/utils/makeRequest';
import axios from 'axios';

export const gameService = {
  getMaps() {
    return makeRequest(() => axios.get('/game/maps'), {
      successStatuses: [200],
      errorStatuses: {},
    });
  },
  getReplay(playGameDto: PlayGameDto) {
    return makeRequest(() => axios.post('/game', playGameDto), {
      successStatuses: [200],
      errorStatuses: {
        400: 'Invalid inputs.',
      },
    });
  },
};
