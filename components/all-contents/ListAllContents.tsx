"use client";

import { useEffect, useState } from "react";
import { ADToBS } from "bikram-sambat-js";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useSession } from "next-auth/react";
import { FiX, FiTrash2, FiMove } from "react-icons/fi";
import "./ListAllContents.css";
import toast from "react-hot-toast";

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
  const { data } = useSession();

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

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "के तपाईं यो वस्तु मेटाउन निश्चित हुनुहुन्छ?"
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
      toast.success("सफलतापूर्वक मेटियो");
    } catch (error) {
      toast.error("अनधिकृत पहुँच !!");
    }
  };

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
          contents.map((content) => (
            <Reorder.Item
              key={content._id}
              value={content}
              whileDrag={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              }}
            >
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
                <div className="drag-handle">
                  <FiMove />
                </div>
                <div
                  className="card-content"
                  onClick={() => setSelectedContent(content)}
                >
                  <div className="card-header">
                    {content.title ? (
                      <h2 className="content-title">{content.title}</h2>
                    ) : (
                      <h2 className="content-title">एउटा कथा !!</h2>
                    )}
                  </div>
                  <div className="content-preview">
                    {content.description.split("\n")[0].substring(0, 100)}
                    {content.description.length > 100 && "..."}
                  </div>
                  <div className="card-footer">
                    <span className="content-meta">
                      {ADToBS(
                        new Date(content.createdAt).toISOString().split("T")[0]
                      )}
                    </span>
                    <span className="content-author">{content.user.name}</span>
                  </div>
                </div>
              </motion.article>
            </Reorder.Item>
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
                <h2>{selectedContent.title || "एउटा कथा !!"}</h2>
                <div className="modal-actions">
                  {
                    // @ts-ignore
                    data?.user?.role === "admin" && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(selectedContent._id)}
                      >
                        <FiTrash2 />
                      </button>
                    )
                  }
                  <button
                    className="close-btn"
                    onClick={() => setSelectedContent(null)}
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              <div className="modal-meta">
                <span className="content-date">
                  {ADToBS(
                    new Date(selectedContent.createdAt)
                      .toISOString()
                      .split("T")[0]
                  )}
                </span>
                <span className="content-author">
                  {selectedContent.user.name} द्वारा
                </span>
              </div>

              <div className="modal-content">
                {selectedContent.description.split("\n").map((paragraph, i) => (
                  <p key={i} className="content-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
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
