export type ExternalLink = {
  slug: string;
  title: string;
  navTitle?: string;
  url: string;
  footerColumn: "company" | "resources" | "contact" | "legal" | "none";
  showInHeader?: boolean;
  headerOrder?: number;
  order?: number;
  description?: string;
};
