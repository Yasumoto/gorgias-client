# Gorgias Client

A modern, well-typed TypeScript client library for the Gorgias REST API.

## Features

- Zero runtime dependencies (uses native `fetch`)
- Built-in retry with exponential backoff
- TypeScript-first with comprehensive type definitions
- Auto-pagination with async iterators
- Request cancellation via AbortSignal
- Structured logging support

## Installation

```bash
npm install gorgias-client
```

**Requirements:** Node.js 18+

## Quick Start

```typescript
import { GorgiasClient } from 'gorgias-client';

// Initialize the client
const client = new GorgiasClient({
  subdomain: 'your-subdomain',  // e.g., 'mycompany'
  email: 'your-email@gorgias.com',
  apiKey: 'your-api-key',
});

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

## Configuration

```typescript
import { GorgiasClient } from 'gorgias-client';

const client = new GorgiasClient({
  subdomain: 'mycompany',
  email: 'user@example.com',
  apiKey: 'your-api-key',

  // Optional configuration
  timeoutMs: 30000,           // Request timeout (default: 30000)
  retry: {
    maxAttempts: 3,           // Max retry attempts (default: 3)
    baseDelayMs: 1000,        // Base delay for backoff (default: 1000)
    maxDelayMs: 30000,        // Max delay cap (default: 30000)
  },
  logger: console,            // Logger for debugging (optional)
  traceIdHeader: 'x-trace-id', // Header for trace ID propagation
});
```

## API Reference

### Customers

```typescript
// List customers
const customers = await client.customers.list({ limit: 100, cursor: 'next_cursor' });

// Auto-paginate through all customers
for await (const customer of client.customers.listAll()) {
  console.log(customer.id, customer.email);
}

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

// Delete multiple customers
await client.customers.deleteMany([123, 456, 789]);
```

### Tickets

```typescript
// List tickets
const tickets = await client.tickets.list({ status: 'open', limit: 50 });

// Auto-paginate through all tickets
for await (const ticket of client.tickets.listAll({ status: 'open' })) {
  console.log(ticket.id, ticket.subject);
}

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
await client.tickets.removeTags(456, ['bug']);
await client.tickets.setTags(456, ['resolved']);  // Replaces all tags
const tags = await client.tickets.listTags(456);
```

### Messages

```typescript
// List messages for a ticket
const messages = await client.messages.listForTicket(456);

// Auto-paginate through all messages for a ticket
for await (const message of client.messages.listAllForTicket(456)) {
  console.log(message.body_text);
}

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

### Manual Pagination

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

To manually paginate:

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

### Auto-Pagination

Use `listAll()` methods to automatically iterate through all pages:

```typescript
// Async iterator - memory efficient for large datasets
for await (const customer of client.customers.listAll()) {
  console.log(customer.id);
}

// Or collect all items (use with caution for large datasets)
import { collectAll } from 'gorgias-client';

const allCustomers = await collectAll(
  (cursor, limit) => client.customers.list({ cursor, limit })
);
```

## Error Handling

The client provides typed error classes:

```typescript
import {
  GorgiasAPIError,
  RateLimitError,
  NotFoundError,
  AuthenticationError,
  ValidationError,
  NetworkError,
  TimeoutError
} from 'gorgias-client';

try {
  const customer = await client.customers.get(123);
} catch (error) {
  if (error instanceof RateLimitError) {
    // Rate limited - retry after delay
    console.log(`Rate limited. Retry after ${error.retryAfterMs}ms`);
  } else if (error instanceof NotFoundError) {
    console.log('Customer not found');
  } else if (error instanceof AuthenticationError) {
    console.log('Invalid credentials');
  } else if (error instanceof ValidationError) {
    // Client-side validation failed
    console.log(`Invalid ${error.field}: ${error.message}`);
  } else if (error instanceof GorgiasAPIError) {
    // Other API errors
    console.log(`API Error ${error.status}: ${error.message}`);
    console.log('Request:', error.requestContext.method, error.requestContext.path);
  } else if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
  } else if (error instanceof TimeoutError) {
    console.log(`Request timed out after ${error.timeoutMs}ms`);
  }
}
```

## Rate Limiting

The client has built-in retry with exponential backoff that automatically handles rate limits (HTTP 429):

```typescript
// Default: 3 retries with exponential backoff
const client = new GorgiasClient({
  subdomain: 'mycompany',
  email: 'user@example.com',
  apiKey: 'your-api-key',
});

// Customize retry behavior
const client = new GorgiasClient({
  subdomain: 'mycompany',
  email: 'user@example.com',
  apiKey: 'your-api-key',
  retry: {
    maxAttempts: 5,
    baseDelayMs: 2000,
    maxDelayMs: 60000,
  },
});

// Disable retries for a specific request
const customer = await client.customers.get(123, { retry: false });
```

## Request Options

All resource methods accept an optional `options` parameter:

```typescript
// Custom timeout
const customer = await client.customers.get(123, {
  timeoutMs: 5000
});

// Request cancellation
const controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

const customers = await client.customers.list({}, {
  signal: controller.signal
});

// Trace ID for request correlation
const ticket = await client.tickets.get(456, {
  traceId: 'req-12345'
});
```

## TypeScript Support

This library is fully typed. All API responses and request parameters are strongly typed:

```typescript
import type { Customer, Ticket, TicketCreateRequest } from 'gorgias-client';

// TypeScript will provide autocomplete and type checking
const customer: Customer = await client.customers.get(123);

const ticketData: TicketCreateRequest = {
  customer: { email: 'test@example.com' },
  subject: 'Help needed',
  // TypeScript will catch typos and missing required fields
};
```

## Migration from v1.x

### Constructor Change

```typescript
// v1.x (deprecated)
const client = new GorgiasClient('subdomain', 'email', 'apiKey');

// v2.x
const client = new GorgiasClient({
  subdomain: 'subdomain',
  email: 'email',
  apiKey: 'apiKey',
});
```

### Error Handling Changes

```typescript
// v1.x - error.response was untyped
catch (error) {
  console.log(error.response); // any
}

// v2.x - typed error properties
catch (error) {
  if (error instanceof GorgiasAPIError) {
    console.log(error.status);           // number
    console.log(error.errorCode);        // string | undefined
    console.log(error.requestContext);   // { method, path }
  }
}
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
