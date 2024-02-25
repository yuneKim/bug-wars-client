import type { ParseDto, ScriptDto } from '@/types';
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
  getAllNamesOfValidScripts() {
    return makeRequest(() => axios.get('/scripts/all'), {
      successStatuses: [200],
      errorStatuses: {},
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
  createScript(scriptDto: ScriptDto) {
    return makeRequest(() => axios.post('/scripts', scriptDto), {
      successStatuses: [201],
      errorStatuses: {
        400: 'Name/Script is invalid.',
        409: 'Name must be unique.',
      },
    });
  },
  updateScript(id: number, scriptDto: ScriptDto) {
    return makeRequest(() => axios.put(`/scripts/${id}`, scriptDto), {
      successStatuses: [200],
      errorStatuses: {
        401: 'You must be logged in to view scripts.',
        403: 'You do not have permission to view this script.',
        404: 'Script not found.',
      },
    });
  },
  deleteScriptById(id: number) {
    return makeRequest(() => axios.delete(`/scripts/${id}`), {
      successStatuses: [204],
      errorStatuses: {
        403: 'You do not have permission to delete this script.',
      },
    });
  },

};
