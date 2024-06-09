'use server';

import { LoginSchema } from '@/schemas';
import * as z from 'zod';

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: 'invalid data' };
  }

  return { success: 'data' };
};
