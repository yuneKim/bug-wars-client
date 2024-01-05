import { AxiosError, type AxiosResponse } from 'axios';
import { describe, expect, it } from 'vitest';
import { makeRequest } from './makeRequest';

describe('makeRequest', () => {
  it('should return a success response when request was successful', async () => {
    const mockResponse: AxiosResponse<any, any> = {
      data: 'data',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };
    const request = () => Promise.resolve(mockResponse);

    const response = await makeRequest(request, {
      successStatuses: [200],
      errorStatuses: {},
    });

    expect(response).toStrictEqual({
      type: 'success',
      status: 200,
      data: 'data',
    });
  });

  it('should return an error when request was successful but response status was unexpected', async () => {
    const mockResponse: AxiosResponse<any, any> = {
      data: 'data',
      status: 201,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };
    const request = () => Promise.resolve(mockResponse);

    const response = await makeRequest(request, {
      successStatuses: [200],
      errorStatuses: {},
    });

    expect(response).toStrictEqual({
      type: 'error',
      status: 201,
      error: 'Something went wrong on our end. Try again later.',
    });
  });

  it('should return an error when request was unsuccessful', async () => {
    const mockResponse: AxiosResponse<any, any> = {
      data: 'data',
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: {} as any,
    };

    const mockError = new AxiosError();
    mockError.response = mockResponse;
    const request = () => Promise.reject(mockError);

    const response = await makeRequest(request, {
      successStatuses: [200],
      errorStatuses: {
        401: 'Test Message',
      },
    });

    expect(response).toStrictEqual({
      type: 'error',
      status: 401,
      error: 'Test Message',
    });

    const response2 = await makeRequest(request, {
      successStatuses: [200],
      errorStatuses: {
        401: (response) => response.statusText,
      },
    });

    expect(response2).toStrictEqual({
      type: 'error',
      status: 401,
      error: 'Unauthorized',
    });
  });

  it('should handle an unexpected error', async () => {
    const request = () => Promise.reject('error');

    const response = await makeRequest(request, {
      successStatuses: [200],
      errorStatuses: {},
    });

    expect(response).toStrictEqual({
      type: 'error',
      status: 0,
      error: 'error',
    });

    const weirdRequest = () => Promise.reject(new Error('error'));

    const weirdResponse = await makeRequest(weirdRequest, {
      successStatuses: [200],
      errorStatuses: {},
    });

    expect(weirdResponse).toStrictEqual({ type: 'error', status: 0, error: 'Error: error' });

    const weirderRequest = () => Promise.reject(undefined);

    const weirderResponse = await makeRequest(weirderRequest, {
      successStatuses: [200],
      errorStatuses: {},
    });

    expect(weirderResponse).toStrictEqual({
      type: 'error',
      status: 0,
      error: 'Unknown error',
    });

    const mockError = new AxiosError();
    mockError.response = undefined;

    const weirdestRequest = () => Promise.reject(mockError);

    const weirdestResponse = await makeRequest(weirdestRequest, {
      successStatuses: [200],
      errorStatuses: {},
    });

    expect(weirdestResponse).toStrictEqual({
      type: 'error',
      status: 0,
      error: 'Something went wrong on our end. Try again later.',
    });
  });

  it('should handle reasonable unexpected errors', async () => {
    const mockError = new AxiosError();

    const mockResponse: AxiosResponse<any, any> = {
      data: 'data',
      status: 500,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    mockError.response = mockResponse;

    const request = () => Promise.reject(mockError);

    const response = await makeRequest(request, {
      successStatuses: [200],
      errorStatuses: {},
    });

    expect(response).toStrictEqual({
      type: 'error',
      status: 500,
      error: 'Something went wrong on our end. Try again later.',
    });
  });
});
