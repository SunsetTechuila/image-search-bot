import type { SearchResult } from "shared/types";

export interface SearchAdapter {
  search(query: string, page?: number): Promise<SearchResult[]>;
}
