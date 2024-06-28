'use client';

import { newVerificationToken } from '@/actions/verification';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { BarLoader } from 'react-spinners';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const didRun = useRef(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (didRun.current) {
      return;
    }
    didRun.current = true;

    if (!token) {
      setError('No verification token found. Please try again.');
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await newVerificationToken(token);
        if (response.error) {
          setError(response.error);
        } else if (response.success) {
          setSuccess(response.success);
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const headerLabel = loading
    ? 'Confirming your verification'
    : error
      ? 'Error verifying your email'
      : 'Verification Successful';

  return (
    <CardWrapper
      headerLabel={headerLabel}
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        <BarLoader loading={loading} />
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
