export interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  sources?: Source[];
  timestamp: Date;
  isUser: boolean;
  isLoading?: boolean;
}

export interface Source {
  title: string;
  url: string;
  domain: string;
  type: 'web' | 'document';
  snippet?: string;
}

export interface ChatResponse {
  response: string;
  sources: Source[];
  session_id: string;
  timestamp: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

export interface SearchSettings {
  includeWebSearch: boolean;
  includeLocalSearch: boolean;
  maxResults: number;
  medicalDomainsOnly: boolean;
}

export interface WebSocketMessage {
  type: 'chat' | 'status' | 'response' | 'error';
  message?: string;
  data?: any;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}
