import ContentUploadForm from "@/components/contents/ContentEditor";
import UploadImages from "@/components/imageuploads/UploadImages";
import React from "react";

export const metadata = {
  title: "Upload Avatar",
};

const UploadImagePage = () => {
  return (
    <div className="container mx-auto py-8 px-3">
      <ContentUploadForm />
    </div>
  );
};

export default UploadImagePage;
