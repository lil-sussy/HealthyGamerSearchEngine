import { Button, Input, Spin, InputRef, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useEffect, useRef } from "react";


interface SearchFormProps {
  query: string;
  loading: boolean;
  isExpanded: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchForm = ({
  query,
  loading,
  isExpanded,
  onSubmit,
  onInputChange,
}: SearchFormProps) => {
  const textAreaRef = useRef<InputRef>(null);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (isExpanded) {
      textAreaRef.current?.focus();
    }
  }, [isExpanded]);

  return (
    <div className="group relative flex flex-col items-end gap-4">
      <form
        className={clsx(
          "search-form flex w-full flex-col items-end gap-4 sm:flex-row",
        )}
        onSubmit={onSubmit}
      >
        <div className="flex w-full flex-col gap-2">
          {!isExpanded ? (
            <Input
              ref={inputRef}
              className={clsx("w-full flex-grow transition-all duration-300")}
              size="large"
              placeholder="What's on your mind..."
              value={query}
              onChange={onInputChange}
              disabled={loading}
            />
          ) : (
            <Input.TextArea
              ref={textAreaRef}
              className={clsx("w-full flex-grow transition-all duration-300")}
              size="large"
              placeholder="What's on your mind..."
              value={query}
              onChange={(e) =>
                onInputChange(
                  e as unknown as React.ChangeEvent<HTMLInputElement>,
                )
              }
              disabled={loading}
            />
          )}
        </div>

        <Button
          className="search-button mb-1 w-full bg-primary p-4 hover:bg-primary/90 sm:w-24"
        type="primary"
          htmlType="submit"
          icon={loading ? <Spin /> : <SearchOutlined />}
          disabled={loading}
        >
          Search
        </Button>
      </form>
      <Alert
        message="Describe how you feel using one or multiple sentences <3"
        type="info"
        className="w-full text-xs opacity-0 transition-all duration-300 group-hover:h-auto group-hover:opacity-100"
        showIcon
      />
    </div>
  );
};
