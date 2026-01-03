export interface Customer {
    id: number;
    channels: CustomerChannel[];
    created_datetime: string;
    email: string;
    external_id: string | null;
    firstname: string;
    integrations: Record<string, any>;
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
    [key: string]: any;
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
export interface Ticket {
    id: number;
    uri: string;
    external_id: string | null;
    events: Event[];
    status: 'open' | 'closed' | 'snoozed' | 'trashed' | 'spam';
    channel: string;
    via: string;
    from_agent: boolean | null;
    spam: boolean;
    customer: Customer;
    assignee_user: User | null;
    language: string | null;
    subject: string | null;
    summary: TicketSummary | null;
    meta: any;
    tags: Tag[];
    custom_fields: Record<string, any> | null;
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
    reply_options: any;
    is_unread: boolean;
}
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
    meta: any;
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
    meta?: any;
    custom_fields?: Record<string, any>;
}
export interface TicketUpdateRequest {
    subject?: string;
    external_id?: string;
    assignee_user?: number;
    meta?: any;
    custom_fields?: Record<string, any>;
    status?: 'open' | 'closed' | 'snoozed' | 'trashed' | 'spam';
}
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
    sender: {
        id: number;
    } | null;
    auth_customer_identity: any | null;
    integration_id: number | null;
    intents: any[];
    rule_id: number | null;
    from_agent: boolean;
    receiver: {
        id: number;
    } | null;
    subject: string | null;
    body_text: string | null;
    body_html: string | null;
    stripped_text: string | null;
    stripped_html: string | null;
    stripped_signature: string | null;
    attachments: any[] | null;
    macros: any[] | null;
    actions: any[] | null;
    headers: any | null;
    meta: any;
    created_datetime: string;
    deleted_datetime: string | null;
    sent_datetime: string | null;
    failed_datetime: string | null;
    opened_datetime: string | null;
    last_sending_error: any | null;
    is_retriable: boolean;
    replied_by: any | null;
    replied_to: any | null;
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
export interface TicketMessageCreateRequest {
    body_text?: string;
    body_html?: string;
    from_agent?: boolean;
    attachments?: any[];
    headers?: any;
    meta?: any;
    external_id?: string;
    channel?: string;
    via?: string;
    subject?: string;
    public?: boolean;
    sender?: {
        id: number;
    };
    receiver?: {
        id: number;
    };
}
export interface TicketMessageUpdateRequest {
    body_text?: string;
    body_html?: string;
    attachments?: any[];
    headers?: any;
    meta?: any;
}
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
    meta: any;
    name: string;
    role: {
        name: string;
    };
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
    meta?: any;
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
    meta?: any;
    active?: boolean;
}
export interface Integration {
    id: number;
    created_datetime: string;
    deactivated_datetime: string | null;
    description: string | null;
    http: any | null;
    name: string;
    type: string;
    updated_datetime: string;
    user: any;
    uri: string;
    application_id: string | null;
    managed: boolean;
    business_hours_id: number | null;
}
export interface Event {
    id: number;
    context: string;
    created_datetime: string;
    data: any;
    object_id: number;
    object_type: string;
    type: string;
    user_id: number | null;
    uri: string;
}
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
export interface GorgiasError {
    message: string;
    status: number;
    response?: any;
}
export interface AxiosConfig {
    timeout?: number;
    headers?: Record<string, string>;
    [key: string]: any;
}
