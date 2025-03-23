
import { useCurrentUser } from "@/hooks/user";
import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import {
  BiBell,
  BiBookmark,
  BiEnvelope,
  BiHash,
  BiSolidHomeCircle,
  BiUser,
} from "react-icons/bi";
import { CgMoreO } from "react-icons/cg";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";

interface TwitterLayoutProps {
  children: React.ReactNode;
}

interface TwitterSideBarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  console.log(router.query);
  

  const sidebarMenuItems: TwitterSideBarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiSolidHomeCircle />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <BiHash />,
        link: "/",
      },
      {
        title: "Notifications",
        icon: <BiBell />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <BiEnvelope />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <BiBookmark />,
        link: "/",
      },
      {
        title: "Twitter Blue",
        icon: <FaRegMoneyBillAlt />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <BiUser />,
        link: `/${user?.id}`,
      },
      {
        title: "More Options",
        icon: <CgMoreO />,
        link: "/",
      },
    ],
    [user?.id]
  );

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
          await queryClient.invalidateQueries({ queryKey: ["current-user"] });
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
    <>
      <div className="grid grid-cols-12 h-screen w-screen sm:px-56  ">
        {/* sidebar */}
        <div className="col-span-2 sm:col-span-3  flex sm:justify-end pr-5 relative">
          {/* LOGO */}
          <div>
            <div className="hover:bg-gray-800 rounded-full cursor-pointer p-2 h-fit w-fit transition-all">
              <FaXTwitter size={32} />
            </div>
            {/* MENU */}
            <div className="mt-6 text-lg flex flex-col justify-start font-bold  ">
              <ul className="">
                {sidebarMenuItems.map((item) => (
                  <li
                    key={item.title}
                  >
                    <Link href={item.link}                     
                    className="flex mb-2 justify-start  items-center gap-4 hover:bg-gray-800 rounded-full px-3 cursor-pointer  py-1  transition-all w-fit"
                    >
                    <span className="text-xl">{item.icon}</span>
                    <span className="hidden sm:inline">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 px-2">
                <button className="hidden sm:block bg-white text-black cursor-pointer  px-16  rounded-full font-bold mt-6 ">
                  Post
                </button>
                <button className="sm:hidden block bg-white py-2 px-4  text-black  cursor-pointer   rounded-full font-bold mt-6 ">
                  <FaXTwitter size={25} />
                </button>
              </div>
            </div>
          </div>
          {user && (
            <div className="flex gap-2 items-center mr-2 absolute bottom-5 border border-gray-800 p-2 hover:bg-gray-800 rounded-full">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-Image"
                  height={40}
                  width={40}
                />
              )}
              <div className="hidden sm:block justify-between gap-2 ">
                <h1 className="text-md font-semibold">
                  {user.firstName} {user.lastName}
                </h1>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-10 sm:col-span-6 border-x border-gray-800 h-screen overflow-y-scroll ">
          {props.children}
        </div>
        <div className="col-span-[0] sm:col-span-3 p-5">
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
    </>
  );
};
export default TwitterLayout;
