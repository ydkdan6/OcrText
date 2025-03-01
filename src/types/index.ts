export interface User {
  id: string;
  email: string | null;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface OCRResult {
  id: string;
  user_id: string;
  image_url: string;
  extracted_text: string;
  created_at: string;
  file_name?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}