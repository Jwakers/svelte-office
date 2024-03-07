export type ProductReviewsResponse = {
  status: Status;
  response: Response;
};

export type Response = {
  pagination: Pagination;
  bottomline: Bottomline;
  products: Product[];
  product_tag: any[];
  reviews: Review[];
};

export type Bottomline = {
  total_review: number;
  average_score: number;
  star_distribution: { [key: string]: number };
  custom_fields_bottomline: null;
};

export type Pagination = {
  page: number;
  per_page: number;
  total: number;
};

export type Product = {
  id: number;
  domain_key: string;
  name: string;
  social_links: SocialLinks;
  embedded_widget_link: string;
  testimonials_product_link: string;
  product_link: string;
};

export type SocialLinks = {
  facebook: string;
  twitter: string;
  linkedin: string;
  google_oauth2: string;
};

export type Review = {
  id: number;
  score: number;
  votes_up: number;
  votes_down: number;
  content: string;
  title: string;
  sentiment: number;
  created_at: Date;
  verified_buyer: boolean;
  source_review_id: null;
  custom_fields: null;
  product_id: number;
  is_incentivized: boolean;
  incentive_type: string;
  images_data: ImagesDatum[];
  user: User;
  comment: Comment;
};

export type Comment = {
  id: number;
  content: string;
  created_at: Date;
  comments_avatar: null;
};

export type ImagesDatum = {
  id: number;
  thumb_url: string;
  original_url: string;
};

export type User = {
  user_id: number;
  display_name: string;
  social_image: string;
  user_type: string;
  is_social_connected: number;
};

export type Status = {
  code: number;
  message: string;
};
