'use server';

import { RegisterSchema } from '@/schemas';
import * as z from 'zod';

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const validatedData = RegisterSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: 'invalid data' };
  }

  return { success: 'data' };
};
