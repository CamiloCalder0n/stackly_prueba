export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  tags: string[];
  color: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  quote: string;
  avatarColor: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}
