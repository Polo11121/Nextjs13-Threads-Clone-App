import { ProfileHeader } from "@/components/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { profileTabs } from "@/constants";
import { ThreadsTab } from "@/components/ThreadsTab";
import Image from "next/image";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage = async ({ params: { id } }: ProfilePageProps) => {
  const user = await currentUser();
  const profileUser = await fetchUser(id);

  if (!profileUser) {
    return notFound();
  }

  return (
    <section>
      <ProfileHeader
        profileId={profileUser.id}
        currentUserId={user!.id}
        name={profileUser.name}
        username={profileUser.username}
        imgUrl={profileUser.image}
        bio={profileUser.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map(({ icon, label, value }) => (
              <TabsTrigger key={label} value={value} className="tab">
                <Image
                  src={icon}
                  alt={label}
                  height={24}
                  width={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{label}</p>
                {label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {profileUser.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map(({ icon, label, value }) => (
            <TabsContent
              key={label}
              value={value}
              className="w-full text-light-1"
            >
              <ThreadsTab
                currentUserId={user!.id}
                profileUserId={profileUser.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
