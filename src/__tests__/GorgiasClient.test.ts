import { GorgiasClient } from '../index.ts';

describe('GorgiasClient', () => {
  let client: GorgiasClient;

  beforeEach(() => {
    client = new GorgiasClient('test', 'test@example.com', 'test-key');
  });

  it('should initialize correctly', () => {
    expect(client.customers).toBeDefined();
    expect(client.tickets).toBeDefined();
    expect(client.messages).toBeDefined();
    expect(client.users).toBeDefined();
    expect(client.integrations).toBeDefined();
    expect(client.events).toBeDefined();
  });

  it('should accept empty subdomain', () => {
    const client = new GorgiasClient('', 'test@example.com', 'test-key');
    expect(client.customers).toBeDefined();
  });

  it('should allow custom axios config', () => {
    const customClient = new GorgiasClient('test', 'test@example.com', 'test-key', {
      timeout: 5000,
      headers: { 'X-Custom': 'value' }
    });
    expect(customClient).toBeDefined();
  });
});