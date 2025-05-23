"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
//import { FaExpand, FaCompress } from "react-icons/fa";
import "./imageGallery.css";
import Image from "next/image";

const Gallery = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { data } = useSession();

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (publicId: string, id: string) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "DELETE",
      });
      const res = await response.json();
      if (response.ok) {
        setImages(images.filter((img) => img._id !== id));
        toast.success("image deleated");
      } else {
        toast.error(res?.error);
        console.log("imagegallery", res);
        //throw new Error(res?.error);
      }
    } catch (error) {
      console.error(error);
      //toast.error(error);
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
        {/*isFullscreen && (
          <button
            className="custom-exit-fullscreen"
            onClick={() => document.exitFullscreen()}
          >
            <FaCompress />
          </button>
        )*/}
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
  console.log("imagenames", images);
  return (
    <div className="gallery-container">
      {images.length === 0 ? (
        <div className="empty-gallery">
          <div className="default-image-container">
            <Image
              src="/images/firstimage.jpg"
              alt="Default family image"
              width={800}
              height={600}
              className="default-image"
            />
            <p className="empty-message">Upload more हाम्रो परिवार photos!</p>
          </div>
        </div>
      ) : (
        <ImageGallery
          items={galleryItems}
          showFullscreenButton={true}
          showThumbnails={false}
        />
      )}
    </div>
  );
};

export default Gallery;
