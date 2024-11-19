import { Row, Space, theme, Image } from "antd";
import { Header } from "antd/es/layout/layout";
import { usePathname } from "next/navigation";
import { ConnectButton } from "arweave-wallet-kit";
import { customTheme } from "@/config";
import NextLink, { LinkProps } from "next/link";
import React from "react";
import { withPublicRoutes } from "@/hoc";
import { SUPPORT_HANDLE } from "@/utils/constants";

const { getDesignToken } = theme;

const globalToken = getDesignToken(customTheme);


const headerStyle: React.CSSProperties = {
  height: 80, 
  lineHeight: "80px", 
  backgroundColor: "black",
  color: "white",
  boxShadow: "0 2px 3px -2px rgba(255,255,255,0.3)",
  padding: "0 30px", 
  fontFamily: "'Poppins', sans-serif", 
};

interface NavItem {
  key: number;
  label: string;
  href?: string;
  isAuthentionRequired?: boolean;
}

interface NavLinkProps extends LinkProps {
  children?: string | React.ReactNode;
  href: string;
}

const NavItems: Array<NavItem> = [
  {
    key: 0,
    label: "Home",
    href: "/",
    isAuthentionRequired: false,
  },
  {
    key: 1,
    label: "Contribute",
    href: `/${SUPPORT_HANDLE}`,
    isAuthentionRequired: false,
  },
];

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (isActive) {
    return (
      <NextLink
        style={{
          fontWeight: "bold",
          fontSize: "18px", // Increased font size
          padding: "12px 16px", // Adjusted padding
          backgroundColor: "white",
          color: "black",
          borderRadius: "6px", // Slightly rounded corners
          fontFamily: "'Montserrat', sans-serif", // Stylish font
          transition: "transform 0.2s", // Smooth hover effect
          transform: "scale(1.05)", // Slight scale for active link
        }}
        href={href}
      >
        {children}
      </NextLink>
    );
  }

  return (
    <NextLink
      style={{
        fontSize: "18px", // Increased font size
        color: "white",
        padding: "12px 16px",
        borderRadius: "6px",
        fontFamily: "'Montserrat', sans-serif",
        transition: "background-color 0.3s, transform 0.2s",
      }}
      href={href}
    >
      {children}
    </NextLink>
  );
};

const NavBar = () => {
  return (
    <Header style={headerStyle}>
      <Row justify="space-between" align="middle">
        <Space direction="horizontal" size={24}>
          <NextLink href="/">
            <Image
              width="60px" // Increased logo size
              src="/icon.svg"
              alt="logo"
              style={{ borderRadius: "50%" }}
              preview={false}
            />
          </NextLink>
          <Space size={20}> {/* Adjusted spacing between links */}
            {NavItems.map((item) => (
              <NavLink key={item.key} href={item.href as string}>
                {item.label}
              </NavLink>
            ))}
          </Space>
        </Space>

        <ConnectButton
          accent={globalToken.colorPrimary}
          style={{
            height: "44px", // Slightly larger button
            fontSize: "16px", // Increased font size
            backgroundColor: "white",
            color: "black",
            border: "1px solid white",
            fontFamily: "'Poppins', sans-serif", // Stylish font
          }}
        />
      </Row>
    </Header>
  );
};

export default NavBar;
