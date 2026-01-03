# Gorgias Client

A modern, well-typed TypeScript client library for the Gorgias REST API.

## Installation

```bash
npm install gorgias-client
```

## Quick Start

```typescript
import { GorgiasClient } from 'gorgias-client';

// Initialize the client
const client = new GorgiasClient(
  'your-subdomain', // e.g., 'mycompany'
  'your-email@gorgias.com',
  'your-api-key'
);

// List customers
const customers = await client.customers.list({ limit: 50 });
console.log(customers.data);

// Create a ticket
const ticket = await client.tickets.create({
  customer: { email: 'customer@example.com' },
  subject: 'New support request',
  messages: [{
    from_agent: false,
    body_text: 'I need help with my order',
    channel: 'email'
  }]
});

// Get ticket messages
const messages = await client.messages.listForTicket(ticket.id);
```

## API Reference

### Customers

```typescript
// List customers
const customers = await client.customers.list({ limit: 100, cursor: 'next_cursor' });

// Get a customer
const customer = await client.customers.get(123);

// Create a customer
const newCustomer = await client.customers.create({
  email: 'john@example.com',
  firstname: 'John',
  lastname: 'Doe'
});

// Update a customer
const updatedCustomer = await client.customers.update(123, {
  note: 'VIP customer'
});

// Delete a customer
await client.customers.delete(123);
```

### Tickets

```typescript
// List tickets
const tickets = await client.tickets.list({ status: 'open', limit: 50 });

// Get a ticket
const ticket = await client.tickets.get(456);

// Create a ticket
const newTicket = await client.tickets.create({
  customer: { email: 'customer@example.com' },
  subject: 'Support request',
  messages: [{
    from_agent: false,
    body_text: 'Please help me',
    channel: 'email'
  }]
});

// Update a ticket
const updatedTicket = await client.tickets.update(456, {
  status: 'closed'
});

// Manage tags
await client.tickets.addTags(456, ['urgent', 'bug']);
await client.tickets.setTags(456, ['resolved']);
```

### Messages

```typescript
// List messages for a ticket
const messages = await client.messages.listForTicket(456);

// List all messages
const allMessages = await client.messages.list({ limit: 100 });

// Get a message
const message = await client.messages.get(789);

// Create a message
const newMessage = await client.messages.create(456, {
  from_agent: true,
  body_text: 'Thank you for your patience',
  channel: 'email'
});

// Update a message
const updatedMessage = await client.messages.update(789, {
  body_text: 'Updated response'
});
```

### Users

```typescript
// List users
const users = await client.users.list();

// Get a user
const user = await client.users.get(123);

// Create a user
const newUser = await client.users.create({
  email: 'agent@gorgias.com',
  firstname: 'Jane',
  lastname: 'Smith',
  role: 'admin'
});

// Update a user
const updatedUser = await client.users.update(123, {
  bio: 'Senior support agent'
});
```

### Integrations

```typescript
// List integrations
const integrations = await client.integrations.list();

// Get an integration
const integration = await client.integrations.get(123);
```

### Events

```typescript
// List events
const events = await client.events.list({
  object_type: 'Ticket',
  limit: 50
});

// Get an event
const event = await client.events.get(456);
```

## Pagination

The API uses cursor-based pagination. All list methods return a `PaginatedResponse` object:

```typescript
interface PaginatedResponse<T> {
  data: T[];
  object: 'list';
  uri: string;
  meta: {
    prev_cursor?: string;
    next_cursor?: string;
  };
}
```

To get the next page:

```typescript
let response = await client.customers.list({ limit: 50 });

while (response.meta.next_cursor) {
  response = await client.customers.list({ 
    limit: 50, 
    cursor: response.meta.next_cursor 
  });
  
  // Process response.data
}
```

## Error Handling

The client throws `GorgiasAPIError` instances for API errors:

```typescript
import { GorgiasAPIError } from 'gorgias-client';

try {
  const customer = await client.customers.get(123);
} catch (error) {
  if (error instanceof GorgiasAPIError) {
    console.error(`API Error ${error.status}: ${error.message}`);
    console.error('Response:', error.response);
  } else {
    console.error('Network error:', error);
  }
}
```

## Rate Limiting

The Gorgias API has rate limits. The client respects HTTP 429 responses. You can implement retry logic:

```typescript
import { GorgiasAPIError } from 'gorgias-client';

async function apiCallWithRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof GorgiasAPIError && error.status === 429 && retries > 0) {
      const retryAfter = error.response?.headers?.['retry-after'] || 5;
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return apiCallWithRetry(fn, retries - 1);
    }
    throw error;
  }
}

// Usage
const customers = await apiCallWithRetry(() => 
  client.customers.list({ limit: 100 })
);
```

## TypeScript Support

This library is fully typed. All API responses and request parameters are strongly typed:

```typescript
import { Customer, Ticket, TicketCreateRequest } from 'gorgias-client';

// TypeScript will provide autocomplete and type checking
const customer: Customer = await client.customers.get(123);

const ticketData: TicketCreateRequest = {
  customer: { email: 'test@example.com' },
  subject: 'Help needed',
  // TypeScript will catch typos and missing required fields
};
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request