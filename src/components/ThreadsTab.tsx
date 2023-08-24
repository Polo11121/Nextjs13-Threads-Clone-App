import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { ThreadCard } from "@/components/ThreadCard";

interface ThreadsTabProps {
  currentUserId: string;
  profileUserId: string;
  accountType: string;
}

export const ThreadsTab = async ({
  currentUserId,
  profileUserId,
  accountType,
}: ThreadsTabProps) => {
  const result = await fetchUserThreads(profileUserId);

  if (!result) {
    redirect("/");
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map(
        ({ _id, parentId, text, author, community, createdAt }) => {
          return (
            <ThreadCard
              key={_id}
              currentUserId={currentUserId}
              _id={_id}
              id={_id}
              parentId={parentId}
              text={text}
              author={
                accountType === "User"
                  ? {
                      ...result,
                      name: result.name,
                      username: result.username,
                      image: result.image,
                    }
                  : {
                      ...author,
                      name: author.name,
                      username: author.username,
                      image: author.image,
                    }
              }
              community={community}
              createdAt={createdAt}
            />
          );
        }
      )}
    </section>
  );
};
