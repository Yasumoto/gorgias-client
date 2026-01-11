/**
 * Type definitions for the Gorgias API.
 */

// ============================================================================
// Customer Types
// ============================================================================

export interface Customer {
  id: number;
  channels: CustomerChannel[];
  created_datetime: string;
  email: string;
  external_id: string | null;
  firstname: string;
  integrations: Record<string, unknown>;
  language: string | null;
  lastname: string;
  name: string | null;
  note: string | null;
  timezone: string | null;
  updated_datetime: string;
}

export interface CustomerChannel {
  type: string;
  address: string;
  [key: string]: unknown;
}

export interface CustomerCreateRequest {
  email: string;
  firstname?: string;
  lastname?: string;
  external_id?: string;
  note?: string;
  language?: string;
  timezone?: string;
  channels?: CustomerChannel[];
}

export interface CustomerUpdateRequest {
  email?: string;
  firstname?: string;
  lastname?: string;
  external_id?: string;
  note?: string;
  language?: string;
  timezone?: string;
  channels?: CustomerChannel[];
}

// ============================================================================
// Ticket Types
// ============================================================================

export interface Ticket {
  id: number;
  uri: string;
  external_id: string | null;
  events: Event[];
  status: TicketStatus;
  channel: string;
  via: string;
  from_agent: boolean | null;
  spam: boolean;
  customer: Customer;
  assignee_user: User | null;
  language: string | null;
  subject: string | null;
  summary: TicketSummary | null;
  meta: Record<string, unknown>;
  tags: Tag[];
  custom_fields: Record<string, unknown> | null;
  messages: TicketMessage[];
  created_datetime: string;
  opened_datetime: string | null;
  last_received_message_datetime: string | null;
  last_message_datetime: string | null;
  updated_datetime: string | null;
  closed_datetime: string | null;
  trashed_datetime: string | null;
  snooze_datetime: string | null;
  satisfaction_survey: SatisfactionSurvey | null;
  reply_options: Record<string, unknown> | null;
  is_unread: boolean;
}

export type TicketStatus = 'open' | 'closed' | 'snoozed' | 'trashed' | 'spam';

export interface TicketSummary {
  content: string;
  created_datetime: string;
  triggered_by: number;
  updated_datetime: string;
}

export interface Tag {
  decoration?: {
    color: string;
  };
  name: string;
}

export interface SatisfactionSurvey {
  body_text: string;
  created_datetime: string;
  customer_id: number;
  id: number;
  meta: Record<string, unknown>;
  score: number;
  scored_datetime: string;
  sent_datetime: string;
  should_send_datetime: string;
  ticket_id: number;
}

export interface TicketCreateRequest {
  channel?: string;
  customer: {
    email?: string;
    id?: number;
  };
  messages?: TicketMessageCreateRequest[];
  subject?: string;
  external_id?: string;
  tags?: string[];
  assignee_user?: number;
  meta?: Record<string, unknown>;
  custom_fields?: Record<string, unknown>;
}

export interface TicketUpdateRequest {
  subject?: string;
  external_id?: string;
  assignee_user?: number;
  meta?: Record<string, unknown>;
  custom_fields?: Record<string, unknown>;
  status?: TicketStatus;
}

// ============================================================================
// Message Types
// ============================================================================

export interface TicketMessage {
  id: number;
  uri: string;
  message_id: string | null;
  ticket_id: number;
  external_id: string | null;
  public: boolean;
  channel: string;
  via: string;
  source: TicketMessageSource | null;
  sender: { id: number } | null;
  auth_customer_identity: Record<string, unknown> | null;
  integration_id: number | null;
  intents: MessageIntent[];
  rule_id: number | null;
  from_agent: boolean;
  receiver: { id: number } | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  stripped_text: string | null;
  stripped_html: string | null;
  stripped_signature: string | null;
  attachments: Attachment[] | null;
  macros: MacroAction[] | null;
  actions: MessageAction[] | null;
  headers: Record<string, string> | null;
  meta: Record<string, unknown>;
  created_datetime: string;
  deleted_datetime: string | null;
  sent_datetime: string | null;
  failed_datetime: string | null;
  opened_datetime: string | null;
  last_sending_error: SendingError | null;
  is_retriable: boolean;
  replied_by: number | null;
  replied_to: number | null;
}

export interface TicketMessageSource {
  from: {
    address: string;
    id?: number;
    name: string;
  };
  to: Array<{
    address: string;
    id?: number;
    name: string;
  }>;
  type: string;
}

export interface MessageIntent {
  name: string;
  confidence: number;
}

export interface Attachment {
  url: string;
  name: string;
  content_type: string;
  size: number;
}

export interface MacroAction {
  id: number;
  name: string;
}

export interface MessageAction {
  type: string;
  data: Record<string, unknown>;
}

export interface SendingError {
  code: string;
  message: string;
}

export interface TicketMessageCreateRequest {
  body_text?: string;
  body_html?: string;
  from_agent?: boolean;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  meta?: Record<string, unknown>;
  external_id?: string;
  channel?: string;
  via?: string;
  subject?: string;
  public?: boolean;
  sender?: { id: number };
  receiver?: { id: number };
}

export interface TicketMessageUpdateRequest {
  body_text?: string;
  body_html?: string;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  meta?: Record<string, unknown>;
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: number;
  active: boolean;
  bio: string;
  created_datetime: string;
  country: string;
  deactivated_datetime: string | null;
  email: string;
  external_id: string | null;
  firstname: string;
  lastname: string;
  language: string;
  meta: Record<string, unknown>;
  name: string;
  role: { name: string };
  timezone: string;
  updated_datetime: string;
  client_id: string | null;
}

export interface UserCreateRequest {
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  bio?: string;
  country?: string;
  language?: string;
  timezone?: string;
  external_id?: string;
  meta?: Record<string, unknown>;
}

export interface UserUpdateRequest {
  email?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  bio?: string;
  country?: string;
  language?: string;
  timezone?: string;
  external_id?: string;
  meta?: Record<string, unknown>;
  active?: boolean;
}

// ============================================================================
// Integration Types
// ============================================================================

export interface Integration {
  id: number;
  created_datetime: string;
  deactivated_datetime: string | null;
  description: string | null;
  http: IntegrationHttp | null;
  name: string;
  type: string;
  updated_datetime: string;
  user: IntegrationUser | null;
  uri: string;
  application_id: string | null;
  managed: boolean;
  business_hours_id: number | null;
}

export interface IntegrationHttp {
  url: string;
  headers?: Record<string, string>;
}

export interface IntegrationUser {
  id: number;
  email: string;
  name: string;
}

// ============================================================================
// Event Types
// ============================================================================

export interface Event {
  id: number;
  context: string;
  created_datetime: string;
  data: Record<string, unknown>;
  object_id: number;
  object_type: string;
  type: string;
  user_id: number | null;
  uri: string;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  object: 'list';
  uri: string;
  meta: {
    prev_cursor?: string;
    next_cursor?: string;
  };
}

export interface PaginationParams {
  limit?: number;
  cursor?: string;
  order_by?: string;
}
