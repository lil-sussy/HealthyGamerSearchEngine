"use client";
import React, { useState } from "react";
import { Button, Spin, Typography, Row, Col, Space, Card, Empty, Alert, Rate } from "antd";
import { SearchForm } from "./components/SearchForm";
import { ResultsRenderer } from "./components/ResultsRenderer";
import type { Video } from "@/heroSection/types/Video";
import { MainImage } from "./components/MainImage";
import MainTitle from "./components/MainTitle";
import DescriptionSection from "./components/DescriptionSection";
import { useQueryResults } from "./contexts/queryResultsContext";


const { Title, Paragraph } = Typography;

export const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [rateValue, setRateValue] = useState<number | null>(null);
  const { loading, handleSubmit: handleSubmitQuery, results, error } = useQueryResults();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await handleSubmitQuery(query);
  };

  const handleRateChange = async (value: number) => {
    setRateValue(value);
    // Handle rating submission logic here
  };

  return (
    <div className="relative w-full">
      <Row justify="center" align="middle" className="pt-20 md:pb-0 p-4">
        <Col xs={24} md={20} lg={18}>
          <Card className="bg-layer1/50 backdrop-blur-2xl">
            <Row gutter={[32, 32]} align="middle">
              {/* Logo and Image Section */}
              <Col xs={24} sm={10} className="relative">
                <MainImage loading={loading} />
              </Col>

              {/* Content Section */}
              <Col xs={24} sm={0} md={14}>
                <Space direction="vertical" size="large" className="w-full">
                  <MainTitle />
                  {!isExpanded && (
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
                  )}
                </Space>
              </Col>
              <Col xs={0} sm={14} md={0}>
                <Space direction="vertical" size="large" className="w-full">
                  <MainTitle />
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

      <Row justify="center" className="mt-8 md:p-0 p-4">
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


