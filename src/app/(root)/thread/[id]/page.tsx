import { CreateCommentForm } from "@/components/CreateCommentForm";
import { ThreadCard } from "@/components/ThreadCard";
import { fetchThread } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";

interface ThreadPageProps {
  params: {
    id: string;
  };
}

const ThreadPage = async ({ params: { id } }: ThreadPageProps) => {
  if (!id) {
    return notFound();
  }

  const user = await currentUser();
  const userInfo = await fetchUser(user!.id);
  const thread = await fetchThread(id);

  if (!thread) {
    return notFound();
  }

  const { _id, parentId, text, author, community, createdAt, children } =
    thread;

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={_id}
          currentUserId={user!.id}
          _id={_id}
          id={_id}
          parentId={parentId}
          text={text}
          author={author}
          community={community}
          createdAt={createdAt}
        >
          {children}
        </ThreadCard>
      </div>
      <div className="mt-7">
        <CreateCommentForm
          currentUserId={JSON.stringify(userInfo!._id)}
          currentUserImage={userInfo!.image}
          threadId={JSON.stringify(_id)}
        />
      </div>
      <div className="mt-10">
        {children?.map(
          ({ _id, parentId, text, author, community, createdAt }) => (
            <ThreadCard
              key={_id}
              currentUserId={user!.id}
              _id={_id}
              id={_id}
              parentId={parentId}
              text={text}
              author={author}
              community={community}
              createdAt={createdAt}
              isComment
            />
          )
        )}
      </div>
    </section>
  );
};

export default ThreadPage;
