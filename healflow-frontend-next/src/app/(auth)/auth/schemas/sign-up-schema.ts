import z from "zod";

const passwordChecks = [
	{ test: /[A-Z]/, message: "Password needs an uppercase letter" },
	{ test: /[a-z]/, message: "Password needs a lowercase letter" },
	{ test: /[0-9]/, message: "Password needs a number" },
	{
		test: /[!@#$%^&*()\_\-+=\[\]{};':"\\|,.<>\/?~]/,
		message: "Password needs a special character",
	},
];

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.superRefine((pwd, ctx) => {
		passwordChecks.forEach(({ test, message }) => {
			if (!test.test(pwd)) {
				ctx.addIssue({
					code: "custom",
					message,
					path: [],
				});
			}
		});
	});

export const signUpSchema = z
	.object({
		firstName: z
			.string()
			.nonempty("First name cannot be empty")
			.nonoptional("First name is required"),
		lastName: z
			.string()
			.nonempty("Last name cannot be empty")
			.nonoptional("Last name is required"),
		email: z
			.email("It must be a valid email")
			.nonempty("Email cannot be empty")
			.nonoptional("Email is required"),
		password: passwordSchema,
		confirmPassword: passwordSchema,
		profileImage: z.file("It must be a valid image").optional(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				message: "Passwords don’t match",
				path: ["confirmPassword"],
			});
		}
	});

export type SignUpSchema = z.infer<typeof signUpSchema>;
