import { z } from 'zod';

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  identifier: z.string().superRefine((val, ctx) => {
    if (val.includes('@')) {
      if (!regex.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid email format',
          input: val,
        });
      }
    } else if (val.length <= 3) {
      ctx.addIssue({
        code: 'custom',
        message: 'Identifier too short',
        input: val,
      });
    }
  }),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;
