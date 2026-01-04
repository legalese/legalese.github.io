type Props = {
  content: string;
};

export function PageContent({ content }: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
