import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import LoadingButton from '../loading-button';
import Link from 'next/link';

type InitialLoginResponse =
  | { error: string; success?: undefined; twoFactorTokenSent?: undefined }
  | { success: string; error?: undefined; twoFactorTokenSent?: undefined }
  | { twoFactorTokenSent: boolean; success?: undefined; error?: undefined }
  | undefined;

interface InitialLoginFormProps {
  onSubmit: (data: z.infer<typeof LoginSchema>) => void;
  error: string | undefined;
  success: string | undefined;
  loading: boolean;
  isPending: boolean;
}

export const InitialLoginForm = ({
  onSubmit,
  error,
  success,
  loading,
  isPending,
}: InitialLoginFormProps) => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="your email here"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="********" type="password" />
                </FormControl>
                <Button size="sm" variant="link" asChild className="px-0 font-normal">
                  <Link href="/auth/reset">Forgot password?</Link>
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <LoadingButton
          type="submit"
          size="lg"
          className="w-full"
          isLoading={loading}
          loadingText="Please wait"
          defaultText="Login"
          disabled={isPending}
        />
      </form>
    </Form>
  );
};
