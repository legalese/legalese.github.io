type Props = {
  title: string;
  lastModified?: string;
  effectiveDate?: string;
};

export function PageHeader({ title, lastModified, effectiveDate }: Props) {
  return (
    <div className="mb-12">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
        {title}
      </h1>
      {(effectiveDate || lastModified) && (
        <div className="text-gray-500 text-sm">
          {effectiveDate && (
            <span>Effective: <strong>{effectiveDate}</strong></span>
          )}
          {effectiveDate && lastModified && <span className="mx-2">|</span>}
          {lastModified && (
            <span>Last modified: <strong>{lastModified}</strong></span>
          )}
        </div>
      )}
    </div>
  );
}
