import { CreateThreadForm } from "@/components/CreateThreadForm";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const CreateThreadPage = async () => {
  const user = await currentUser();
  const userInfo = await fetchUser(user!.id);

  return (
    <>
      <h1 className="head-text">Create Thread</h1>;
      <CreateThreadForm userId={userInfo!._id} />
    </>
  );
};

export default CreateThreadPage;
