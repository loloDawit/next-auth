import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TwoFactorSchema } from '@/schemas';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import LoadingButton from '../loading-button';

interface TwoFactorFormProps {
  onSubmit: (data: z.infer<typeof TwoFactorSchema>) => void;
  error: string | undefined;
  success: string | undefined;
  loading: boolean;
  isPending: boolean;
}

export const TwoFactorForm = ({
  onSubmit,
  error,
  success,
  loading,
  isPending,
}: TwoFactorFormProps) => {
  const form = useForm<z.infer<typeof TwoFactorSchema>>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: { code: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <FormSuccess message={success} />
        <LoadingButton
          type="submit"
          size="lg"
          className="w-full"
          isLoading={loading}
          loadingText="Please wait"
          defaultText="Confirm"
          disabled={isPending}
        />
      </form>
    </Form>
  );
};
