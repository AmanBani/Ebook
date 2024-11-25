
import React, { useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import { InboxOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useRouter } from "next/router";
import { arweave, currencyOptions, licenseOptions } from "@/utils";
import { registerContract } from "@/lib/warp/asset";
import {
  UDL,
  APP_NAME,
  APP_VERSION,
  ATOMIC_ASSET_SRC,
} from "@/utils/constants";
import { useActiveAddress, useApi } from "arweave-wallet-kit";
import { ITag } from "@/types";
import { withPrivateRoutes } from "@/hoc";
import { dispatchTransaction } from "@/lib/arconnect";
import PdfCard from "@/components/Cards/PdfCard";

const { Dragger } = Upload;

function NewPdf() {
  const [pdfForm] = Form.useForm();
  const lockRef = useRef(false);
  const router = useRouter();
  const [fileList, setFileList] = useState<any>([]);
  const [pdfUrls, setPdfUrls] = useState<{ url: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const activeAddress = useActiveAddress();
  const walletApi = useApi();
  const existingUidsRef = useRef(new Set<string>());

  const formSubmitHandler = async (pdf: {
    title: string;
    topics: string;
    description: string;
    license: string;
    currency: string;
    payment?: string;
    files: { file: File; fileList: { file: { originFileObj: File } }[] };
  }) => {
    setIsLoading(true);
    try {
      let topics: ITag[] = [];
      if (pdf.topics) {
        topics = pdf.topics.split(",").map((topic) => {
          topic = topic.trim();
          return { name: `topic:${topic}`, value: topic };
        });
      }
      const transactionIds: string[] = [];
      for (const {
        file: { originFileObj },
      } of fileList) {
        try {
          const contentType = "application/pdf";  // Set the content type for PDFs
          const tags = [
            { name: "App-Name", value: APP_NAME },
            { name: "App-Version", value: APP_VERSION },
            { name: "Content-Type", value: contentType },
            { name: "Title", value: pdf.title },
            { name: "Description", value: pdf.description },
            { name: "Type", value: "pdf" },
            ...topics,
          ];

          const data = await originFileObj.arrayBuffer();
          const tx = await arweave.createTransaction({ data });
          tags.forEach((tag) => tx.addTag(tag.name, tag.value));
          const res = await dispatchTransaction(tx, walletApi);
          transactionIds.push(res?.id as string);
        } catch (err) {
          console.log(originFileObj.name, err);
        }
      }
      const published = new Date().getTime();
      const contentType = "application/json";
      let tags = [
        { name: "App-Name", value: "SmartWeaveContract" },
        { name: "App-Version", value: "0.3.0" },
        { name: "Content-Type", value: contentType },
        { name: "Indexed-By", value: "ucm" },
        { name: "License", value: UDL },
        { name: "Payment-Mode", value: "Global-Distribution" },
        { name: "Title", value: pdf.title },
        { name: "Description", value: pdf.description },
        { name: "Type", value: "pdf-album" },
        { name: "Protocol", value: `${APP_NAME}-Post-v${APP_VERSION}` },
        { name: "Published", value: published.toString() },
        {
          name: "Contract-Manifest",
          value:
            '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}',
        },
        { name: "Contract-Src", value: ATOMIC_ASSET_SRC },
        {
          name: "Init-State",
          value: JSON.stringify({
            title: pdf.title,
            description: pdf.description,
            creator: activeAddress,
            claimable: [],
            ticker: "ATOMIC-POST",
            name: pdf.title,
            balances: {
              [activeAddress as string]: 100,
            },
            emergencyHaltWallet: activeAddress as string,
            contentType,
            published,
            settings: [["isTradeable", true]],
            transferable: true,
          }),
        },
      ].concat(topics);

      // Add any licensing and payment related tags
      if (pdf.license === "derivative-credit") {
        tags.push({ name: "Derivation", value: "Allowed-with-credit" });
      }

      if (pdf.license === "derivative-indication") {
        tags.push({
          name: "Derivation",
          value: "Allowed-with-indication",
        });
      }

      if (pdf.license === "commercial") {
        tags.push({ name: "Commercial-Use", value: "Allowed" });
      }

      if (pdf.license === "commercial-credit") {
        tags.push({ name: "Commercial-Use", value: "Allowed-with-credit" });
      }

      if (pdf.payment) {
        tags.push({ name: "License-Fee", value: "One-Time-" + pdf.payment });
      }

      if (pdf.currency && pdf.currency !== "U") {
        tags.push({ name: "Currency", value: pdf.currency });
      }
      const data = JSON.stringify(transactionIds);
      const transaction = await arweave.createTransaction({ data });
      tags.forEach((tag) => transaction.addTag(tag.name, tag.value));

      const response = await dispatchTransaction(transaction, walletApi);
      if (response?.id) {
        const contractTxId = await registerContract(response?.id);
        setFileList([]);
        message.success("PDF published successfully!");
        pdfForm.resetFields();
        setShowAmountInput(false);
      } else {
        throw new Error("PDF publish error");
      }
    } catch (error) {
      message.error({
        content: "PDF publish error",
      });
    }

    setIsLoading(false);
  };

  const resetHandler = () => {
    pdfForm.resetFields();
    setFileList([]);
  };

  const handleLicenseChange = (value: string) => {
    setShowAmountInput(value !== "default");
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    fileList: fileList,
    accept: ".pdf",  // Only accept PDF files
    showUploadList: false,
    beforeUpload: () => false,
    onChange: async (info: any) => {
      if (lockRef.current) return;
      lockRef.current = true;

      const newFiles = info.fileList.filter((file: any) => {
        if (
          file?.attachmentType === "uploadType" ||
          existingUidsRef.current.has(file.uid)
        ) {
          return false;
        }
        existingUidsRef.current.add(file.uid);
        return true;
      });

      const newFileInfos = newFiles.map((file: UploadFile) => {
        const thumbnailUrl = URL.createObjectURL(file.originFileObj as RcFile);
        return {
          file: file,
          uid: file.uid,
          name: file.name,
          attachmentType: "uploadType",
          attachmentUrl: thumbnailUrl,
        };
      });
      setFileList((prevFiles: UploadFile<any>[]) => [
        ...prevFiles,
        ...newFileInfos,
      ]);
      lockRef.current = false;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const handleDelete = (url: string) => {
    setPdfUrls((prev) => prev.filter((pdf) => pdf.url !== url));
  };

  return (
    <Row style={{ width: "100%", padding: "16px 24px" }}>
      <Form
        form={pdfForm}
        layout="vertical"
        preserve={false}
        onFinish={formSubmitHandler}
        style={{ width: "100%" }}
      >
        <Row style={{ marginBottom: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/posts")}
          >
            Go Back
          </Button>
        </Row>
        <Row gutter={[16, 16]}>
          <Col md={24} xs={24}>
            <Form.Item
              style={{ marginBottom: 8 }}
              name="files"
              rules={[{ required: true, message: "Please click or drag a PDF" }]}
            >
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag PDF to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for multiple PDFs upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger>
            </Form.Item>
            <Row gutter={[16, 16]}>
              {pdfUrls.map((pdf, index) => (
                <Col key={index} md={12} xs={24}>
                  <PdfCard
                    title={pdf.title}
                    pdfUrl={pdf.url}
                    onDelete={() => handleDelete(pdf.url)}
                  />
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={24} xs={24}>
            <Form.Item
                         
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                  message: "Title should not be empty!",
                },
              ]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter title" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              style={{ marginBottom: 8 }}
              rules={[{ required: true }]}
            >
              <Input.TextArea
                placeholder="Enter description"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
            <Form.Item
              name="topics"
              label="Topics"
              help="Enter a comma-separated list of topics"
              style={{ marginBottom: 8 }}
            >
              <Input.TextArea
                placeholder="Enter topics"
                autoSize={{ minRows: 2, maxRows: 3 }}
              />
            </Form.Item>
            <Form.Item
              name="license"
              label="License"
              rules={[
                {
                  required: true,
                  message: "Please select a license!",
                },
              ]}
              style={{ marginBottom: 8 }}
              initialValue="default"
            >
              <Select
                placeholder="Select license"
                options={licenseOptions}
                onChange={handleLicenseChange}
              />
            </Form.Item>
            {showAmountInput && (
              <>
                <Form.Item
                  label="Currency"
                  name="currency"
                  rules={[{ required: showAmountInput }]}
                  initialValue="U"
                >
                  <Select
                    placeholder="Select currency"
                    options={currencyOptions}
                  />
                </Form.Item>
                <Form.Item
                  label="Payment"
                  name="payment"
                  rules={[{ required: showAmountInput }]}
                >
                  <Input placeholder="Amount in AR or U" type="number" />
                </Form.Item>
              </>
            )}
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: 12 }}>
          <Space>
            <Button onClick={resetHandler}>Reset</Button>
            <Button
              type="primary"
              onClick={() => pdfForm.submit()}
              loading={isLoading}
            >
              Publish
            </Button>
          </Space>
        </Row>
      </Form>
    </Row>
  );
}

export default withPrivateRoutes(NewPdf);