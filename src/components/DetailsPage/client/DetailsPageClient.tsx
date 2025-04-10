"use client";

import Banner from "@/components/DetailsPage/client/Banner";
import Map from "@/components/shared/Client/Map";
import { useGetEventByIdQuery } from "@/Redux/Apis/eventApis";
import { imageUrl } from "@/Utils/serverUrl";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaCalendar, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaEarthAfrica, FaLocationDot } from "react-icons/fa6";
import Spiner from "@/components/shared/Client/Spiner";
import { useState } from "react";

interface EventData {
  address: string;
  _id: string;
  vendor: {
    profile_image: string;
    name: string;
    email: string;
    business_name: string;
    _id: string;
  } | null;
  name: string;
  date: string; // ISO date string
  end_date: string; // ISO date string
  end_time: string;
  time: string;
  duration: string;
  category: {
    _id: string;
    name: string;
    __v: number;
  };
  option: string[];
  social_media: {
    name: string;
    link: string;
    _id: string;
  }[];
  location: {
    type: string;
    coordinates: [number, number];
    _id: string;
  };
  description: string;
  spanishDescription: string;
  event_image: string[];
  featured: boolean | null;
  favorites: Number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const DetailsPageClient = () => {
  const params = useParams();
  const id = params?.id as string;
  const [english, setEnglish] = useState(true);
  const { data, isLoading } = useGetEventByIdQuery(id);
  const eventData = data?.data as EventData;

  // console.log(eventData);

  return isLoading ? (
    <Spiner />
  ) : (
    <div className="container mx-auto">
      <Banner
        date={eventData?.date}
        end_date={eventData?.end_date}
        event_image={eventData?.event_image?.[0]}
        location={eventData?.address}
        name={eventData?.name}
        time={eventData?.time}
        social_media={eventData?.social_media}
      />
      <div>
        <Link
          href={`/details/author?id=${eventData?.vendor?._id}`}
          className="start-center gap-2 mt-4 cursor-pointer"
        >
          <Image
            src={imageUrl(eventData?.vendor?.profile_image || "")}
            alt="Author Image"
            height={600}
            width={600}
            className="h-24 w-24 rounded-full object-cover"
            // unoptimized
          />
          <Link href={`/details/author?id=${eventData?.vendor?._id}`}>
            <p
              className="uppercase text-gray font-bold"
              style={{
                fontSize: "26px",
              }}
            >
              {eventData?.vendor?.business_name || "Unknown Author"}
            </p>
            {/* <p className="uppercase text-gray">
                            {eventData?.vendor?.email || 'No email provided'}
                        </p> */}
          </Link>
        </Link>
        <div className=" start-start flex-col gap-1 max-w-[600px]">
          {/* <p className='text-[var(--color-white)] text-lg md:text-xl lg:text-2xl'>Best Event in</p> */}
          <p className="text-3xl mt-8">{eventData?.name}</p>
          <p style={{}} className="text flex justify-start items-center gap-2">
            <FaLocationDot /> {eventData?.address}
          </p>
          <p className="start-center bg-[var(--color-blue-500)] text-[var(--color-white)] w-fit p-1 px-4 mt-2 rounded-md gap-2">
            <FaCalendar />
            {eventData?.date?.split("T")?.[0]}
            {/* {moment(eventData?.date).format("MMMM Do")} at {eventData?.time} */}
            {/* to{" "}
            {moment(eventData?.end_date).format("MMMM Do")} */}
          </p>
          <p className="mt-2">
            <strong>End date</strong> {eventData?.end_date?.split("T")?.[0]} at{" "}
            {eventData?.end_time}
            {/* {moment(eventData?.end_date).format("MMMM Do")} at {eventData?.time} */}
          </p>
          <div className="flex justify-start items-center gap-2 mt-2 text-white">
            {eventData?.social_media ? (
              Array.isArray(eventData?.social_media) ? (
                eventData?.social_media?.map((item) => (
                  <Link href={item?.link}>
                    {item?.name == "facebook" ? (
                      <FaFacebook />
                    ) : item?.name == "website" ? (
                      <FaEarthAfrica />
                    ) : item?.name == "instagram" ? (
                      <FaInstagram />
                    ) : (
                      <FaTiktok />
                    )}
                  </Link>
                ))
              ) : (
                <Link href={eventData?.social_media}>
                  <FaEarthAfrica />
                </Link>
              )
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex justify-start items-center gap-3">
          <p className="text-3xl mt-4">Description:</p>
          {/* <Switch
            style={{
              marginBottom: "-22px",
            }}
            onChange={(value) => setEnglish(value)}
            checkedChildren="english"
            unCheckedChildren="spanish"
            defaultChecked
          /> */}
        </div>
        <div className="text-gray">
          {/* <strong>{eventData?.name || "Event Name Unavailable"}</strong> */}
          <br />
          {/* spanishDescription */}
          <div
            dangerouslySetInnerHTML={{
              __html: english
                ? eventData?.description
                : eventData?.spanishDescription || "",
            }}
          ></div>
        </div>
      </div>
      <div className="mt-10">
        <Map location={eventData?.location} address={eventData?.address} />
      </div>
    </div>
  );
};

export default DetailsPageClient;
