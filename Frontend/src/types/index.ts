export type Category = 'image' | 'video' | 'website';

export interface Prompt {
  id: number;
  title: string;
  description: string;
  category: Category;
  preview_url: string;
  ai_tool: string;
  tags: string[];
  is_featured: boolean;
  is_free: boolean;
  created_at: string;
  accessible: boolean;
  prompt_preview: string;
  prompt_text: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_pro: boolean;
}
