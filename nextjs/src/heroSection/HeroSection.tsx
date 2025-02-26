"use client";
import React, { useState } from "react";
import { Button, Spin, Typography, Row, Col, Space, Card, Empty, Alert, Rate } from "antd";
import { SearchForm } from "./components/SearchForm";
import { ResultsRenderer } from "./components/ResultsRenderer";
import type { Video } from "@/heroSection/types/Video";
import Logo from "@/app/_icons/Logo2";
import Image from "next/image";

const { Title, Paragraph } = Typography;

export const HeroSection = () => {
  const [results, setResults] = useState<Video[]>([]);
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateValue, setRateValue] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    // API call would go here
    // After API call, update results and set loading to false
  };

  const handleRateChange = async (value: number) => {
    setRateValue(value);
    // Handle rating submission logic here
  };

  return (
    <div className="relative w-full">
      <Row justify="center" align="middle" className="pt-20">
        <Col xs={24} md={20} lg={18}>
          <Card className="bg-layer1/50 backdrop-blur-2xl">
            <Row gutter={[32, 32]} align="middle">
              {/* Logo and Image Section */}
              <Col xs={24} sm={10} className="relative">
                <div className="relative w-3/4 pl-10 pt-10 sm:w-full md:w-full">
                  <div className="absolute left-[-20px] top-[-20px] z-20">
                    <Logo className="h-40 w-40" />
                  </div>
                  <div className="overflow-hidden rounded-[1.5rem] border-8 border-primary box-decoration-slice">
                    <Image
                      className={`scale-110 ${loading ? "mx-auto w-40" : "mx-auto w-80"}`}
                      src={
                        loading
                          ? "/images/drkThinking.png"
                          : "/images/drkStaring.png"
                      }
                      alt={loading ? "Dr. K thinking" : "Dr. K staring"}
                      width={720}
                      height={720}
                    />
                  </div>
                </div>
              </Col>

              {/* Content Section */}
              <Col xs={24} sm={0} md={14}>
                <Space direction="vertical" size="large" className="w-full">
                  <HeroHeader />
                  {!isExpanded && <SearchForm
                    query={query}
                    loading={loading}
                    isExpanded={false}
                    onSubmit={handleSubmit}
                    onInputChange={(e) => {
                      setQuery(e.target.value);
                      setIsExpanded(e.target.value.length > 50);
                    }}
                  />}
                </Space>
              </Col>
              <Col xs={0} sm={14} md={0}>
                <Space direction="vertical" size="large" className="w-full">
                  <HeroHeader />
                </Space>
              </Col>
              {!isExpanded && (
              <Col xs={0} sm={24} md={0}>
                <Space direction="vertical" size="large" className="w-full">
                  <SearchForm
                    query={query}
                    loading={loading}
                    isExpanded={false}
                    onSubmit={handleSubmit}
                    onInputChange={(e) => {
                      setQuery(e.target.value);
                      setIsExpanded(e.target.value.length > 50);
                    }}
                  />
                </Space>
              </Col>
              )}
              {isExpanded && (
                <Col xs={24} sm={24} md={24}>
                  <Space direction="vertical" size="large" className="w-full">
                    <SearchForm
                      query={query}
                      loading={loading}
                      isExpanded={isExpanded}
                      onSubmit={handleSubmit}
                      onInputChange={(e) => {
                        setQuery(e.target.value);
                        setIsExpanded(e.target.value.length > 50);
                      }}
                    />
                  </Space>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row justify="center" className="mt-8">
        <Col xs={24} md={20} lg={18}>
          <ResultsContent
            loading={loading}
            errorMessage={responseMessage}
            results={results}
            rateValue={rateValue}
            handleRateChange={handleRateChange}
          />
        </Col>
      </Row>
    </div>
  );
};

const HeroHeader = () => (
  <Typography>
    <Title level={2} className="m-0 text-text">
      <span className="font-medium">Unofficial Healthy Gamer GG </span>
      <span className="font-bold text-primary">Video Search Engine</span>
    </Title>
  </Typography>
);

const ResultsContent = ({ 
  loading, 
  errorMessage, 
  results, 
  rateValue, 
  handleRateChange 
}: { 
  loading: boolean;
  errorMessage: string;
  results: Video[];
  rateValue: number | null;
  handleRateChange: (value: number) => void;
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spin size="large" tip="Searching videos..." />
      </div>
    );
  }
  
  if (errorMessage) {
    return <Alert message="Error" description={errorMessage} type="error" showIcon />;
  }
  
  if (!results.length) {
    return <DescriptionSection />;
  }

  return (
    <ResultsRenderer 
      results={results} 
      rateValue={rateValue} 
      handleRateChange={handleRateChange} 
    />
  );
};

const DescriptionSection = () => (
  <Card className="mt-4 backdrop-blur-2xl bg-layer1/50">
    <Space direction="vertical" size="middle">
      <Paragraph className="text-lg text-text">
        Welcome to the Unofficial Healthy Gamer GG Search Engine, a dedicated
        tool designed by fans for fans. This platform allows you to navigate
        through the extensive content of Dr. K&apos;s videos to find specific
        advice, insights, and discussions tailored to your mental health and
        wellness needs.
      </Paragraph>
      
      <Space>
        <Button 
          type="primary" 
          className="bg-primary hover:bg-primary/90"
        >
          Support
        </Button>
        <Button 
          type="default"
          className="border-primary text-primary hover:border-primary/80 hover:text-primary/80"
        >
          Share feedback
        </Button>
      </Space>
    </Space>
  </Card>
);
