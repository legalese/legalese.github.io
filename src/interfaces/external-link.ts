export type ExternalLink = {
  slug: string;
  title: string;
  url: string;
  footerColumn: "company" | "resources" | "contact" | "legal" | "none";
  order?: number;
  description?: string;
};
