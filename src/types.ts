export interface GifImage {
  size: string;
  url: string;
}

export interface Gif {
  title: string;
  id: string;
  images: {
    original: GifImage;
    downsized: GifImage;
    fixed_height_small: GifImage;
  };
}

export interface SearchResult {
  data: Gif[];
}
