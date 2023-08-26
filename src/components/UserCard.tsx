"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

export const UserCard = ({ id, name, username, imgUrl }: UserCardProps) => {
  const router = useRouter();

  const pushHandler = () => router.push(`/profile/${id}`);

  return (
    <article className="user-card">
      <div className="user-card__avatar">
        <Image
          src={imgUrl}
          alt="logo"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex-1 text-ellipsis">
        <h4 className="text-base-semibold text-light-1">{name}</h4>
        <p className="text-small-medium text-gray-1">{username}</p>
      </div>
      <Button className="user-card_btn" onClick={pushHandler}>
        View
      </Button>
    </article>
  );
};
