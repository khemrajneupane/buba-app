"use client";

import { useEffect, useState } from "react";
import { ADToBS } from "bikram-sambat-js";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useSession } from "next-auth/react";
import { FiX, FiTrash2, FiMove, FiEdit } from "react-icons/fi";
import "./ListAllContents.css";
import toast from "react-hot-toast";
import { Flower2, Upload } from "lucide-react";
import ContentUploadForm from "../contents/ContentEditor";
//import ContentUploadForm from "./ContentUploadForm";

interface Content {
  _id: string;
  title?: string;
  description: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ListAllContents() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const { data } = useSession();
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => setShowTooltip((prev) => !prev);
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch("/api/contents");
        const data = await res.json();
        setContents(data?.contents.reverse());
      } catch (error) {
        console.error("सामग्री ल्याउन त्रुटि भयो:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  const handleDelete = async (id: string, selectedContent: Content) => {
    const confirmed = window.confirm(
      `के तपाईं "${selectedContent.title}" मेटाउन निश्चित हुनुहुन्छ?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/contents/${id}`, {
        method: "DELETE",
      });
      const resContents = await res.json();

      if (!res.ok) {
        throw new Error(resContents?.error || "सामग्री सुरक्षित गर्न असफल भयो");
      }

      setContents(contents.filter((content) => content._id !== id));
      setSelectedContent(null);
      setEditingContent(null);
      toast.success("सफलतापूर्वक मेटियो");
    } catch (error) {
      toast.error("अनधिकृत पहुँच !!");
    }
  };

  const handleUpdateSuccess = (updatedContent: Content) => {
    const confirmed = window.confirm(
      `के तपाईं ${updatedContent.title} अद्यावधिक गर्न निश्चित हुनुहुन्छ?`
    );
    if (!confirmed) return;

    setContents(
      contents.map((c) => (c?._id === updatedContent._id ? updatedContent : c))
    );
    setEditingContent(null);
    setSelectedContent(updatedContent);
    toast.success("सामग्री सफलतापूर्वक अद्यावधिक गरियो");
  };
  const textColors = ["#1a1a1a", "#004488", "#007744"]; // dark, blue, green
  const bgColors = ["#fff8f0", "#f0f8ff", "#f0fff5"]; // peach, light-blue, light-green

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="content-gallery">
      {/* Traditional Nepali Header */}
      <div className="gallery-header">
        <h1>घनश्याम न्यौपानेको संस्मरण</h1>
        <p>जीवनका अनुभव, विचार र कथाहरूको संग्रह</p>
      </div>

      {/* All Contents Displayed */}
      <Reorder.Group
        axis="y"
        values={contents}
        onReorder={setContents}
        className="contents-container"
      >
        {contents.length === 0 ? (
          <div className="empty-state">
            <p>कुनै कथा उपलब्ध छैन</p>
          </div>
        ) : (
          contents.map((content, i) => (
            <div key={content?._id}>
              <motion.article
                className="content-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  damping: 10,
                  stiffness: 100,
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="card-content"
                  key={content?._id}
                  onClick={() => setSelectedContent(content)}
                  style={{
                    color: textColors[i % textColors.length],
                    backgroundColor: bgColors[i % bgColors.length],
                  }}
                >
                  <div className="card-header">
                    {content?.title ? (
                      <h2
                        className="content-title"
                        style={{
                          color: textColors[i % textColors.length],
                          backgroundColor: bgColors[i % bgColors.length],
                        }}
                      >
                        {content.title}
                      </h2>
                    ) : (
                      <h2 className="content-title">एउटा कथा !!</h2>
                    )}
                  </div>

                  <div
                    className="content-preview"
                    style={{
                      color: textColors[i % textColors.length],
                      backgroundColor: bgColors[i % bgColors.length],
                    }}
                  >
                    {content.description.split("\n")[0].substring(0, 100)}
                    {content.description.length > 100 && "..."}
                  </div>

                  <div
                    className="card-footer"
                    style={{
                      color: textColors[i % textColors.length],
                      backgroundColor: bgColors[i % bgColors.length],
                    }}
                  >
                    <span
                      className="content-meta"
                      style={{
                        color: textColors[i % textColors.length],
                        backgroundColor: bgColors[i % bgColors.length],
                      }}
                    >
                      {ADToBS(
                        new Date(content.createdAt).toISOString().split("T")[0]
                      )}
                    </span>
                    {" · "}
                    <span
                      className="content-author"
                      style={{
                        color: textColors[i % textColors.length],
                        backgroundColor: bgColors[i % bgColors.length],
                      }}
                    >
                      {content.user.name}
                    </span>
                  </div>
                </div>
              </motion.article>
            </div>
          ))
        )}
      </Reorder.Group>

      {/* Content Detail Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            className="content-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedContent(null)}
          >
            <motion.div
              className="content-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                {
                  // @ts-ignore
                  data?.user?.role === "admin" && (
                    <div style={{ display: "flex", gap: "5rem" }}>
                      <button
                        className="close-btn"
                        onClick={() =>
                          handleDelete(selectedContent._id, selectedContent)
                        }
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => setEditingContent(selectedContent)}
                      >
                        <FiEdit />
                      </button>
                    </div>
                  )
                }
                <div
                  className="headline-wrapper"
                  onClick={toggleTooltip}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <h1 className="headlines">
                    {(selectedContent.title || "एउटा कथा !!").slice(0, 25) +
                      ((selectedContent.title
                        ? selectedContent.title.length
                        : 0) > 25
                        ? "..."
                        : "")}
                  </h1>

                  {showTooltip && (
                    <div className="cloud-tooltip">
                      {selectedContent.title || "एउटा कथा !!"}
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    className="close-btn"
                    onClick={() => setSelectedContent(null)}
                  >
                    <FiX />
                  </button>
                </div>
              </div>
              <div className="modal-meta">
                <span className="content-author">
                  {selectedContent.user.name} द्वारा मिति
                </span>
                {ADToBS(
                  new Date(selectedContent.createdAt)
                    .toISOString()
                    .split("T")[0]
                )}
                <span>मा अपलोड गरिएको</span>
              </div>
              <div className="modal-image">
                <Flower2 />
                <Flower2 />
                <Flower2 />
                <Flower2 />
              </div>
              <div className="modal-content">
                {selectedContent.description.split("\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="content-paragraph"
                    style={{
                      color: textColors[i % textColors.length],
                      backgroundColor: bgColors[i % bgColors.length],
                      padding: "1rem",
                      borderRadius: "8px",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Content Modal */}
      <AnimatePresence>
        {editingContent && (
          <motion.div
            className="edit-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="edit-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <button
                className="close-btn"
                onClick={() => setEditingContent(null)}
              >
                <FiX />
              </button>
              <ContentUploadForm
                contentId={editingContent?._id}
                initialData={{
                  title: editingContent.title || "",
                  description: editingContent.description,
                }}
                onSuccess={handleUpdateSuccess}
                onClose={() => setEditingContent(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traditional Nepali Footer */}
      <footer className="gallery-footer">
        <p>
          © {ADToBS(new Date().getFullYear().toString())} घनश्याम न्यौपाने.
          सर्वाधिकार सुरक्षित.
        </p>
        <p>प्रेम र सम्मानसहित तपाईंको छोराले बनाएको</p>
      </footer>
    </div>
  );
}
