import React from "react";
import { Typography, Row, Col, Image } from "antd";
import Illustration from "@/components/HomePage/Illustration";
import CreateMyProfile from "@/components/HomePage/CreateMyProfile";
import { withPublicRoutes } from "@/hoc";
import { BookOpen, Share2, Users } from 'lucide-react';

interface SilverSeparatorProps {
  width?: string
  margin?: string
}


const { Title, Text } = Typography;

const Home = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
        padding: "30px",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Header Section */}
      <Row
        justify="space-between"
        align="middle"
        style={{
          padding: "60px 0",
        }}
      >
        <Col xs={24} lg={12}>

        <Title
  level={1}
  style={{
    fontWeight: 900,
    fontSize: "4.5rem",
    lineHeight: 1.2,
    marginBottom: "10px",
    background: "linear-gradient(90deg, #C0C0C0, #A9A9A9, #D3D3D3)", // Metallic silver gradient
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", // Makes the gradient visible on text
    textAlign: "center",
  }}
>
EverShelf
</Title>

        <Title
  level={1}
  style={{
    fontWeight: 700,
    fontSize: "2.5rem",
    lineHeight: 1.2,
    marginBottom: "30px",
    background: "linear-gradient(90deg, #C0C0C0, #A9A9A9, #D3D3D3)", // Metallic silver gradient
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", // Makes the gradient visible on text
    textAlign: "center",
  }}
>
  Ebook Storage Redefined
</Title>

<Text
  style={{
    display: "block",
    fontSize: "1.2rem", 
    marginBottom: "42px",
    color: "#FFFFFF",
    lineHeight: 1.8, 
    textAlign: "center", 
    maxWidth: "800px", 
    margin: "0 auto", 
  }}
>
  Store and manage your digital library effortlessly. Designed with simplicity and powered by Arweave. Store and manage your digital library effortlessly. 
</Text>

      <CreateMyProfile />
    

        </Col>
        <Col xs={24} lg={12} style={{ textAlign: "center", marginTop: "40px" }}>

          <Image
            src="./img01.jpg"
            alt="Ebook Storage Illustration"
            preview={false}
            width={480}
            height={480}
            style={{
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(255, 255, 255, 0.1)",
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Col>
      </Row>

      {/* Information Section */}
      <Row
        justify="center"
        style={{
          margin: "80px 0",
        }}
      >
        <Col xs={24} md={20} lg={16}>
          <div
            style={{
              padding: "40px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(255, 255, 255, 0.1)",
              textAlign: "center",
            }}
          >
            <Title
              level={2}
              style={{
                fontWeight: 700,
                fontSize: "3rem",
                color: "#C0C0C0",
                marginBottom: "24px",
              }}
            >
              Simplify Your Ebook Management
            </Title>
            <Text
              style={{
                fontSize: "1.25rem",
                lineHeight: 1.8,
                color: "#ffffff",
              }}
            >
            Collect, preserve, and share your eBooks seamlessly with the world, powered by the revolutionary Arweave technology. Our platform enables you to securely store your digital content permanently, ensuring it remains accessible for generations to come. Empower your readers by providing them with an innovative, decentralized library experience, where they can discover and enjoy your creations without limitations. As a creator, you’ll receive the support and tools needed to expand your digital library, reach a global audience, and leave a lasting impact in the ever-evolving world of literature and knowledge-sharing.
            </Text>
          </div>
        </Col>
      </Row>

 

      {/* Additional Features Section */}
      <Row
  justify="center"
  style={{
    margin: "80px 0",
  }}
>
  <Col xs={24} md={20} lg={16}>
    <div
      style={{
        padding: "40px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(255, 255, 255, 0.1)",
        textAlign: "center",
      }}
    >
      <Title
        level={2}
        style={{
          fontWeight: 700,
          fontSize: "3rem",
          color: "#C0C0C0",
          marginBottom: "24px",
        }}
      >
        Why Choose EbookStorage?
      </Title>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {[
          { icon: <BookOpen size={24} />, text: "Store your ebooks securely and permanently on Arweave" },
          { icon: <Share2 size={24} />, text: "Share your library with readers across the globe" },
          { icon: <Users size={24} />, text: "Get support from the amazing Arweave community" },
        ].map((item, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                background: "#C0C0C0",
                borderRadius: "50%",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {React.cloneElement(item.icon, { color: "#000000" })}
            </div>
            <Text style={{ fontSize: "1.1rem", color: "#ffffff", flex: 1 }}>{item.text}</Text>
          </div>
        ))}
      </div>
    </div>
  </Col>
</Row>

      <Row
        justify="center"
        style={{
          marginTop: "80px",
        }}
      >
         <Image
            src="./back01.jpeg"
            alt="Ebook Storage Illustration"
            preview={false}
            width={480}
            height={480}
            style={{
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(255, 255, 255, 0.1)",
              maxWidth: "100%",
              height: "auto",
            }}
          />
      </Row>
    </div>
  );
};

export default withPublicRoutes(Home);