export type ExternalLink = {
  slug: string;
  title: string;
  url: string;
  footerColumn: "company" | "resources" | "contact";
  order?: number;
  description?: string;
};
