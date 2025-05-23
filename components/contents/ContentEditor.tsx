"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "./ContentEditor.css";

export default function ContentUploadForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
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
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      toast.success("Your story has been saved successfully!");
      setFormData({ title: "", description: "" });
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-form-container">
      <h2 className="form-title">Share Your Story</h2>

      <form onSubmit={handleSubmit} className="content-form">
        <div>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., My Childhood Memories"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Your Story *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={8}
            placeholder="Write your memories, thoughts, or stories here..."
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
            {isSubmitting ? "Saving..." : "Save Story"}
          </button>
        </div>
      </form>
    </div>
  );
}
