
import React, { useCallback, useState } from "react";
import FeedCard from "@/Components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { IoImageOutline } from "react-icons/io5";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/Components/Layout/TwitterLayout";
import Image from "next/image";

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();
  const { mutate } = useCreateTweet();

  console.log(user);

  const [content, setContent] = useState("");

  const handleSelectFile = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);

  const handlePostTweet = useCallback(() => {
    mutate({ content });
  }, [content, mutate]);

  return (
    <>
      <TwitterLayout>
        <div className="border-b border-gray-800 p-2 cursor-pointer hover:bg-gray-800 transition-all">
          <div className="grid grid-cols-12 gap-2  ">
            <div className="col-span-1 ">
              {user?.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="User Avatar"
                  height={60}
                  width={60}
                />
              )}
            </div>
            <div className="col-span-11 mx-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                rows={2}
                className="w-full focus:outline-none   bg-transparent text-lg "
                name="tweet"
                id="tweet"
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <IoImageOutline onClick={handleSelectFile} color="#1DA1F2" />
                <button
                  onClick={handlePostTweet}
                  className="bg-white py-1 px-4 text-black cursor-pointer text-sm   rounded-full font-bold  "
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
        {tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </TwitterLayout>
    </>
  );
}
