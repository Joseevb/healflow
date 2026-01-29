import * as z from "zod";

export const paymentInfoSchema = z.object({
  cardHolderName: z.string().min(1, "Card holder name is required"),
  cardNumber: z.string().regex(/^\d{13,19}$/, "Card number must be between 13 and 19 digits"),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Expiry month must be 01-12"),
  expiryYear: z.string().regex(/^\d{4}$/, "Expiry year must be 4 digits"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});
