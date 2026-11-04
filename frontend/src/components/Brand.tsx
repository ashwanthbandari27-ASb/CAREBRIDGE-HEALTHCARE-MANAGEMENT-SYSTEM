import { HeartPulse } from 'lucide-react';

type BrandProps = {
  light?: boolean;
};

export default function Brand({ light = false }: BrandProps) {
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`}>
      <div className="brand-mark">
        <HeartPulse size={25} />
      </div>
      <div>
        <b>CAREBRIDGE</b>
        <span>Connected healthcare</span>
      </div>
    </div>
  );
}
