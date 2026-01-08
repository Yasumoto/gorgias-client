import { AxiosError } from 'axios';
import { GorgiasError } from './types.js';
export declare class GorgiasAPIError extends Error implements GorgiasError {
    status: number;
    response?: any;
    constructor(message: string, status: number, response?: any);
}
export declare function isAxiosError(error: any): error is AxiosError;
export declare function handleAxiosError(error: AxiosError): GorgiasAPIError;
