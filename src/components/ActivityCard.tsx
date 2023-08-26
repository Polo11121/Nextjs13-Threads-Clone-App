import { UserSchema } from "@/lib/models/user.model";
import Image from "next/image";
import Link from "next/link";

interface ActivityCardProps {
  id: string;
  parentId: string;
  author: UserSchema;
}

export const ActivityCard = ({ id, parentId, author }: ActivityCardProps) => (
  <Link href={`/thread/${parentId}`} key={id}>
    <article className="activity-card">
      <Image
        src={author.image}
        className="rounded-full object-cover"
        width={20}
        height={20}
        alt="Profile picture"
      />
      <p className="!text-small-regular text-light-1">
        <span className="mr-1 text-primary-500">
          {author.name} {author.username}
        </span>{" "}
        replied to your thread
      </p>
    </article>
  </Link>
);
