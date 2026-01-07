export type Page = {
  slug: string;
  title: string;
  navTitle?: string;
  description?: string;
  content: string;
  lastModified?: string;
  effectiveDate?: string;
  showInHeader?: boolean;
  headerOrder?: number;
  footerColumn?: "none" | "company" | "contact" | "legal";
  footerOrder?: number;
};
