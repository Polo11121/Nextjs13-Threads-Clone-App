import * as z from "zod";

export const ThreadValidator = z.object({
  text: z.string().nonempty().min(3, {
    message: "Thread must be at least 3 characters long",
  }),
  author: z.string().nonempty(),
});

export type ThreadValidatorType = z.infer<typeof ThreadValidator>;
