import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

export function PageContent({ content }: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
