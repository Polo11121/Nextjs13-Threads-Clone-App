"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { useForm } from "react-hook-form";
import { ThreadValidator, ThreadValidatorType } from "@/lib/validators/thread";
import { Textarea } from "@/components/ui/Textarea";
import { usePathname, useRouter } from "next/navigation";
import { createThread } from "@/lib/actions/thread.actions";

interface CreateThreadFormProps {
  userId: string;
}

export const CreateThreadForm = ({ userId }: CreateThreadFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<ThreadValidatorType>({
    resolver: zodResolver(ThreadValidator),
    defaultValues: {
      author: userId,
      text: "",
    },
  });

  const submitHandler = async (values: ThreadValidatorType) => {
    await createThread({
      ...values,
      pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={15}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-primary-500 hover:bg-primary-500 hover:opacity-80"
          type="submit"
        >
          Post Thread
        </Button>
      </form>
    </Form>
  );
};
