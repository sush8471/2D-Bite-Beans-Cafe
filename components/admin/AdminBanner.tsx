type AdminBannerProps = {
  tone?: 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
};

export default function AdminBanner({ tone = 'error', title, children }: AdminBannerProps) {
  return (
    <div className={`admin-banner admin-banner--${tone}`}>
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </div>
  );
}
