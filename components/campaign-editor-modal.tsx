"use client";

import { useTransition } from "react";
import { createCampaign, updateCampaign, launchCampaign } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
import { Campaign } from "@prisma/client";
import CreateButton from "./primary-button";
import { ethers } from "ethers";
import Editor from "@/components/editor";


export default function CampaignEditorModal(
  props: { campaign: Campaign | undefined }
) {
  const router = useRouter();
  const { subdomain } = useParams() as {
    subdomain: string;
  };
  const [isPending, startTransition] = useTransition();

  const data = {
    name: 'test name',
    threshold: 0,
  }

  if (props.campaign === undefined) {
    // TODO will this need to be async?
    createCampaign(data, { params: { subdomain } }, null)
    .catch(console.error);
  }

  const onUpdate = async () => {
    updateCampaign(data, { params: { subdomain } }, null)
    .catch(console.error);
  };

  const deploy = async () => {
    onUpdate()
    .then(async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask or another wallet to create a campaign.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        const campaignABI: string = '';
        const campaignBytecode = "/* ... Bytecode ... */";

        // TODO make this actual data
        const creatorAddress = signer.address;
        const threshold = ethers.parseUnits("0", "ether");
        const name = "test";

        const campaignFactory = new ethers.ContractFactory(campaignABI, campaignBytecode, signer);
        const campaign = await campaignFactory.deploy(creatorAddress, threshold, name);
        await campaign.waitForDeployment();
        const deployedAddress = await campaign.getAddress();

        // TODO make this actual data
        const data = {
          name: '',
          threshold: 0,
          sponsorEthAddress: creatorAddress,
          deployedAddress: deployedAddress
        };

        launchCampaign(data, { params: { subdomain } }, null)
        .then((campaignData) => {
          router.push(`/city/${subdomain}/campaigns/${campaignData.id}`);
          router.refresh();
        })
      } catch (error) {
        console.error(error);
      }
    })
  };

  return (
    <form
    onSubmit={onUpdate}
    className="mx-auto w-full rounded-md bg-white dark:bg-gray-900 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
  >
    <div className="m.d:p-10 relative flex flex-col space-y-4 p-5">
      <h2 className="font-cal text-2xl dark:text-white">
        Create a new event
      </h2>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-gray-700 dark:text-gray-400"
        >
          Name
        </label>
        <Input
          name="name"
          type="text"
          placeholder="My Awesome Event"
          autoFocus
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          maxLength={64}
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="path"
          className="text-sm font-medium text-gray-700 dark:text-gray-400"
        >
          Path
        </label>
        <div className="flex w-full max-w-md">
          <div className="flex items-center rounded-r-lg border border-l-0 border-gray-200 bg-gray-100 px-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {organization.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}/
          </div>
          <Input
            name="path"
            type="text"
            placeholder="path"
            value={data.path}
            onChange={(e) => setData({ ...data, path: e.target.value })}
            autoCapitalize="off"
            pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
            maxLength={6432}
            required
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700 dark:text-gray-400"
        >
          Description
        </label>
        <textarea
          name="description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          maxLength={280}
          rows={3}
          className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900  focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
          Starts At
        </label>
        <div className="flex">
          <DatePicker
            date={data.startingAtDate}
            onSelect={(date) => {
              setData((prev) => ({ ...prev, startingAtDate: date }));
            }}
          />
          <TimePicker
            value={data.startingAtTime}
            onValueChange={(value) => {
              setData((prev) => ({ ...prev, startingAtTime: value }));
            }}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
          Ends At
        </label>
        <div className="flex">
          <DatePicker
            date={data.endingAtDate}
            onSelect={(date) => {
              setData((prev) => ({ ...prev, endingAtDate: date }));
            }}
          />
          <TimePicker
            value={data.endingAtTime}
            onValueChange={(value) => {
              setData((prev) => ({ ...prev, endingAtTime: value }));
            }}
          />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
      <FormButton text={"Create Event"} />
    </div>
  </form>
  );
}