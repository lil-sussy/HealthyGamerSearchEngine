import { Button, Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import clsx from "clsx";

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
}: SearchFormProps) => (
  <form className="search-form flex w-full flex-col items-center gap-4 md:flex-row" onSubmit={onSubmit}>
    <Input
      className={clsx("flex-grow", isExpanded ? "w-full" : "w-64")}
      size="large"
      placeholder="What's on your mind..."
      value={query}
      onChange={onInputChange}
      disabled={loading}
    />
    <Button
      className="search-button !p-4"
      type="primary"
      htmlType="submit"
      icon={loading ? <Spin /> : <SearchOutlined />}
      disabled={loading}
    >
      Search :3
    </Button>
  </form>
); 