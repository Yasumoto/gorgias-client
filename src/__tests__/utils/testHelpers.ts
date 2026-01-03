import { jest } from '@jest/globals';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create to return a mock instance
mockedAxios.create.mockReturnValue({
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  request: jest.fn(),
} as any);

describe('Axios Mock Setup', () => {
  it('should have axios.create mocked', () => {
    expect(mockedAxios.create).toHaveBeenCalled();
  });
});