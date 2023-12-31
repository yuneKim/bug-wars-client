import type { ParseDto } from '@/types';
import axios from 'axios';

export const scriptService = {
  parse(parseDto: ParseDto) {
    return axios.post('/parse', parseDto);
  },
};
