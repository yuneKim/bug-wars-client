import type { ParseDto } from '@/types';
import { makeRequest } from '@/utils/makeRequest';
import axios from 'axios';

export const scriptService = {
  parse(parseDto: ParseDto) {
    return makeRequest(() => axios.post('/parse', parseDto), {
      successStatuses: [200],
      errorStatuses: {
        422: (response) => response.data.message,
      },
    });
  },
  getAllScripts() {
    return makeRequest(() => axios.get('/scripts'), {
      successStatuses: [200],
      errorStatuses: {
        401: 'You must be logged in to view scripts.',
      },
    });
  },
  getScriptById(id: number) {
    return makeRequest(() => axios.get(`/scripts/${id}`), {
      successStatuses: [200],
      errorStatuses: {
        401: 'You must be logged in to view scripts.',
        403: 'You do not have permission to view this script.',
        404: 'Script not found.',
      },
    });
  },
};
