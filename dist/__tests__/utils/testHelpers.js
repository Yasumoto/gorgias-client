"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const axios_1 = __importDefault(require("axios"));
globals_1.jest.mock('axios');
const mockedAxios = axios_1.default;
// Mock axios.create to return a mock instance
mockedAxios.create.mockReturnValue({
    interceptors: {
        response: {
            use: globals_1.jest.fn(),
        },
    },
    get: globals_1.jest.fn(),
    post: globals_1.jest.fn(),
    put: globals_1.jest.fn(),
    delete: globals_1.jest.fn(),
    request: globals_1.jest.fn(),
});
describe('Axios Mock Setup', () => {
    it('should have axios.create mocked', () => {
        expect(mockedAxios.create).toHaveBeenCalled();
    });
});
