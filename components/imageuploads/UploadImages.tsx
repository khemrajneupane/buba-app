"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import "./uploadimages.css";

const UploadImages = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    data?: {
      public_id: string;
      url: string;
    };
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    console.log("selectedFile", selectedFile);
    // Validate file type
    if (!selectedFile.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      //setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      //setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
    setUploadResult(null);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file first");
      //setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("upload error", data);
        toast.error(data.message || data.error || "Failed to upload image");
        return;
        //throw new Error("Please login to upload");
        //throw new Error(data.message || data.error || "Failed to upload image");
      }

      setUploadResult({
        success: true,
        data: {
          public_id: data.public_id,
          url: data.url,
        },
        message: toast.success("Image uploaded successfully"),
      });
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: any) {
      toast.error(err.message);
      //setError(err.message);
      setUploadResult({
        success: false,
        message: toast.error(err.message),
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Image Upload</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        {/* File Input Area */}
        <div className={`drop-zone ${!preview ? "empty" : ""}`}>
          {!preview ? (
            <div className="drop-zone-content">
              <div className="upload-icon">↑</div>
              <p>Drag and drop your image here</p>
              <p>or click to browse files</p>
              <p className="file-requirements">Supports: JPEG, PNG (Max 5MB)</p>
            </div>
          ) : (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="remove-button"
              >
                ×
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={uploading || !file}
          className={`upload-button ${uploading || !file ? "disabled" : ""}`}
        >
          {uploading ? (
            <>
              <span className="spinner"></span>
              Uploading...
            </>
          ) : (
            <>↑ Upload Image</>
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadImages;
