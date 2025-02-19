import React, { useState } from "react";
import { Button, message, Spin, Typography } from "antd";
import { SearchForm } from "./components/SearchForm";
import { ResultsRenderer } from "./components/ResultsRenderer";
import { Spinner } from "@/components/Spinner";
import { queryVideos, submitFeedback } from "@/lib/requests";
import type { Video } from "@/types/Video";
import Logo from "@/components/Logo";

const { Text } = Typography;

interface HeroSectionProps {
  idToken: string;
}

export const HeroSection = ({ idToken }: HeroSectionProps) => {
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
    const [data, error] = await queryVideos(query, idToken);
    setLoading(false);

    if (error) {
      setResponseMessage(error);
      message.error("An error occurred while fetching data.");
    } else {
      setResponseMessage("");
      setResults(data || []);
    }
  };

  const handleRateChange = async (value: number) => {
    setRateValue(value);
    const [result, error] = await submitFeedback(
      query,
      value,
      JSON.stringify({ results })
    );
    
    if (error) {
      message.error("Failed to submit feedback.");
    } else {
      message.success("Thank you for your feedback!");
    }
  };

  return (
    <div className="hero-container centering box-border flex w-full flex-col items-center">
      <div className="content-container container flex flex-col items-start justify-center gap-16 rounded-2xl !pt-40 backdrop-blur-2xl md:flex-row">
        {/* Image and Logo Section */}
        <div className="image-container relative pt-20">
          <img 
            className={loading ? "w-40" : "w-80"} 
            src={loading ? "./drkThinking.png" : "./drkStaring.png"} 
            alt={loading ? "Loading" : "Loaded"} 
          />
          <div className="logo-container absolute left-[-30%] top-[-20%] z-20">
            <Logo />
          </div>
        </div>

        {/* Main Content Section */}
        <div className="main-content flex w-40 flex-col items-start gap-10 md:w-[30rem]">
          <Header />
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
        </div>
      </div>

      <ResultsContent
        loading={loading}
        errorMessage={responseMessage}
        results={results}
        rateValue={rateValue}
        handleRateChange={handleRateChange}
      />
    </div>
  );
};

const Header = () => (
  <div className="title-container w-full md:w-80">
    <span className="text-shadow-lg text-4xl font-medium">
      Unofficial Healthy Gamer GG{" "}
    </span>
    <span className="text-shadow-lg text-4xl font-bold text-green-500">
      Video Search Engine
    </span>
  </div>
);

const ResultsContent = ({ loading, errorMessage, results, rateValue, handleRateChange }: { 
  loading: boolean;
  errorMessage: string;
  results: Video[];
  rateValue: number | null;
  handleRateChange: (value: number) => void;
}) => {
  if (loading) return <Spinner />;
  if (errorMessage) return <ErrorMessage message={errorMessage} />;
  if (!results.length) return <DescriptionSection />;

  return <ResultsRenderer 
    results={results} 
    rateValue={rateValue} 
    handleRateChange={handleRateChange} 
  />;
};

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="error-message w-full rounded-lg bg-red-200 p-4 text-red-700">
    {message}
  </div>
);

const DescriptionSection = () => (
  <div className="description-section flex flex-col gap-5 pl-20">
    <div className="description-text text-lg font-medium">
      Welcome to the Unofficial Healthy Gamer GG Search Engine, a dedicated
      tool designed by fans for fans. This platform allows you to navigate
      through the extensive content of Dr. K&apos;s videos to find specific
      advice, insights, and discussions tailored to your mental health and
      wellness needs.
    </div>
    <div className="button-group flex gap-2">
      <Button className="bg-green-200 hover:bg-green-400" type="default">
        Donate
      </Button>
      <Button className="border border-green-500" type="default">
        Share feedback
      </Button>
    </div>
  </div>
);
