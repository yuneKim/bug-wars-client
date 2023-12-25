import type { LoginDto as loginDto } from '@/types';
import axios from 'axios';

export default {
  login(loginDto: loginDto) {
    return axios.post('/auth/log', loginDto);
  },
};
