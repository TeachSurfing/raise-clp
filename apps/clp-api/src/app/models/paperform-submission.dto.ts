export interface PaperformSubmissionDto {
  data: Data[];
  form_id: string;
  slug: string;
  submission_id: string;
  created_at: string;
  ip_address: string;
  charge: Charge;
  team_id: number;
  device: Device;
}

export interface PaperformFormDto {
  title: string;
  description?: string;
  type: PaperFormQuestionType;
  key: string;
  custom_key: any;
  value: any;
  options?: string[];
}

export interface Data {
  title: string;
  description?: string;
  type: PaperFormQuestionType;
  key: string;
  custom_key: any;
  value: any;
}

export interface Charge {
  products: any[];
  summary: string;
  discount: number;
  discounted_subscriptions: any[];
  coupon: boolean;
  total: number;
  total_cents: number;
  tax: number;
  tax_percentage: number;
  processing_fee: number;
  authorize: any;
  receipt_email: boolean;
}

export interface Device {
  type: string;
  device: boolean;
  platform: string;
  browser: string;
  embedded: boolean;
  url: string;
  user_agent: string;
  utm_source: any;
  utm_medium: any;
  utm_campaign: any;
  utm_term: any;
  utm_content: any;
  ip_address: string;
}

export enum PaperFormQuestionType {
  'text' = 'text',
  'email' = 'email',
  'url' = 'url',
  'yesNo' = 'yesNo',
  'color' = 'color',
  'number' = 'number',
  'phone' = 'phone',
  'address' = 'address',
  'country' = 'country',
  'appointment' = 'appointment',
  'date' = 'date',
  'time' = 'time',
  'scale' = 'scale',
  'slider' = 'slider',
  'choices' = 'choices',
  'dropdown' = 'dropdown',
  'image' = 'image',
  'file' = 'file',
  'signature' = 'signature',
  'price' = 'price',
  'products' = 'products',
  'subscriptions' = 'subscriptions',
  'calculations' = 'calculations',
  'hidden' = 'hidden',
  'rank' = 'rank',
  'rating' = 'rating',
  'matrix' = 'matrix',
}
