import React from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "../api/client"; // Update import to use axios instance

interface TemplateForm {
  name: string;
  subject: string;
  content: string;
  variables: Record<string, string>;
}

export function EmailTemplateManager() {
  const [templates, setTemplates] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const { register, handleSubmit, reset } = useForm<TemplateForm>();

  const onSubmit = async (data: TemplateForm) => {
    try {
      // Add default empty variables object if not provided
      const templateData = {
        ...data,
        variables: data.variables || {},
      };

      const response = await api.post("/mail/template", templateData);

      if (response.status === 201) {
        // Note: Changed to 201 for creation
        await loadTemplates();
        setIsOpen(false);
        reset();
        toast.success("Template created successfully");
      }
    } catch (error: any) {
      console.error("Failed to save template:", error);
      toast.error(error.response?.data?.message || "Failed to create template");
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await api.get("/mail/templates");
      setTemplates(response.data?.templates || []);
    } catch (error: any) {
      console.error("Failed to load templates:", error);
      toast.error(error.response?.data?.message || "Failed to load templates");
    }
  };

  React.useEffect(() => {
    loadTemplates();
  }, []);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Template
      </button>

      <div className="grid gap-4">
        {templates.map((template: any) => (
          <div key={template.id} className="border p-4 rounded">
            <h3 className="font-bold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.subject}</p>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("name")}
                placeholder="Template Name"
                className="w-full border p-2 rounded"
              />
              <input
                {...register("subject")}
                placeholder="Email Subject"
                className="w-full border p-2 rounded"
              />
              <textarea
                {...register("content")}
                placeholder="HTML Content"
                rows={10}
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                Save Template
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
