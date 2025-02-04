import type { SearchResult } from "shared/types";

export default interface SearchAdapter {
  search(query: string, page?: number): Promise<SearchResult[]>;
}
