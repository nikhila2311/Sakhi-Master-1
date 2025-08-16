"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import Greeting from "@/components/dashboard/Greeting";

import { FaBookOpen, FaTrophy } from "react-icons/fa6";
import { MdEmergency, MdWaterDrop, MdFactCheck } from "react-icons/md";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { RiMentalHealthFill } from "react-icons/ri";
import { HiChatBubbleBottomCenterText, HiUserGroup } from "react-icons/hi2";
import { LuGraduationCap } from "react-icons/lu";

export default function Dashboard() {
  const { data: sessionData, status } = useSession();

  const userFirstName =
    sessionData?.user?.name?.split(" ")[0] ||
    sessionData?.user?.email?.split("@")[0] ||
    "Guest";

  const menuItems = [
    { color: "rose", label: "Cycle", href: "/tracker", icon: MdWaterDrop },
    { color: "amber", label: "Journal", href: "/journal", icon: FaBookOpen },
    { color: "emerald", label: "Fact Check", href: "/fact-check", icon: MdFactCheck },
    { color: "fuchsia", label: "Knowledge", href: "/knowledge", icon: RiMentalHealthFill },
    { color: "orange", label: "Community", href: "/social", icon: HiUserGroup },
    { color: "sky", label: "Sakhi Bot", href: "/chat", icon: HiChatBubbleBottomCenterText },
    { color: "pink", label: "Emergency", href: "/safety", icon: MdEmergency },
    {
      color: "green",
      label: "Safety",
      href: "/safety",
      icon: {
        src: "/assets/dashboard/safety-icon.png",
        alt: "Safety Icon",
        width: 150,
        height: 150,
      },
    },
    {
      color: "cyan",
      label: "Pregnancy",
      href: "https://bloom-baby-bliss-guide.lovable.app/",
      icon: {
        src: "/assets/dashboard/pregnancy-icon.png",
        alt: "Pregnancy Icon",
        width: 200,
        height: 200,
      },
    },
    { color: "orange", label: "Protection Acts", href: "/protection", icon: AiFillSafetyCertificate },
    { color: "fuchsia", label: "Education", href: "/education", icon: LuGraduationCap },
    { color: "amber", label: "Achievers", href: "/achievers", icon: FaTrophy },
  ];

  useEffect(() => {
    function handleMessage(event) {
      const allowedOrigins = [
        "https://bloom-baby-bliss-guide.lovable.app",
        window.location.origin,
      ];
      if (!allowedOrigins.includes(event.origin)) return;

      const { data } = event;
      if (typeof data !== "object" || data === null) return;
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="p-4">
      {/* Hero Section */}
      <div className="flex my-4">
        <div className="w-6/12 text-center flex flex-col justify-center items-center text-base font-semibold translate-x-8 text-[#DB6542]">
          What Would You Like
          <span className="text-[#389F8A]">to do Today?</span>
        </div>
        <div className="w-6/12 overflow-hidden">
          <Image
            priority
            src={"/assets/dashboard/think.png"}
            width={998}
            height={622}
            className="translate-x-10"
            alt="A person thinking or brainstorming"
          />
        </div>
      </div>

      {/* Greeting Section */}
      {status === "loading" ? (
        <p className="text-lg font-medium text-gray-500">Loading...</p>
      ) : (
        <div className="mb-6 text-xl font-semibold text-[#DB6542]">
          <Greeting name={userFirstName} />
        </div>
      )}

      {/* Grid Menu */}
      <div className="grid grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <GridElement key={item.label} data={item} />
        ))}
      </div>
    </div>
  );
}

function GridElement({ data }) {
  const isExternal = data.href.startsWith("http");

  const content = (
    <div
      className={`w-full aspect-square rounded-md flex flex-col justify-center items-center shadow-md gap-1 bg-gradient-to-br from-${data.color}-100 to-${data.color}-200 text-${data.color}-950`}
    >
      {typeof data.icon === "object" && data.icon?.src ? (
        <div className="w-1/2 h-1/3 flex items-center justify-center">
          <Image
            src={data.icon.src}
            alt={data.icon.alt}
            width={data.icon.width}
            height={data.icon.height}
            className={`fill-${data.color}-900`}
          />
        </div>
      ) : (
        React.createElement(data.icon, {
          className: `w-1/2 h-1/3 text-${data.color}-900`,
        })
      )}
      <span className={`text-center text-sm font-semibold text-${data.color}-950`}>
        {data.label}
      </span>
    </div>
  );

  return isExternal ? (
    <a href={data.href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    <Link href={data.href} className="block">
      {content}
    </Link>
  );
}
