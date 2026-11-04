import type { ReactNode } from 'react';
import { Plus, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: string;
}) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button className="btn primary">
          <Plus size={17} />
          {action}
        </button>
      )}
    </div>
  );
}

export function Stat({
  label,
  value,
  icon: Icon,
  color = 'blue',
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close dialog">
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
