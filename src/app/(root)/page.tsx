import { ThreadCard } from "@/components/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

const HomePage = async () => {
  const { hasNext, threads } = await fetchThreads(1, 30);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left ">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {threads.length ? (
          threads.map(
            ({
              _id,
              parentId,
              text,
              author,
              community,
              createdAt,
              children,
            }) => (
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
            )
          )
        ) : (
          <p className="no-result">No threads found</p>
        )}
      </section>
    </>
  );
};

export default HomePage;
