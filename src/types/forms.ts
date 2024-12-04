import { z } from 'zod';

export const ambassadorFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  church: z.string().optional(),
  commitments: z.array(z.string()).min(1, 'Select at least one commitment'),
  socialPlatforms: z.array(z.string()),
  engagementLevel: z.enum(['daily', 'weekly', 'monthly'])
});

export const businessFormSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  website: z.string().url().optional(),
  address: z.string().min(5, 'Address is required'),
  description: z.string().min(10, 'Business description is required'),
  supportType: z.array(z.string()).min(1, 'Select at least one support type'),
  engagementLevel: z.string()
});

export const subscriberFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  tier: z.enum(['seed', 'growth', 'harvest']),
  paymentMethod: z.string(),
  billingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zip: z.string().min(5, 'ZIP code is required')
  })
});

export type AmbassadorFormData = z.infer<typeof ambassadorFormSchema>;
export type BusinessFormData = z.infer<typeof businessFormSchema>;
export type SubscriberFormData = z.infer<typeof subscriberFormSchema>;