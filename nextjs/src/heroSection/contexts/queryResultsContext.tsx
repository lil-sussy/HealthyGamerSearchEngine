"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/trpc/react";
import { Video } from "../types/Video";

interface QueryResultsProviderProps {
  children: ReactNode;
}

interface QueryResultsContextType {
  handleSubmit: (userPrompt: string) => Promise<void>;
  loading: boolean;
  results: Video[];
  error: string | null;
}

// Create the context with a default undefined value
const QueryResultsContext = createContext<QueryResultsContextType | undefined>(undefined);

export const QueryResultsProvider: React.FC<QueryResultsProviderProps> = ({
  children,
}) => {
  const postQueryMutation = api.hgg.query.useMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Video[]>([]);
  
  const handleSubmit = async (userPrompt: string) => {
    setLoading(true);
    try {
      const results = await postQueryMutation.mutateAsync({ query: userPrompt });
      setResults(results);
    } catch (error) {
      console.error("Error submitting query:", error);
      setError("An error occurred while submitting the query.");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    handleSubmit,
    loading,
    results,
    error,
  };

  return (
    <QueryResultsContext.Provider value={value}>
      {children}
    </QueryResultsContext.Provider>
  );
};

// Custom hook to use the query results context
export const useQueryResults = (): QueryResultsContextType => {
  const context = useContext(QueryResultsContext);
  if (context === undefined) {
    throw new Error(
      "useQueryResults must be used within a QueryResultsProvider",
    );
  }
  return context;
};
