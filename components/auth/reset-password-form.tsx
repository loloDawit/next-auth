'use client';

import {
  resetPasswordUsingTokenVerification,
  verifyPasswordResetToken,
} from '@/actions/verification';
import * as z from 'zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { Input } from '@/components/ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useRef, useTransition } from 'react';
import { BarLoader } from 'react-spinners';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { ForgotPasswordSchema } from '@/schemas';
import { Button } from '../ui/button';

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [shouldShowLogin, setShouldShowLogin] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<{ success: string; status: boolean }>({
    success: '',
    status: false,
  });
  const didRun = useRef(false);
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

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
        const response = await verifyPasswordResetToken(token);
        if (response.error) {
          setError(response.error);
        } else if (response.status) {
          setSuccess({ success: response.success, status: true });
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = (data: z.infer<typeof ForgotPasswordSchema>) => {
    if (shouldShowLogin) {
      router.push('/auth/login');
      return;
    }

    if (!success.status) {
      setError('You cannot submit the form at this time.');
      return;
    }
    setSuccess({ success: '', status: false });
    startTransition(() => {
      if (token) {
        resetPasswordUsingTokenVerification(data, token)
          .then((response) => {
            if (response.error) {
              setError(response.error);
            } else if (response.status) {
              setSuccess({ success: response.success, status: true });
              setShouldShowLogin(true);
            }
          })
          .catch((err) => {
            setError(err || 'An unexpected error occurred during password reset.');
          });
      } else {
        setError('No verification token found. Please try again.');
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonHref="/auth/register"
      backButtonLabel="Back to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="********" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="********" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success.success} />
          <Button type="submit" size="lg" className="w-full" disabled={loading || !success.status}>
            {loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : shouldShowLogin ? (
              'Back to Login'
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;
