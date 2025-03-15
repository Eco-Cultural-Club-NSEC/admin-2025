import api from "../api/client";
import {
  EmailTemplate,
  EmailRecipient,
  EmailResponse,
  QueueResponse,
  EmailTemplateResponse,
  EmailTemplateUpdate,
  HistoryItem,
} from "../types/email";

export const emailService = {
  async sendBulkEmail(
    templateId: string,
    recipients: EmailRecipient[]
  ): Promise<EmailResponse> {
    try {
      const response = await api.post<EmailResponse>("/email/send-bulk", {
        templateId,
        recipients,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to send bulk email"
      );
    }
  },

  async getTemplates(): Promise<{
    success: boolean;
    templates: EmailTemplate[];
  }> {
    try {
      const response = await api.get("/email/templates");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch email templates");
    }
  },

  async getEmailQueue(page = 1, limit = 10): Promise<QueueResponse> {
    try {
      const response = await api.get("/email/queue", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch email queue");
    }
  },

  async sendEmail(data: {
    templateId: string;
    to: string;
    variables: Record<string, string>;
  }) {
    try {
      const response = await api.post("/email/send", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to send email");
    }
  },

  async getEmailHistory() {
    try {
      const response = await api.get("/email/history");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch email history"
      );
    }
  },

  async updateTemplate(
    template: EmailTemplateUpdate
  ): Promise<EmailTemplateResponse> {
    try {
      const response = await api.put<EmailTemplateResponse>(
        `/email/templates/${template.id}`,
        {
          content: template.content,
          subject: template.subject,
          name: template.name,
          variables: template.variables || {},
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Template update error:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Failed to update template"
      );
    }
  },

  async getDefaultTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await api.get("/email/templates/defaults");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch default templates");
    }
  },
};
