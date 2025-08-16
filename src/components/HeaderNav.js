"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { RiHeart2Line } from "react-icons/ri";
import { MdOutlineSos } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { Button } from "./ui/button";
import { toast } from "./ui/Toast";

export default function HeaderNav() {
  // Function to prompt user for SOS number and initiate call
  const handleSOSClick = () => {
    const number = prompt("Enter the emergency number to call:");

    if (!number) {
      toast.error("No number entered.");
      return;
    }

    const cleanNumber = number.replace(/\s+/g, ""); // Remove spaces

    if (!/^\d+$/.test(cleanNumber)) {
      toast.error("Please enter a valid numeric phone number.");
      return;
    }

    // Check if device supports calling (basic user agent check)
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Initiate phone call immediately
      window.location.href = `tel:+91${cleanNumber}`;
    } else {
      // Desktop: show toast with number to call manually
      toast(`Call this number from your phone: +91${cleanNumber}`);
    }
  };

  return (
    <SessionProvider>
      <nav className="p-2 sticky top-0 z-30 bg-white h-16 flex items-center justify-between">
        <p className="flex text-4xl gap-1 items-center text-pink-400">
          <RiHeart2Line className="text-5xl heartbeat" />
        </p>
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="destructive"
            className="flex gap-1 justify-center items-center py-1 px-4 text-3xl text-red-50 ring-2 ring-red-400 rounded-full bg-[#E04759]"
            onClick={handleSOSClick}
          >
            <IoIosWarning className="text-lg" />
            <MdOutlineSos />
          </Button>
          <UserComponent />
        </div>
      </nav>
    </SessionProvider>
  );
}

function UserComponent() {
  const { data } = useSession();
  return (
    <>
      {data?.user?.image && (
        <Link href="/profile">
          <img
            src={data.user.image}
            alt="User Profile"
            className="h-11 w-11 bg-rose-300 rounded-full ring-2 ring-pink-400"
          />
        </Link>
      )}
    </>
  );
}
