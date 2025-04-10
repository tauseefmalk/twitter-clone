import { graphqlClient } from "@/clients/api";
import FeedCard from "@/Components/FeedCard";
import TwitterLayout from "@/Components/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

interface ServerProps {
  userInfo?: User;
}

const userProfilePage: NextPage<ServerProps> = (props) => {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const amIFollowing = useMemo(()=>{
    if(!props.userInfo) return false;
    return(
      (currentUser?.following?.findIndex(
        (el)=> el?.id === props.userInfo?.id
      ) ?? -1)>=0
    );
  },[currentUser?.following, props.userInfo])

  const handleFollowUser =useCallback(async()=>{
    if (!props.userInfo?.id) return;

    await graphqlClient.request(followUserMutation, {to: props.userInfo?.id})
    await queryClient.invalidateQueries(["current-user"])
  },[props.userInfo?.id, queryClient])

  const handleUnfollowUser = useCallback(async()=>{
    if (!props.userInfo?.id) return;

    await graphqlClient.request(unfollowUserMutation, {to: props.userInfo?.id})
    await queryClient.invalidateQueries(["current-user"])
  },[props.userInfo?.id, queryClient])

  return (
    <TwitterLayout>
      <div>
        <nav className="p-2 flex gap-2 border-b border-gray-800">
          <IoArrowBackOutline size={20} />
          <div>
            <h1 className="text-lg font-semibold">
              {props.userInfo?.firstName} {props.userInfo?.lastName}
            </h1>
            <p className="text-gray-600 text-sm">
              {props.userInfo?.tweets?.length} Tweets
            </p>
          </div>
        </nav>
        <div className="p-4 border-b border-gray-800">
          {props.userInfo?.profileImageURL && (
            <Image
              src={props.userInfo?.profileImageURL}
              alt={props.userInfo?.firstName}
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
          <h1 className="text-lg font-semibold">
            {props.userInfo?.firstName} {props.userInfo?.lastName}
          </h1>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 text-gray-500 text-sm mt-2">
              <span>{props.userInfo?.followers?.length} follwers</span>
              <span>{props.userInfo?.following?.length} followings</span>
            </div>
            {currentUser?.id !== props.userInfo?.id && (
             <>
             {
              amIFollowing? (
                <button onClick={handleUnfollowUser} className="bg-white text-black rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-200">
                Unfollow
              </button>
              ):(
                <button onClick={handleFollowUser} className="bg-white text-black rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-200">
                Follow
              </button>
              )
             }
             </>
            )}
          </div>
        </div>
        <div>
          {props.userInfo?.tweets?.map((tweet) => (
            <FeedCard key={tweet?.id} data={tweet as Tweet} />
          ))}
        </div>
      </div>
    </TwitterLayout>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  // whatever you return here is actually a server render thing
  const id = (context.query.id as string) || undefined;

  if (!id) return { notFound: true, props: { userInfo: undefined } };

  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });

  if (!userInfo?.getUserById) return { notFound: true };

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

export default userProfilePage;
