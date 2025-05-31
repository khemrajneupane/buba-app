"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import "./contentEditor.css";

interface ContentFormProps {
  contentId?: string;
  initialData?: {
    title: string;
    description: string;
  };
  onSuccess?: (updatedContent: any) => void;
  onClose?: () => void;
}

export default function ContentUploadForm({
  contentId,
  initialData,
  onSuccess,
  onClose,
}: ContentFormProps) {
  const router = useRouter();
  const { data } = useSession();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();

    // Validation before any API call
    if (!title && !description) {
      toast.error("शीर्षक र विवरण आवश्यक छन्।");
      return;
    }

    if (!title) {
      toast.error("शीर्षक आवश्यक छ।");
      return;
    }

    if (!description) {
      toast.error("विवरण आवश्यक छ।");
      return;
    }

    if (!data) {
      toast.error("कृपया पहिले लगइन गर्नुहोस्।");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = contentId ? `/api/contents/${contentId}` : "/api/contents";
      const method = contentId ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "सामग्री सुरक्षित गर्न असफल भयो।");
      }

      // Handle your specific API response structure
      if (!result.success) {
        throw new Error(result.message || "अनपेक्षित प्रतिक्रिया");
      }

      // Get the updated content from the response
      const updatedContent = result.contents || {
        _id: contentId,
        title,
        description,
      };

      toast.success(
        contentId
          ? "कथा सफलतापूर्वक अद्यावधिक गरियो!"
          : "तपाईंको कथा सफलतापूर्वक सुरक्षित गरिएको छ!!"
      );

      if (!contentId) {
        setFormData({ title: "", description: "" });
      }

      if (onSuccess) {
        onSuccess(updatedContent);
      } else {
        router.push("/all-contents");
        router.refresh();
      }

      if (onClose) onClose();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(
        error.message || "केही गलत भयो। कृपया फेरि प्रयास गर्नुहोस्।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-form-container">
      <h2 className="form-title">
        {contentId ? "कथा सम्पादन गर्नुहोस्" : "तपाईंको कथा साझा गर्नुहोस्"}
      </h2>

      <form onSubmit={handleSubmit} className="content-form">
        <div>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="कथाको शीर्षक"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            तपाईंको कथा *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={8}
            placeholder="यहाँ तपाईंका सम्झनाहरू, विचारहरू, वा कथाहरू लेख्नुहोस्..."
            className="textarea"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting || !formData.description}
            className={`button ${
              isSubmitting || !formData.description ? "button-disabled" : ""
            }`}
          >
            {isSubmitting
              ? "सेभ गर्दैछ..."
              : contentId
                ? "अद्यावधिक गर्नुहोस्"
                : "कथा सेभ गर्नुहोस्"}
          </button>
        </div>
      </form>
    </div>
  );
}
