import { ActivityCard } from "@/components/ActivityCard";
import { fetchActivities, fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const ActivityPage = async () => {
  const user = await currentUser();
  const userInfo = await fetchUser(user!.id);

  const activity = await fetchActivities(userInfo!._id);

  return (
    <section className="head-text mb-10">
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length ? (
          activity.map(({ id, author, parentId }) => (
            <ActivityCard
              author={author}
              id={id}
              parentId={parentId}
              key={id}
            />
          ))
        ) : (
          <p className="no-result">No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default ActivityPage;
