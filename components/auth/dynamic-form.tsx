import React, { ReactNode } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

interface DynamicFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  children: ReactNode;
}

const DynamicForm = <T extends Record<string, any>>({ form, children }: DynamicFormProps<T>) => {
  return <FormProvider {...form}>{children}</FormProvider>;
};

export default DynamicForm;
