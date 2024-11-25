import React from "react";
import { Card, Button, Space } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";

interface PdfCardProps {
  title: string;
  pdfUrl: string;
  onDelete: () => void;
}

const PdfCard: React.FC<PdfCardProps> = ({ title, pdfUrl, onDelete }) => {
  return (
    <Card
      title={title}
      style={{ marginBottom: 16 }}
      actions={[
        <Button
        key={title}
          icon={<DownloadOutlined />}
          type="link"
          href={pdfUrl}
          download={title}
        >
          Download
        </Button>,
        <Button key={title} icon={<DeleteOutlined />} type="link" danger onClick={onDelete}>
          Remove
        </Button>,
      ]}
    >
      <iframe
        src={pdfUrl}
        width="100%"
        height="300px"
        style={{ border: "none" }}
      ></iframe>
    </Card>
  );
};

export default PdfCard;