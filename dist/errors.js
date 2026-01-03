"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GorgiasAPIError = void 0;
exports.isAxiosError = isAxiosError;
exports.handleAxiosError = handleAxiosError;
class GorgiasAPIError extends Error {
    constructor(message, status, response) {
        super(message);
        this.name = 'GorgiasAPIError';
        this.status = status;
        this.response = response;
    }
}
exports.GorgiasAPIError = GorgiasAPIError;
function isAxiosError(error) {
    return error.isAxiosError === true;
}
function handleAxiosError(error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Unknown error';
    const response = error.response?.data;
    return new GorgiasAPIError(message, status, response);
}
