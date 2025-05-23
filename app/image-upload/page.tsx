import UploadImages from "@/components/imageuploads/UploadImages";
import React from "react";

export const metadata = {
  title: "Upload Avatar",
};

const UploadImagePage = () => {
  return (
    <div className="container mx-auto py-8">
      <UploadImages />
    </div>
  );
};

export default UploadImagePage;
