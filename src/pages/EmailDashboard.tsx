import React from "react";
import { useEmailTemplates } from "../lib/email-templates";
import { Editor } from "@monaco-editor/react";
import {
  Send,
  Upload,
  X,
  RotateCw,
  Clock,
  History,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { emailService } from "../services/email.service";
import { Table } from "../components/ui/table";
import type {
  EmailTemplate,
  EmailRecipient,
  QueueItem,
  HistoryItem,
} from "../types/email";
import { Pagination } from "../components/ui/pagination";

type Tab = "compose" | "queue" | "history" | "templates";

export function EmailDashboard() {
  const { templates, isLoading: isLoadingTemplates } = useEmailTemplates();
  const [activeTab, setActiveTab] = React.useState<Tab>("compose");
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<EmailTemplate | null>(templates[0] ?? null);
  const [recipients, setRecipients] = React.useState<EmailRecipient[]>([]);
  const [csvFile, setCsvFile] = React.useState<File | null>(null);
  const [queue, setQueue] = React.useState<QueueItem[]>([]);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [testEmail, setTestEmail] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  React.useEffect(() => {
    fetchQueueAndHistory();
  }, []);

  const fetchQueueAndHistory = async () => {
    try {
      const [queueData, historyData] = await Promise.all([
        emailService.getEmailQueue(),
        emailService.getTemplates(),
      ]);
      setQueue(queueData.items);
      setHistory(historyData);
    } catch (error) {
      toast.error("Failed to fetch email data");
    }
  };

  const handleCsvUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows = text.split("\n").map((row) => row.split(","));
    const headers = rows[0];
    const emailIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("email")
    );

    const newRecipients = rows.slice(1).map((row) => ({
      email: row[emailIndex],
      variables: headers.reduce((acc, header, i) => {
        if (i !== emailIndex) acc[header.trim()] = row[i]?.trim() || "";
        return acc;
      }, {} as Record<string, string>),
    }));

    setRecipients(newRecipients);
    setCsvFile(file);
  };

  const validateRecipients = (recipients: any[]) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalid = recipients.filter((r) => !emailRegex.test(r.email));
    if (invalid.length) {
      throw new Error(
        `Invalid email addresses found: ${invalid
          .map((r) => r.email)
          .join(", ")}`
      );
    }
  };

  const handleSend = async () => {
    try {
      setIsLoading(true);
      validateRecipients(recipients);
      await emailService.sendBulkEmail(selectedTemplate.id, recipients);
      toast.success("Emails queued successfully");
      setCsvFile(null);
      setRecipients([]);
      await fetchQueueAndHistory();
    } catch (error: any) {
      toast.error(error.message || "Failed to send emails");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSend = async () => {
    try {
      setIsLoading(true);
      await emailService.sendEmail({
        templateId: selectedTemplate.id,
        to: testEmail,
        variables: {},
      });
      toast.success("Test email sent successfully");
    } catch (error) {
      toast.error("Failed to send test email");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      await fetchQueueAndHistory();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <nav className="flex space-x-4">
          {[
            { id: "compose", label: "Compose", icon: FileText },
            { id: "queue", label: "Queue", icon: Clock },
            { id: "history", label: "History", icon: History },
            { id: "templates", label: "Templates", icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as Tab)}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Compose Email</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Template
                </label>
                <select
                  value={selectedTemplate.id}
                  onChange={(e) => {
                    const template = templates.find(
                      (t) => t.id === e.target.value
                    );
                    if (template) setSelectedTemplate(template);
                  }}
                  className="w-full rounded-md border-gray-300 dark:border-gray-700"
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipients
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </label>
                  {csvFile && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{csvFile.name}</span>
                      <button
                        onClick={() => {
                          setCsvFile(null);
                          setRecipients([]);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={recipients.length === 0 || isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send to {recipients.length} recipients
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Preview & Test</h2>
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedTemplate?.content ||
                      "Select a template to preview",
                  }}
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter test email address"
                  className="flex-1 rounded-md border-gray-300"
                />
                <button
                  onClick={handleTestSend}
                  disabled={!testEmail || isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Send Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "queue" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Email Queue</h3>
              <button
                onClick={refreshData}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <RotateCw
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            <Table
              data={queue}
              columns={[
                { header: "Template", accessor: "templateId" },
                { header: "Status", accessor: "status" },
                {
                  header: "Recipients",
                  accessor: (row) => row.recipients.length,
                },
                {
                  header: "Sent",
                  accessor: (row) =>
                    row.sentAt ? new Date(row.sentAt).toLocaleString() : "-",
                },
              ]}
            />
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(queue.length / limit)}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Email History</h3>
              <button
                onClick={refreshData}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <RotateCw
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            <Table
              data={history}
              columns={[
                { header: "Template", accessor: "templateName" },
                { header: "Recipients", accessor: "recipientCount" },
                { header: "Success", accessor: "successCount" },
                { header: "Failed", accessor: "failureCount" },
                {
                  header: "Date",
                  accessor: (row) => new Date(row.createdAt).toLocaleString(),
                },
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Email Templates</h3>
              <button
                onClick={() => {
                  /* Add new template handler */
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                New Template
              </button>
            </div>
            <Table
              data={templates}
              columns={[
                { header: "Name", accessor: "name" },
                { header: "Subject", accessor: "subject" },
                {
                  header: "Created",
                  accessor: (row) => new Date(row.createdAt).toLocaleString(),
                },
                {
                  header: "Actions",
                  accessor: (row) => (
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
