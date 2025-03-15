import { create } from "zustand";
import { persist } from "zustand/middleware";
import Handlebars from "handlebars";

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  variables?: Record<string, string>;
}

interface EmailTemplateState {
  templates: EmailTemplate[];
  updateTemplate: (template: EmailTemplate) => void;
  previewEmail: (templateId: number, data: any) => string;
}

export const useEmailTemplates = create<EmailTemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      updateTemplate: (template) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === template.id ? template : t
          ),
        })),
      previewEmail: (templateId, data) => {
        const template = get().templates.find((t) => t.id === templateId);
        if (!template) return "";
        const compiledTemplate = Handlebars.compile(template.content);
        return compiledTemplate(data);
      },
    }),
    {
      name: "email-templates-storage",
    }
  )
);
