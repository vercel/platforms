import Layout from "../../components/app/Layout";
import Link from "next/link";
import Image from "next/image";
import React, { Fragment, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { ExternalLinkIcon, CogIcon, PlusIcon } from "@heroicons/react/outline";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Index() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  // const { sites } = useSWR(
  //   userId && `/api/get-sites?userId=${userId}`,
  //   fetcher
  // );

  return (
    <>
      <Layout></Layout>
    </>
  );
}
