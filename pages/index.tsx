import React, { useCallback, useState } from "react";
import FeedCard from "@/Components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { IoImageOutline } from "react-icons/io5";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/Components/Layout/TwitterLayout";
import Image from "next/image";
import { GetServerSideProps } from "next";
import {
  getAllTweetsQuery,
  getSignedURLForTweetQuery,
} from "@/graphql/query/tweet";
import { graphqlClient } from "@/clients/api";
import axios from "axios";
import toast from "react-hot-toast";

interface HomeProps {
  tweets?: Tweet[];
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();
  const {tweets = props.tweets as Tweet[]} = useGetAllTweets()
  const { mutateAsync } = useCreateTweet();


  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

 
  

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return;
      const { getSignedURLForTweet } = await graphqlClient.request(
        getSignedURLForTweetQuery,
        {
          imageName: file.name,
          imageType: file.type,
        }
      );
      if (getSignedURLForTweet) {
        toast.loading("Uploading image...", { id: "2" });
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        toast.success("Image uploaded successfully", { id: "2" });
        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath);
      }
    };
  }, []);

  const handleSelectFile = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handlerFn = handleInputChangeFile(input);

    input.addEventListener("change", handlerFn);

    input.click();
  }, [handleInputChangeFile]);

  const handlePostTweet = useCallback(async () => {
    await mutateAsync({ 
      content,
      imageUrl: imageURL,
    });
    setContent("");
    setImageURL("");
  }, [content, mutateAsync, imageURL]);

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
              {imageURL && (
                <Image
                  src={imageURL}
                  alt="tweet-image"
                  width={300}
                  height={300}
                />
              )}
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

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  //whatever you return here will be render as a server side props
  const allTweets = await graphqlClient.request(getAllTweetsQuery);
  // if (!allTweets) return {notFound:true , props: {data: []}};
  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};
