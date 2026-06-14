export interface CategorySearchMatch {
  type: "category";
}

export interface PastaSearchMatch {
  type: "pasta";
  start: number;
  end: number;
}

export type SearchMatch = CategorySearchMatch | PastaSearchMatch;
