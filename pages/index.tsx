import { Geist, Geist_Mono } from "next/font/google";
import { BsTwitter } from "react-icons/bs";
import { BiBell, BiBookmark, BiEnvelope, BiHash, BiSolidHomeCircle, BiUser } from "react-icons/bi";
import React from "react";
import {FaRegMoneyBillAlt } from "react-icons/fa";
import FeedCard from "@/Components/FeedCard";
import { CgMoreO } from "react-icons/cg";

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
    icon: <BiHash   />
    ,
  },
  {
    title: "Notifications",
    icon: <BiBell   />,
  },
  {
    title: "Messages",
    icon: <BiEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BiBookmark  />,
  },
  {
    title: "Twitter Blue",
    icon: <FaRegMoneyBillAlt  />,
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
  return (
    <div className="grid grid-cols-12 h-screen w-screen px-56  ">
      {/* sidebar */}
      <div className="col-span-3  ml-14">
        {/* LOGO */}
        <div className="hover:bg-gray-800 rounded-full cursor-pointer p-2 h-fit w-fit transition-all">
          <BsTwitter size={32} />
        </div>
        {/* MENU */}
        <div className="mt-6 text-lg flex justify-start font-bold  ">
          <ul className="">
            {sideBarMenuItems.map((item) => (
              <li key={item.title} className="flex mb-2  justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-2 cursor-pointer  py-1  transition-all w-fit">
                <span className="text-xl" >{item.icon}</span>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="bg-[#1DA1F2] py-1 px-16 cursor-pointer   rounded-full font-bold mt-6 ">Tweet</button>
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
      <div className="col-span-3"></div>
    </div>
  );
}
