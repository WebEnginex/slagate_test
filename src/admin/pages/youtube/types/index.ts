/**
 * Types pour la gestion des liens YouTube
 */

export interface YoutubeLink {
  id: number;
  url: string;
  title?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface YoutubeLinkInput {
  url: string;
  title?: string;
  description?: string;
  is_active?: boolean;
}

export interface YoutubeLinkUpdate extends Partial<YoutubeLinkInput> {
  id: number;
}
