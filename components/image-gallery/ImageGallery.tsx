"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import "./imageGallery.css";
import Image from "next/image";

const Gallery = () => {
  const [images, setImages] = useState<any[]>([]);
  const [videoData, setVideoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { data } = useSession();

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();

      const imgs = data.images.filter((img: any) =>
        img.url.match(/\.(jpeg|jpg|png|gif|webp)$/i)
      );
      const vids = data.images.filter((vdo: any) =>
        vdo.url.match(/\.(mp4|mov|avi|mkv)$/i)
      );

      setImages(imgs || []);
      setVideoData(vids || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (publicId: string, id: string) => {
    try {
      const response = await fetch(`/api/images/${id}`, { method: "DELETE" });
      const res = await response.json();

      if (response.ok) {
        setImages((prev) => prev.filter((img) => img._id !== id));
        setVideoData((prev) => prev.filter((vdo) => vdo._id !== id));
        toast.success("Deleted successfully");
      } else {
        toast.error(res?.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    fetchImages();
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  const galleryItems = images.map((img) => ({
    original: img.url,
    thumbnail: img.url,
    originalAlt: "Family Image",
    thumbnailAlt: "Thumbnail",
    renderItem: (item: any) => (
      <div className="gallery-item-container">
        <img
          src={item.original}
          alt={item.originalAlt}
          className="gallery-original-image"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteImage(img.public_id, img._id);
          }}
          className="delete-btn"
        >
          <FiTrash2 className="trash-icon" />
        </button>
        {data?.user && (
          <div className="image-info">अपलोड गर्ने {img?.username}</div>
        )}
      </div>
    ),
  }));

  return (
    <div className="w-full">
      {/* 🔘 Toggle Button outside gallery */}
      {videoData.length > 0 && (
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mb-4 gap-3 text-center">
          {/* Toggle Button */}
          <button
            onClick={() => setShowVideo((prev) => !prev)}
            className="btn btn-gradient btn-lg shadow"
            style={{
              minWidth: "220px",
              background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)",
              color: "#fff",
              fontWeight: "600",
            }}
          >
            {showVideo ? " तस्वीरहरू हेर्नुहोस्" : "भिडियोहरू हेर्नुहोस्"}
          </button>

          {/* Count Text */}
          <p className="mb-0 fs-5 fw-semibold">
            {showVideo
              ? `तस्वीरहरूको कुल संख्या: (${images.length})`
              : `भिडियोहरूको कुल संख्या: (${videoData.length})`}
          </p>
        </div>
      )}

      {/* Gallery container */}
      <div className="gallery-container">
        {showVideo ? (
          videoData.length > 0 ? (
            <div className="space-y-6">
              {videoData.map((vdo) => (
                <div
                  key={vdo._id}
                  className="relative flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow"
                >
                  <video controls className="w-full">
                    <source src={vdo.url} type="audio/mp4" />
                    Your browser does not support the audio element.
                  </video>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No audio files found.</p>
          )
        ) : images.length === 0 ? (
          <div className="empty-gallery">
            <Image
              src="/images/firstimage.jpg"
              alt="Default family image"
              width={800}
              height={600}
              className="default-image"
            />
            <p className="empty-message">Upload more हाम्रो परिवार photos!</p>
          </div>
        ) : (
          <ImageGallery
            items={galleryItems}
            showFullscreenButton={true}
            showThumbnails={false}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;
