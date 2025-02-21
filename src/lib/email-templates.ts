import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Handlebars from 'handlebars';

export interface EmailTemplate {
  id: 'approval' | 'rejection';
  name: string;
  subject: string;
  content: string;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'approval',
    name: 'Approval Template',
    subject: 'Your registration has been approved!',
    content: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .footer { text-align: center; padding: 20px; color: #6B7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Registration Approved!</h1>
    </div>
    <div class="content">
      <p>Dear {{name}},</p>
      <p>We're excited to inform you that your registration for {{event}} has been approved!</p>
      <p>Event Details:</p>
      <ul>
        <li>Event: {{event}}</li>
        <li>Date: {{eventDate}}</li>
        <li>Location: {{eventLocation}}</li>
      </ul>
      <p>We look forward to seeing you at the event!</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'rejection',
    name: 'Rejection Template',
    subject: 'Update on your registration',
    content: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .footer { text-align: center; padding: 20px; color: #6B7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Registration Status Update</h1>
    </div>
    <div class="content">
      <p>Dear {{name}},</p>
      <p>Thank you for your interest in {{event}}. After careful review, we regret to inform you that we are unable to approve your registration at this time.</p>
      <p>Reasons may include:</p>
      <ul>
        <li>Limited capacity</li>
        <li>Eligibility criteria not met</li>
        <li>Incomplete information</li>
      </ul>
      <p>We encourage you to apply for our future events.</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>`,
  },
];

interface EmailTemplateState {
  templates: EmailTemplate[];
  updateTemplate: (template: EmailTemplate) => void;
  previewEmail: (templateId: 'approval' | 'rejection', data: any) => string;
}

export const useEmailTemplates = create<EmailTemplateState>()(
  persist(
    (set, get) => ({
      templates: defaultTemplates,
      updateTemplate: (template) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === template.id ? template : t
          ),
        })),
      previewEmail: (templateId, data) => {
        const template = get().templates.find((t) => t.id === templateId);
        if (!template) return '';
        const compiledTemplate = Handlebars.compile(template.content);
        return compiledTemplate(data);
      },
    }),
    {
      name: 'email-templates-storage',
    }
  )
);