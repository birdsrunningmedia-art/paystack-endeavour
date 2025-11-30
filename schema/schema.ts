import { z } from "zod";

export const paymentSchema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Amount must be a number",
    })
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: "Amount must be positive" })
    .refine((val) => val >= 100, { message: "Minimum amount is 100" })
    .refine((val) => val <= 1000000, { message: "Maximum amount is 1000000" }),
});
