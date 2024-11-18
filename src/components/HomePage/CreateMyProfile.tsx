import React, { useState } from "react";
import { Space, Button, message } from "antd";
import { useRouter } from "next/router";
import { useConnection } from "arweave-wallet-kit";
import { getErrorMessage } from "@/utils";

export default function CreateMyProfile() {
  const router = useRouter();
  const { connected, connect } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  async function getStarted() {
    setIsLoading(true);
    try {
      if (!connected) {
        await connect();
      }
      router.push("/profile");
    } catch (error) {
      message.error({ content: getErrorMessage(error), duration: 5 });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Space
      direction="vertical"
      align="center"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        type="primary"
        shape="round"
        onClick={getStarted}
        loading={isLoading}
        style={{
          width: "200px",
          height: "50px",
          fontSize: "18px",
          fontWeight: "bold",
          margin: "0 auto", 
          textAlign: "center",
        }}
      >
        Get Started
      </Button>
    </Space>
  );
}
