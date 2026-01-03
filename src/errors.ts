import { AxiosError } from 'axios';
import { GorgiasError } from './types';

export class GorgiasAPIError extends Error implements GorgiasError {
  status: number;
  response?: any;

  constructor(message: string, status: number, response?: any) {
    super(message);
    this.name = 'GorgiasAPIError';
    this.status = status;
    this.response = response;
  }
}

export function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError === true;
}

export function handleAxiosError(error: AxiosError): GorgiasAPIError {
  const status = error.response?.status || 500;
  const message = (error.response?.data as any)?.error || error.message || 'Unknown error';
  const response = error.response?.data;

  return new GorgiasAPIError(message, status, response);
}