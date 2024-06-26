"use client";

import { ChangeEvent, useState } from "react";
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
import { Input } from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { UserValidator, UserValidatorType } from "@/lib/validators/user";
import { Textarea } from "@/components/ui/Textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/useUploadThing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface AccountProfileFormProps {
  user: {
    id: string;
    objectId?: string;
    username: string | null;
    name: string;
    bio: string;
    image: string;
  };
  buttonText: string;
}

export const AccountProfileForm = ({
  user,
  buttonText,
}: AccountProfileFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<UserValidatorType>({
    resolver: zodResolver(UserValidator),
    defaultValues: {
      profile_photo: user.image || "",
      username: user.username || "",
      name: user.name || "",
      bio: user.bio || "",
    },
  });

  const uploadHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const fileReader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      setFiles(Array.from(event.target.files));

      if (!file.type.includes("image")) {
        return;
      }

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        form.setValue("profile_photo", imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const submitHandler = async (values: UserValidatorType) => {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        form.setValue("profile_photo", imgRes[0].url);
      }
    }

    await updateUser({
      userId: user.id,
      pathname,
      ...values,
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    priority
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={uploadHandler}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input className="account-form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input className="account-form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
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
          {buttonText}
        </Button>
      </form>
    </Form>
  );
};
