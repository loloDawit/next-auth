'use client';

import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  children: React.ReactNode;
  mode: 'modal' | 'redirect';
  asChild: boolean;
}

const LoginButton = ({ children, mode = 'redirect', asChild = false }: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    console.log('LoginButton clicked');
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return <span>TODO</span>;
  }
  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};

export default LoginButton;
