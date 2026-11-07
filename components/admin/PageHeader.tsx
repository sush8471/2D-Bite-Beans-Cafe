import Link from 'next/link';

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export default function PageHeader({
  title,
  description,
  children,
  backHref,
  backLabel = 'Back',
}: PageHeaderProps) {
  return (
    <div className="admin-page-head">
      <div>
        {backHref ? (
          <Link href={backHref} className="admin-back">
            ← {backLabel}
          </Link>
        ) : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children ? <div className="admin-page-head__actions">{children}</div> : null}
    </div>
  );
}
