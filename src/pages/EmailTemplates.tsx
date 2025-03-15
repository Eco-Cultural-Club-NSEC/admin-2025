import React from "react";
import { Editor } from "@monaco-editor/react";
import { Save, Info } from "lucide-react";
import { toast } from "sonner";
import { emailService } from "../services/email.service";
import { MorbitroneFontBase64 } from "../utils/fonts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EmailTemplate,
  EmailTemplateUpdate,
  EmailTemplateResponse,
} from "../types/email";
import { AlertDialog } from "../components/AlertDialog";

export function EmailTemplates() {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<EmailTemplate | null>(null);
  const [editedContent, setEditedContent] = React.useState("");
  const [showTutorial, setShowTutorial] = React.useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingSave, setPendingSave] = React.useState(false);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: async () => {
      const response = await emailService.getTemplates();
      return response?.templates || [];
    },
    onSuccess: (templates) => {
      if (templates.length > 0 && !selectedTemplate) {
        setSelectedTemplate(templates[0]);
        setEditedContent(templates[0].content);
      }
    },
  });

  const updateTemplateMutation = useMutation<
    EmailTemplateResponse,
    Error,
    EmailTemplateUpdate
  >({
    mutationFn: emailService.updateTemplate,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["emailTemplates"]);
      toast.success("Template saved successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save template");
    },
  });

  const [previewData] = React.useState({
    name: "John Doe",
    event: "Tech Conference 2024",
    eventDate: "March 15, 2024",
    eventLocation: "San Francisco, CA",
  });

  React.useEffect(() => {
    if (selectedTemplate) {
      setEditedContent(selectedTemplate.content);
    }
  }, [selectedTemplate]);

  const handleTemplateChange = (newContent: string | undefined) => {
    if (!newContent) return;
    setEditedContent(newContent);
  };

  const handleSave = async () => {
    if (!selectedTemplate || !editedContent) {
      toast.error("Template content cannot be empty");
      return;
    }

    const templateUpdate: EmailTemplateUpdate = {
      id: selectedTemplate.id,
      content: editedContent,
      subject: selectedTemplate.subject,
      name: selectedTemplate.name,
      variables: selectedTemplate.variables,
    };

    try {
      await updateTemplateMutation.mutateAsync(templateUpdate);
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  const handleSaveClick = () => {
    if (selectedTemplate.id) {
      setShowConfirmDialog(true);
    } else {
      handleSave();
    }
  };

  const handleConfirmSave = () => {
    setShowConfirmDialog(false);
    handleSave();
  };

  const preview = React.useMemo(() => {
    let content = editedContent;
    // Replace template variables with preview data
    Object.entries(previewData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    // Add preview wrapper with base64 font
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_blank">
          <style>
            @font-face {
              font-family: 'Morbitrone';
              src: url(data:application/x-font-woff;charset=utf-8;base64,${MorbitroneFontBase64}) format('woff');
              font-weight: normal;
              font-style: normal;
            }
            /* Ensure the font is applied */
            .heading {
              font-family: 'Morbitrone', sans-serif !important;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
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
            value={selectedTemplate?.id || ""}
            onChange={(e) => {
              const found = templates.find(
                (t) => t.id === Number(e.target.value)
              );
              if (found) {
                setSelectedTemplate(found);
                setEditedContent(found.content);
              }
            }}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSaveClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Template
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
                  lineNumbers: "on",
                  folding: true,
                  formatOnPaste: true,
                  formatOnType: true,
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
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      </div>
      {showTutorial && (
        <div className="mb-8 mt-5 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  Available Template Variables
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-2">
                  <p>Use these variables in your template:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <code>{"{{name}}"}</code> - Participant's name
                    </li>
                    <li>
                      <code>{"{{event}}"}</code> - Event name
                    </li>
                    <li>
                      <code>{"{{eventDate}}"}</code> - Event date
                    </li>
                    <li>
                      <code>{"{{eventTime}}"}</code> - Event time
                    </li>
                    <li>
                      <code>{"{{eventLocation}}"}</code> - Event location
                    </li>
                    <li>
                      <code>{"{{college}}"}</code> - Participant's college
                    </li>
                    <li>
                      <code>{"{{teamSize}}"}</code> - Team size
                    </li>
                    <li>
                      <code>{"{{paymentStatus}}"}</code> - Payment status
                    </li>
                    <li>
                      <code>{"{{registrationId}}"}</code> - Registration ID
                    </li>
                    <li>
                      <code>{"{{allParticipants}}"}</code> - All team members
                    </li>
                    <li>
                      <code>{"{{reason}}"}</code> - Rejection reason (for
                      rejection template)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="text-blue-500 hover:text-blue-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <AlertDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSave}
        title="Replace Existing Template?"
        message="This will replace the existing email template. Are you sure you want to continue?"
      />
    </div>
  );
}
