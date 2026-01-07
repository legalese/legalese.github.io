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
  footerColumn?: "company" | "resources" | "contact" | "legal" | "none";
  footerOrder?: number;
};
