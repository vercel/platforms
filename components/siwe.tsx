"use client";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useEffect, useState } from "react";
import { EthereumLogo } from "@/components/icons/ethereum-eth-logo";
import { useRouter } from "next/navigation";

function Siwe({ redirect = true, callbackUrl = "/" }) {
  const router = useRouter();
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected, } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data: session, status } = useSession();

  const handleLogin = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      const response = await signIn("ethereum", {
        message: JSON.stringify(message),
        redirect,
        signature,
        callbackUrl,
      });

      if (response?.ok) {
        router.replace(callbackUrl)
        // router(callbackUrl);
      }
    } catch (error) {
      window.alert(error);
    }
  };

  // auto connect
  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (!isConnected) {
          connect();
        } else {
          handleLogin();
        }
      }}
      className="flex w-full cursor-pointer items-center justify-center rounded-[8px] border border-brand-primary/80 bg-brand-primary/10 px-[16px] py-1.5 font-semibold tracking-wider  transition-colors duration-200 hover:bg-brand-primary/40 dark:text-gray-100 dark:hover:text-gray-50"
    >
      <span className="mx-3 my-1 h-6">
        <EthereumLogo />
      </span>
      Sign in with Ethereum
    </button>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Siwe;
