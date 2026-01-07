export type ExternalLink = {
  slug: string;
  title: string;
  url: string;
  footerColumn: "company" | "resources" | "contact" | "none";
  order?: number;
  description?: string;
};
