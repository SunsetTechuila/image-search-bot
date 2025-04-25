export interface SearchResult extends BaseImage {
  caption: string;
  sizeInBytes?: number;
  duplicates: ({ sizeInBytes: number } & BaseImage)[];
}

interface BaseImage {
  url: string;
  width: number;
  height: number;
}
