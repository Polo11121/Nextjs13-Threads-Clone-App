import * as z from "zod";

export const CommentValidator = z.object({
  text: z.string().nonempty().min(3, {
    message: "Thread must be at least 3 characters long",
  }),
});

export type CommentValidatorType = z.infer<typeof CommentValidator>;
