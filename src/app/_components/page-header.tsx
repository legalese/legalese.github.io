type Props = {
  title: string;
};

export function PageHeader({ title }: Props) {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
        {title}
      </h1>
    </div>
  );
}
