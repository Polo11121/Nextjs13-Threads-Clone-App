"use client";

import { sidebarLinks } from "@/constants";
import { useAuth, SignedIn, SignOutButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const LeftSidebar = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const logoutHandler = () => router.push("/sign-in");

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map(({ imgURL, label, route }) => {
          const isActive =
            pathname === route ||
            (route.length > 1 && pathname.includes(route));
          const link = route === "/profile" ? `/profile/${userId}` : route;

          return (
            <Link
              href={link}
              key={label}
              className={`leftsidebar_link${isActive ? " bg-primary-500" : ""}`}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="text-light-1 max-lg:hidden">{label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={logoutHandler}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};
