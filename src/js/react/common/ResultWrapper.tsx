import { ReactNode } from 'react';
import LoadingOverlay from './LoadingOverlay';

type ResultWrapperProps = {
  className?: string;
  children?: ReactNode
  loading: boolean;
};

const insertClass = (className: string | undefined) => {
  if (!className) return '';
  return ` ${className}`;
};

const ResultWrapper = ({ className, children, loading }: ResultWrapperProps) => (
    <div
      className={`hdbt__loading-wrapper${insertClass(className)}`}
    >
      {loading && <LoadingOverlay />}
      {children}
    </div>
  );

export default ResultWrapper;
