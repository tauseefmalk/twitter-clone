import { Geist, Geist_Mono } from "next/font/google";
import { BsTwitter } from "react-icons/bs";
import {
  BiBell,
  BiBookmark,
  BiEnvelope,
  BiHash,
  BiSolidHomeCircle,
  BiUser,
} from "react-icons/bi";
import React, { useCallback } from "react";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import FeedCard from "@/Components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { CgMoreO } from "react-icons/cg";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface TwitterSideBar {
  title: string;
  icon: React.ReactNode;
}

const sideBarMenuItems: TwitterSideBar[] = [
  {
    title: "Home",
    icon: <BiSolidHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notifications",
    icon: <BiBell />,
  },
  {
    title: "Messages",
    icon: <BiEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BiBookmark />,
  },
  {
    title: "Twitter Blue",
    icon: <FaRegMoneyBillAlt />,
  },
  {
    title: "Profile",
    icon: <BiUser />,
  },
  {
    title: "More Options",
    icon: <CgMoreO />,
  },
];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { user } = useCurrentUser();
  console.log(user);
  const queryClient = useQueryClient();

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      try {
        const googleToken = cred.credential;
        if (!googleToken) return toast.error("Google Token not found");

        // Send the token to your server
        const result = await graphqlClient.request(verifyUserGoogleTokenQuery, {
          token: googleToken,
        });

        const jwtToken = result.verifyGoogleToken;

        if (jwtToken) {
          // Store the JWT token returned from your server
          localStorage.setItem("__twitter_token", jwtToken);
          toast.success("Login successful");

          // Redirect or update state as needed
          // window.location.reload(); // Optional: reload to update auth state
          await queryClient.invalidateQueries(["current-user"]);
        } else {
          toast.error("Authentication failed - no token returned");
        }
      } catch (error: any) {
        console.error("Authentication error:", error);
        toast.error("Login failed: " + (error.message || "Unknown error"));
      }
    },
    [queryClient]
  );
  return (
    <div className="grid grid-cols-12 h-screen w-screen px-56  ">
      {/* sidebar */}
      <div className="col-span-3  ml-14 relative">
        {/* LOGO */}
        <div className="hover:bg-gray-800 rounded-full cursor-pointer p-2 h-fit w-fit transition-all">
          <BsTwitter size={32} />
        </div>
        {/* MENU */}
        <div className="mt-6 text-lg flex justify-start font-bold  ">
          <ul className="">
            {sideBarMenuItems.map((item) => (
              <li
                key={item.title}
                className="flex mb-2  justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-2 cursor-pointer  py-1  transition-all w-fit"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="bg-[#1DA1F2] py-1 px-16 cursor-pointer   rounded-full font-bold mt-6 ">
          Tweet
        </button>
        {user && (
          <div className="flex gap-2 items-center absolute bottom-5 border border-gray-800 p-2 hover:bg-gray-800 rounded-full">
            {user && user.profileImageURL && (
              <Image
                className="rounded-full"
                src={user?.profileImageURL}
                alt="user-Image"
                height={40}
                width={40}
              />
            )}
            <div className="flex ">
              <h1 className="text-md font-semibold">
                {user.firstName} {user.lastName}
              </h1>
            </div>
          </div>
        )}
      </div>
      <div className="col-span-6 border-x border-gray-800 h-screen overflow-scroll ">
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
      </div>
      <div className="col-span-3 p-3">
        {!user && (
          <div className="border border-gray-800 rounded-lg p-5 w-xs shadow-md">
            <div>
              <h1 className="font-semibold text-lg">New to Twitter</h1>
              <p className="text-xs text-gray-500">
                Sign in now to get your own personalise timeline
              </p>
            </div>
            <div className="my-4">
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
