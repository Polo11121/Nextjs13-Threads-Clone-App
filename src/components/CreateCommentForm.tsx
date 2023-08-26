"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form";
import { useForm } from "react-hook-form";
import {
  CommentValidator,
  CommentValidatorType,
} from "@/lib/validators/comment";
import { Input } from "@/components/ui/Input";
import { usePathname, useRouter } from "next/navigation";
import { addComment } from "@/lib/actions/thread.actions";
import Image from "next/image";

interface CreateCommentFormProps {
  threadId: string;
  currentUserId: string;
  currentUserImage: string;
}

export const CreateCommentForm = ({
  threadId,
  currentUserId,
  currentUserImage,
}: CreateCommentFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<CommentValidatorType>({
    resolver: zodResolver(CommentValidator),
    defaultValues: {
      text: "",
    },
  });

  const submitHandler = async (values: CommentValidatorType) => {
    await addComment({
      author: JSON.parse(currentUserId),
      parentId: JSON.parse(threadId),
      text: values.text,
      pathname,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center w-full">
              <FormLabel>
                <Image
                  alt="Profile Image"
                  src={currentUserImage}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="comment-form_btn" type="submit">
          Reply
        </Button>
      </form>
    </Form>
  );
};
