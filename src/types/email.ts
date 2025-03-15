export interface EmailTemplate {
  id: number; // Change from string to number
  name: string;
  subject: string;
  content: string;
  createdAt?: string;
  variables?: Record<string, string>;
}

export interface EmailRecipient {
  email: string;
  variables: Record<string, string>;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

export interface QueueItem {
  id: string;
  templateId: string;
  status: string;
  recipients: Array<{
    email: string;
    status: string;
    error?: string;
  }>;
  createdAt: string;
  sentAt?: string;
}

export interface HistoryItem {
  id: string;
  templateName: string;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  createdAt: string;
}

export interface QueueResponse {
  items: QueueItem[];
  total: number;
}

export interface TemplateVariables {
  name?: string;
  event?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  college?: string;
  teamSize?: number;
  paymentStatus?: string;
  registrationId?: string;
  allParticipants?: string;
  reason?: string;
}

export interface EmailTemplateUpdate {
  id: number; // Change from string to number
  name: string;
  subject: string;
  content: string;
  variables?: Record<string, string>;
}

export interface EmailTemplateResponse {
  success: boolean;
  message: string;
  template: EmailTemplate;
}
