import { z } from 'zod'

export const schemaRules = {
  email: z.string().email({ message: Drupal.t('Must be a valid email') }),
  phone: z.string().min(1, { message: Drupal.t('Must be a valid phone number') }),
}
