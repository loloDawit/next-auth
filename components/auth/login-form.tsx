'use client';

import { useState, useTransition } from 'react';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { CardWrapper } from './card-wrapper';
import { InitialLoginForm } from './initial-login-form';
import { TwoFactorForm } from './2FA-form';
import { login, verifyOtp } from '@/actions/login';
import { LoginSchema, TwoFactorSchema } from '@/schemas';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const errorUrl =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'An account exists with the same e-mail'
      : '';
  const [isPending, startTransition] = useTransition();
  const [shouldShow2FA, setShouldShow2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | undefined>('');
  const [error, setError] = useState<string | undefined>('');
  const [email, setEmail] = useState<string | undefined>('');
  const [password, setPassword] = useState<string | undefined>('');

  type InitialLoginResponse =
    | { error: string; success?: undefined; twoFactorTokenSent?: undefined }
    | { success: string; error?: undefined; twoFactorTokenSent?: undefined }
    | { success: string; twoFactorTokenSent: boolean; error?: undefined }
    | undefined;

  type TwoFactorResponse =
    | { error: string; success?: undefined }
    | { success: string; error?: undefined }
    | undefined;

  const handleInitialSubmit = (data: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');
    setLoading(true);

    const handleResponse = (response: InitialLoginResponse) => {
      if (response?.error) {
        setError(response.error);
      } else if (response?.success) {
        setSuccess(response.success);
      }

      if (response?.twoFactorTokenSent) {
        setEmail(data.email);
        setPassword(data.password);
        setShouldShow2FA(true);
      }
    };

    const handleError = (error: unknown) => {
      console.error(error);
      setError('An error occurred');
    };

    startTransition(() => {
      login(data)
        .then(handleResponse)
        .catch(handleError)
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleTwoFactorSubmit = (data: z.infer<typeof TwoFactorSchema>) => {
    setError('');
    setSuccess('');
    setLoading(true);

    console.log(data); // Log the data to see what is being submitted

    const handleResponse = (response: TwoFactorResponse) => {
      if (response?.error) {
        setError(response.error);
      } else if (response?.success) {
        setSuccess(response.success);
      }
    };

    const handleError = (error: unknown) => {
      console.error(error);
      setError('An error occurred');
    };

    startTransition(() => {
      if (email && password) {
        verifyOtp(email, password, data)
          .then(handleResponse)
          .catch(handleError)
          .finally(() => {
            setLoading(false);
          });
      } else {
        setError('Email or password is missing');
        setLoading(false);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account?"
      showSocial
    >
      {shouldShow2FA ? (
        <TwoFactorForm
          onSubmit={handleTwoFactorSubmit}
          error={error}
          success={success}
          loading={loading}
          isPending={isPending}
        />
      ) : (
        <InitialLoginForm
          onSubmit={handleInitialSubmit}
          error={error || errorUrl}
          success={success}
          loading={loading}
          isPending={isPending}
        />
      )}
    </CardWrapper>
  );
};
