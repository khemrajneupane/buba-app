"use client";

import { useEffect, useState } from "react";
import "./ListAllContents.css";

interface Content {
  _id: string;
  title?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function ListAllContents() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch("/api/contents");
        const data = await res.json();
        console.log("allContents", data);
        setContents(data?.contents);
      } catch (error) {
        console.error("Error fetching contents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

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
      <div className="contents-container">
        {contents.length === 0 ? (
          <div className="empty-state">
            <p>कुनै कथा उपलब्ध छैन</p>
          </div>
        ) : (
          contents.map((content) => (
            <article key={content._id} className="content-card">
              {/* Card Header */}
              <div className="card-header">
                <span className="content-date">
                  {new Date(content.createdAt).toLocaleDateString("ne-NP")}
                </span>
                {content.title && (
                  <h2 className="content-title">{content.title}</h2>
                )}
              </div>

              {/* Full Content */}
              <div className="content-body">
                {content.description.split("\n").map((paragraph, i) => (
                  <p key={i} className="content-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Traditional Nepali Footer */}
      <footer className="gallery-footer">
        <p>
          © {new Date().getFullYear()} घनश्याम न्यौपाने. सर्वाधिकार सुरक्षित.
        </p>
        <p>प्रेम र सम्मानसहित तपाईंको छोराले बनाएको</p>
      </footer>
    </div>
  );
}
