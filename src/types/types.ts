export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}





export type DatabaseUser = {
  avatar_url?: null | string
  billing_address?: null | string
  email: string
  full_name?: null | string
  id: string
  payment_method?: null | string
  verified: boolean
}

export const courseCategories = [
  "Business",
  "Marketing",
  "Design",
  "Technology",
  "social media",
  "Affiliate marketing",
  "SMMA",
  "copywriting ",
  "Self improvement",
  "Graphic design",
  "Dropshipping",
  "trading",
  "coding",
] as const;