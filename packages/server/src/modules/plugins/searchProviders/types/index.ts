export interface SearchResult extends MainImage {
  duplicates: Image[];
}

interface MainImage extends BaseImage {
  caption: string;
  sizeInBytes?: number;
}

interface Image extends BaseImage {
  sizeInBytes: number;
}

interface BaseImage {
  url: string;
  width: number;
  height: number;
}
