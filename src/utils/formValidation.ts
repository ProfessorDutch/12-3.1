import { z } from 'zod';
import { ambassadorFormSchema, businessFormSchema, subscriberFormSchema } from '../types/forms';

export async function validateAmbassadorForm(data: unknown) {
  try {
    return await ambassadorFormSchema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))};
    }
    throw error;
  }
}

export async function validateBusinessForm(data: unknown) {
  try {
    return await businessFormSchema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))};
    }
    throw error;
  }
}

export async function validateSubscriberForm(data: unknown) {
  try {
    return await subscriberFormSchema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))};
    }
    throw error;
  }
}

export function getFormErrors(result: any) {
  if ('errors' in result) {
    return result.errors.reduce((acc: Record<string, string>, curr: { field: string; message: string }) => {
      acc[curr.field] = curr.message;
      return acc;
    }, {});
  }
  return null;
}