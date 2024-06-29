import React from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText,
  defaultText,
  size,
  ...props
}) => {
  return (
    <Button
      {...props}
      size={size}
      className={`w-full ${props.className}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        defaultText
      )}
    </Button>
  );
};

export default LoadingButton;
