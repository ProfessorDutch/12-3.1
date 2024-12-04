import { z } from 'zod';

export const businessFormSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  contact_email: z.string().email('Valid email is required'),
  church: z.string().nullable(),
  business_name: z.string().min(2, 'Business name is required'),
  business_address: z.string().min(5, 'Business address is required'),
  website: z.string().nullable().transform(val => 
    val ? val.replace(/^https?:\/\//, '').trim() : null
  ),
  business_description: z.string().min(10, 'Please provide a description of at least 10 characters').transform(val => val.trim())
});

export const validateBusinessForm = async (data: unknown) => {
  try {
    const validatedData = await businessFormSchema.parseAsync(data);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      console.error('Validation errors:', errors);
      return { errors };
    }
    throw error;
  }
};