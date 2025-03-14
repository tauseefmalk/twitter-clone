import Image from "next/image";
import React from "react";
import { BiMessageRounded } from "react-icons/bi";
import { CgMoreAlt } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { FaRetweet } from "react-icons/fa6";
import { RiShare2Line } from "react-icons/ri";

const FeedCard: React.FC = () => {
  return (
    <div className="border-b border-gray-800 p-2 cursor-pointer hover:bg-gray-800 transition-all">
      <div className="grid grid-cols-12 gap-2  ">
        <div className="col-span-1 ">
          <Image
            src={
              "https://lh3.googleusercontent.com/a/ACg8ocIAlg7o9b_qmjYl5UQM1QhFnKgp4Gec2a_tZYBVFtlh_s6mWpOz=s192-c-rg-br100"
            }
            alt="User Avatar"
            height={60}
            width={60}
          />
        </div>
        <div className="col-span-11 ml-2">
          <div className="justify-between flex">
            <div className="flex gap-1 text-sm">
              <h1 className="font-semibold">Dejavu</h1>
              <span className="text-gray-500 ">@dejavu</span>
              <span className="text-gray-500 font-light ">10h</span>
            </div>
            <div className="text-gray-600 ">
              <CgMoreAlt size={22} />
            </div>
          </div>
          <p className="mr-5">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est
            consequatur laborum odio tempora veritatis culpa, ad fuga impedit
            quae commodi maxime aspernatur unde, nulla magni nisi. Magni earum
            deserunt voluptate.
          </p>
          <div className="flex gap-24 text-gray-600 text-lg  mt-4">
            <div>
            <BiMessageRounded />
            </div>
            <div>
            <FaRetweet />
            </div>
            <div>
            <FaRegHeart />
            </div>
            <div>
            <RiShare2Line />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
