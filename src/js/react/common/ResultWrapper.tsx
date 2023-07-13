import { ReactNode } from 'react';
import LoadingOverlay from './LoadingOverlay';

type ResultWrapperProps = {
  className?: string;
  children?: ReactNode
  loading: boolean;
};

const ResultWrapper = ({ className, children, loading }: ResultWrapperProps) => (
    <div
      aria-live='polite'
      className={`hdbt__loading-wrapper ${className}`}
      role='region'
    >
      {loading && <LoadingOverlay />}
      {children}
    </div>
  );

export default ResultWrapper;
