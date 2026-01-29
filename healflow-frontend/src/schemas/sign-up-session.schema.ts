import * as z from "zod";
import { signUpBaseSchema } from "@/schemas/sing-up.schema";
import { userDataSchema } from "@/schemas/user-data.schema";
import { paymentInfoSchema } from "@/schemas/payment-info.schema";
import { signUpState } from "@/types/auth";

export const signUpSession = z.object({
  accountData: signUpBaseSchema
    .partial({ password: true, confirmPassword: true })
    .extend({
      profileImageRef: z.string().optional(),
    })
    .optional(),
  socialSignOnData: z.any().optional(),
  userData: userDataSchema.optional(),
  paymentInfo: paymentInfoSchema.optional(),
  state: z.enum(signUpState).optional(),
  createdUserId: z.string().optional(),
});

export const serializableSignUpSession = z.object({
  accountData: signUpBaseSchema
    .omit({ profileImage: true })
    .partial({ password: true, confirmPassword: true })
    .extend({
      profileImageRef: z.string().optional(),
    })
    .optional(),
  socialSignOnData: z.any().optional(),
  userData: userDataSchema.optional(),
  paymentInfo: paymentInfoSchema.optional(),
  state: z.enum(signUpState).optional(),
  createdUserId: z.string().optional(),
});
