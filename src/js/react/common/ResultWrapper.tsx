import type { ReactNode } from 'react';
import { GhostList } from './GhostList';

type ResultWrapperProps = { className?: string; children?: ReactNode; loading: boolean };

const ResultWrapper = ({ className, children, loading }: ResultWrapperProps) => (
  <div className={`hdbt__loading-wrapper${className ? ` ${className}` : ''}`}>
    {loading && <GhostList count={1} />}
    {children}
  </div>
);

export default ResultWrapper;
