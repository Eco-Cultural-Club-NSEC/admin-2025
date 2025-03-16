import React, { useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface EmailTemplate {
  id: "approval" | "rejection";
  name: string;
  subject: string;
  content: string;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: "approval",
    name: "Approval Template",
    subject: "Your registration has been approved!",
    content: `<!DOCTYPE html>
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
    id: "rejection",
    name: "Rejection Template",
    subject: "Update on your registration",
    content: `<!DOCTYPE html>
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

export function EmailTemplates() {
  const [templates, setTemplates] =
    React.useState<EmailTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = React.useState<EmailTemplate>(
    templates[0]
  );
  const [editedContent, setEditedContent] = React.useState(
    selectedTemplate.content
  );
  const [previewData] = React.useState({
    name: "John Doe",
    event: "Tech Conference 2024",
    eventDate: "March 15, 2024",
    eventLocation: "San Francisco, CA",
  });

  const [loading, setLoading] = React.useState(false);

  const getTemplates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/v1/email-templates/get",
        {
          withCredentials: true,
        }
      );
      return response.data.templates;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // create template to the db if there are no templates
  const createTemplates = async () => {
    try {
      console.log("createTemplates");

      const promises = defaultTemplates.map((template) =>
        axios.post(
          "http://localhost:5001/api/v1/email-templates/create",
          {
            ...template,
          },
          {
            withCredentials: true,
          }
        )
      );

      const responses = await Promise.all(promises);
      const templates = responses.map((res) => res.data.template);
      toast.success("Templates created successfully");
      return templates;
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message ?? "Error creating template");
    }
  };

  useEffect(() => {
    getTemplates().then((data) => {
      if (data.length == defaultTemplates.length) {
        setTemplates(data);
        setSelectedTemplate(data[0]);
      } else {
        createTemplates().then((data) => {
          if (data) {
            setTemplates(data);
            setSelectedTemplate(data[0]);
          }
        });
      }
    });
    console.log("templates", templates);
  }, []);

  React.useEffect(() => {
    setEditedContent(selectedTemplate.content);
  }, [selectedTemplate]);

  const handleTemplateChange = (newContent: string | undefined) => {
    if (!newContent) return;
    setEditedContent(newContent);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/email-templates/update",
        {
          id: selectedTemplate.id,
          name: selectedTemplate.name,
          subject: selectedTemplate.subject,
          content: editedContent,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === selectedTemplate.id ? { ...t, content: editedContent } : t
          )
        );
        setSelectedTemplate((prev) => ({ ...prev, content: editedContent }));
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log("Error saving Template: ", error);
      toast.error(error?.response?.data?.message ?? "Error saving template");
    } finally {
      setLoading(false);
    }
  };

  const preview = React.useMemo(() => {
    let content = editedContent;
    Object.entries(previewData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    return content;
  }, [editedContent, previewData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Email Templates
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Customize email templates for participant notifications.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <select
            value={selectedTemplate.id}
            onChange={(e) => {
              const template = templates.find((t) => t.id === e.target.value);
              if (template) setSelectedTemplate(template);
            }}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full me-2"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Template Editor
            </h2>
            <div className="h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="html"
                value={editedContent}
                onChange={handleTemplateChange}
                theme={
                  document.documentElement.classList.contains("dark")
                    ? "vs-dark"
                    : "light"
                }
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Preview
            </h2>
            <div className="h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto bg-white">
              <iframe
                srcDoc={preview}
                title="Email Preview"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
