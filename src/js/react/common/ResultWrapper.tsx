import { ReactNode } from 'react';
import LoadingOverlay from './LoadingOverlay';

type ResultWrapperProps = {
  className?: string;
  children?: ReactNode
  loading: boolean;
};

const ResultWrapper = ({ className, children, loading }: ResultWrapperProps) => (
    <div
      className={`hdbt__loading-wrapper ${className || ''}`}
    >
      {loading && <LoadingOverlay />}
      {children}
    </div>
  );

export default ResultWrapper;
