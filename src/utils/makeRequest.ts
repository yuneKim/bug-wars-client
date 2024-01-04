import type { AxiosResponse } from 'axios';
import axios from 'axios';

export type SuccessResponse = {
  type: 'success';
  status: number;
  data: any;
};

export type ErrorResponse = {
  type: 'error';
  status: number;
  error: string;
};

export type RequestResponse = SuccessResponse | ErrorResponse;

export type RequestCallback = () => Promise<AxiosResponse<any, any>>;

export type ErrorCallback = (response: AxiosResponse<any, any>) => string;

export type RequestOptions = {
  successStatuses: number[];
  errorStatuses: Record<number, ErrorCallback | string>;
};

export async function makeRequest(
  request: RequestCallback,
  options: RequestOptions,
): Promise<RequestResponse> {
  try {
    const response = await request();
    if (options.successStatuses.includes(response.status)) {
      return Promise.resolve({
        type: 'success',
        status: response.status,
        data: response.data,
      });
    } else {
      console.error('Request was successful but response status was unexpected:', response.status);
      return Promise.resolve({
        type: 'error',
        status: response.status,
        error: 'Something went wrong on our end. Try again later.',
      });
    }
  } catch (error) {
    if (!(error instanceof Error)) {
      return Promise.resolve({
        type: 'error',
        status: 0,
        error: error != null ? error.toString() : 'Unknown error',
      });
    }

    if (!axios.isAxiosError(error)) {
      return Promise.resolve({
        type: 'error',
        status: 0,
        error: error.toString(),
      });
    }

    for (const [status, errorCallback] of Object.entries(options.errorStatuses)) {
      if (error.response?.status === Number(status)) {
        const errorMessage =
          typeof errorCallback === 'string' ? errorCallback : errorCallback(error.response);

        return Promise.resolve({
          type: 'error',
          status: error.response.status,
          error: errorMessage,
        });
      }
    }

    return Promise.resolve({
      type: 'error',
      status: error.response?.status ?? 0,
      error: 'Something went wrong on our end. Try again later.',
    });
  }
}
