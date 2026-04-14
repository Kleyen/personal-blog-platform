export interface User {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  is_published: boolean;
  author: User;
  created_at: string;
  updated_at: string | null;
}

export type PostSummary = Omit<Post, "content">;

export interface Comment {
  id: number;
  body: string;
  author: User;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}
