import { UserCard } from "@/components/UserCard";
import { fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const SearchPage = async () => {
  const user = await currentUser();

  const { users } = await fetchUsers({
    currentUserId: user!.id,
    searchTerm: "",
    pageNumber: 1,
    pageSize: 20,
    sortBy: "desc",
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <div className="mt-14 flex flex-col gap-9">
        {users.length ? (
          users.map(({ id, name, username, image }) => (
            <UserCard
              key={id}
              id={id}
              name={name}
              username={username}
              imgUrl={image}
              personType="User"
            />
          ))
        ) : (
          <p className="no-result">No users</p>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
