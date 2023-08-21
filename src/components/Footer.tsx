"use client";

import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map(({ imgURL, label, route }) => {
          const isActive = pathname.includes(route) && route.length;

          return (
            <Link
              href={route}
              key={label}
              className={`bottombar_link${isActive ? " bg-primary-500" : ""}`}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="text-light-1 text-subtle-medium max-sm:hidden">
                {label.split(" ")[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
