'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
const Social = () => {
  const handleClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button className="w-full" variant="outline" size="lg" onClick={() => handleClick('google')}>
        <FcGoogle className="w-f h-5" />
      </Button>
      <Button className="w-full" variant="outline" size="lg" onClick={() => handleClick('github')}>
        <FaGithub className="w-f h-5" />
      </Button>
    </div>
  );
};

export default Social;
