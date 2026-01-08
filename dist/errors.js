export class GorgiasAPIError extends Error {
    constructor(message, status, response) {
        super(message);
        this.name = 'GorgiasAPIError';
        this.status = status;
        this.response = response;
    }
}
export function isAxiosError(error) {
    return error.isAxiosError === true;
}
export function handleAxiosError(error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Unknown error';
    const response = error.response?.data;
    return new GorgiasAPIError(message, status, response);
}
