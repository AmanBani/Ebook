import React, { useState } from "react";
import {
  Avatar,
  Button,
  Tooltip,
  Typography,
  message,
  theme,
} from "antd";
import {
  TwitterOutlined,
  GithubOutlined,
  InstagramOutlined,
  FacebookOutlined,
  ToolOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { FaDiscord } from "react-icons/fa";
import { ArAccount } from "arweave-account";
import EditProfileModal from "./EditProfileModal";
import { useRouter } from "next/router";
import { AiOutlineCopy } from "react-icons/ai";
import { styled } from "styled-components";
import { customTheme } from "@/config";

const { Text } = Typography;

const { useToken, getDesignToken } = theme;

const globalToken = getDesignToken(customTheme);

const StyledButton = styled(Button)`
  &:hover {
    color: ${globalToken.colorPrimary} !important;
  }
`;

export default function ProfileWithData({
  userAccount,
  showEditProfile,
  addr,
  refetch,
}: {
  addr: string;
  userAccount: ArAccount;
  showEditProfile: boolean;
  refetch?: () => void;
}) {
  const router = useRouter();
  const { token } = useToken();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const copyToClipBoard = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(
        `${window.location.origin}/${userAccount.handle.replace("#", "-")}`
      );
      message.success("Copied!");
      setTimeout(() => {
        setIsCopying(false);
      }, 2000);
    } catch (err) {
      message.error("Failed to copy!");
      setTimeout(() => {
        setIsCopying(false);
      }, 2000);
    }
  };

  return (
    <div
      style={{
        minWidth: "100vh",
        minHeight: "100vh",
        backgroundColor: "black",
        padding: "20px",
      }}
    >
      <EditProfileModal
        addr={addr}
        profile={userAccount.profile}
        isOpen={isOpen}
        onClose={onClose}
        refetch={refetch}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          marginBottom: "20px",
        }}
      >
        <img
          style={{
            height: "200px",
            width: "80%",
            objectFit: "cover",
            marginTop: "30px",
            borderRadius: "200px",
          }}
          src={userAccount.profile.bannerURL}
          alt="Banner"
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-110px",
          backgroundColor: "black",
        }}
      >
        <Avatar
          size={130}
          src={userAccount.profile.avatarURL}
          style={{
            border: `5px solid ${token.colorPrimary}`,
            background: "white",
          }}
        />
      </div>

      <div
        style={{
          padding: "20px 10px 10px 10px",
          border: "2px solid #fff",
          borderRadius: "8px",
          backgroundColor: "black",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
          }}
        >
          <Text style={{ fontSize: "2.5rem", fontWeight: 800, color: "white" }}>
            {userAccount.profile.name}
          </Text>
          <div style={{ display: "flex", gap: 4 }}>
            <Text style={{ color: "gray.500" }}>
              <a
                href={`https://viewblock.io/arweave/address/${addr}`}
                target="_blank"
                rel="noreferrer"
              >
                {userAccount.handle}{" "}
              </a>{" "}
            </Text>

            <Button
              size="small"
              style={{ padding: 2 }}
              icon={
                isCopying ? <CheckOutlined /> : <AiOutlineCopy size="auto" />
              }
              onClick={copyToClipBoard}
            ></Button>
          </div>

          <Text style={{ textAlign: "center" }}>{userAccount.profile.bio}</Text>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginBottom: showEditProfile ? 16 : 0,
          }}
        >
          {userAccount.profile.links.twitter && (
            <a
              href={`https://twitter.com/${userAccount.profile.links.twitter}`}
              target="_blank"
              rel="noreferrer"
            >
            <StyledButton
  icon={<TwitterOutlined style={{ fontSize: 45, color: "#1DA1F2" }} />} // Increased fontSize
  style={{ background: "transparent", border: "none" }}
/>

            </a>
          )}
          {userAccount.profile.links.github && (
            <a
              href={`https://github.com/${userAccount.profile.links.github}`}
              target="_blank"
              rel="noreferrer"
            >
              <StyledButton
                icon={<GithubOutlined style={{ fontSize: 45, color: "#FFF" }} />}
                style={{ background: "transparent", border: "none" }}
              />
            </a>
          )}
          {userAccount.profile.links.instagram && (
            <a
              href={`https://instagram.com/${userAccount.profile.links.instagram}`}
              target="_blank"
              rel="noreferrer"
            >
              <StyledButton
                icon={<InstagramOutlined style={{ fontSize: 45, color: "#E1306C" }} />}
                style={{ background: "transparent", border: "none" }}
              />
            </a>
          )}
          {userAccount.profile.links.facebook && (
            <a
              href={`https://facebook.com/${userAccount.profile.links.facebook}`}
              target="_blank"
              rel="noreferrer"
            >
              <StyledButton
                icon={<FacebookOutlined style={{ fontSize: 45, color: "#4267B2" }} />}
                style={{ background: "transparent", border: "none" }}
              />
            </a>
          )}
          {userAccount.profile.links.discord && (
            <Tooltip
              title={userAccount.profile.links.discord}
              placement="bottom"
            >
              <span>
                <StyledButton
                  icon={<FaDiscord style={{ fontSize: 45, color: "#7289DA" }} />}
                  style={{
                    background: "transparent",
                    border: "none",
                  }}
                />
              </span>
            </Tooltip>
          )}
        </div>

        {showEditProfile && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Button
              onClick={() => onOpen()}
              icon={<ToolOutlined style={{ fontSize: 18 }} />}
              style={{ borderRadius: "999px" }}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
