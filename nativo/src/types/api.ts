export interface ApiError {
  title: string;
  status: number;
  detail: string;
  code?: string;
}