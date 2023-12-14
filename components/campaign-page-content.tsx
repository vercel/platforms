"use client";

import LaunchCampaignButton from "@/components/launch-campaign-button";
import CampaignContributeButton from "@/components/campaign-contribute-button";
import CampaignWithdrawButton from "@/components/campaign-withdraw-button";
import CampaignForm from "@/components/edit-campaign-form";
import useEthereum from "@/hooks/useEthereum";
import { Campaign } from "@prisma/client";
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { getCampaign, updateCampaign } from "@/lib/actions";
import LoadingDots from "@/components/icons/loading-dots";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/form-builder/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import * as ToggleGroup from '@radix-ui/react-toggle-group';


interface ModifiedFields {
  name: boolean;
  threshold: boolean;
  content: boolean;
}

interface Payload {
  id: string;
  name?: string;
  thresholdWei?: bigint;
  content?: string;
}

export default function CampaignPageContent(
  {campaignId, subdomain, isPublic}:
  {campaignId: string, subdomain: string, isPublic: boolean}
) {
  const { getContributionTotal, getContractBalance } = useEthereum();
  const [totalContributions, setTotalContributions] = useState(0);
  const [contractBalance, setContractBalance] = useState(BigInt(0));
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState({ name: '', thresholdETH: '', content: '' });
  const [modified, setModified] = useState<ModifiedFields>({ name: false, threshold: false, content: false });
  const [requireApproval, setRequireApproval] = useState(false);
  const [deadline, setDeadline] = useState(undefined);

  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  useEffect(() => {
    getCampaign(campaignId).then(result => {
      if (result) {
        setCampaign(result);
      }
    }).then(() => setLoading(false));
  }, [refreshFlag, campaignId]);

  useEffect(() => {
    async function fetchTotalContributions() {
      if (campaign?.deployed) {
        const total = await getContributionTotal(campaign.deployedAddress!);
        setTotalContributions(total);
      }
    }
    fetchTotalContributions();

    async function fetchContractBalance() {
      if (campaign?.deployed) {
        const balance = await getContractBalance(campaign.deployedAddress!);
        setContractBalance(balance);
      }
    }
    fetchContractBalance();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  useEffect(() => {
    if (campaign) {
      setEditedCampaign({
        name: campaign.name,
        thresholdETH: ethers.formatEther(campaign.thresholdWei),
        content: campaign.content
      });
    }
  }, [campaign]);

  const handleFieldChange = (field, value) => {
    setEditedCampaign(prev => ({ ...prev, [field]: value }));
    setModified({ ...modified, [field]: true });
  };

  const submitChanges = async () => {
    let payload: Payload = { id: campaignId };
    if (modified.name) payload.name = editedCampaign.name;
    if (modified.threshold) payload.thresholdWei = ethers.parseEther(editedCampaign.thresholdETH);
    if (modified.content) payload.content = editedCampaign.content;

    try {
      const response = await updateCampaign(
        payload,
        { params: { subdomain } },
        null,
      );
      console.log(response);
      toast.success(`Campaign updated`);
      // Update campaign state with new values
      setCampaign({...campaign, ...payload});
    } catch (error: any) {
      console.error('Error updating campaign', error);
      toast.error(error.message);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      submitChanges();
    }
    setEditMode(!editMode);
  };

  const handleSwitchChange = () => {
    setRequireApproval(!requireApproval);
  };


  if (loading) {
    return <LoadingDots color="#808080" />
  }
  else if (!campaign || !campaign.organizationId) {
    return <div>Campaign not found</div>
  }

  return (
    <div>
      {loading ? (
        <LoadingDots color="#808080" />
      ) : !campaign || !campaign.organizationId ? (
        <div>Campaign not found</div>
      ) : (
        <div>
          <div>
            <div className="space-y-4 my-4">
              {editMode ? (
                <Input 
                  type="text" 
                  value={editedCampaign.name} 
                  onChange={(e) => handleFieldChange('name', e.target.value)} 
                  disabled={isPublic || campaign.deployed}
                  className="text-2xl font-bold my-6"
                />
              ) : (
                <h1 className="text-2xl font-bold my-6">{campaign.name}</h1>
              )}
              {editMode ? (
                <Input 
                  type="text" 
                  value={editedCampaign.thresholdETH} 
                  onChange={(e) => handleFieldChange('thresholdETH', e.target.value)} 
                  disabled={isPublic || campaign.deployed}
                />
              ) : (
                <p className="text-xl">{`Goal: ${ethers.formatEther(campaign.thresholdWei)} ETH`}</p>
              )}
              {editMode ? (
                <Textarea 
                  value={editedCampaign.content} 
                  onChange={(e) => handleFieldChange('content', e.target.value)} 
                  disabled={isPublic}
                />
              ) : (
                <p>{campaign.content}</p>
              )}
              <div className="flex space-x-4">
                  <div>Require approval for contributors?</div>
                  <Switch 
                    checked={requireApproval} 
                    onCheckedChange={handleSwitchChange} 
                  />
              </div>
              <div className="flex space-x-4 items-center">
                <div>
                  Deadline
                </div>
                <DatePicker
                  date={deadline}
                  onSelect={(date) => {
                    setDeadline(date);
                  }}
                />
              </div>
              <div className="flex space-x-4 items-center">
                <div>Currency</div>
                <ToggleGroup.Root
                  className="inline-flex bg-gray-200 rounded-full shadow-md"
                  type="single"
                  defaultValue="eth"
                >
                  <ToggleGroup.Item
                    className="bg-gray-800 w-20 p-2 text-gray-100 shadow hover:bg-gray-800/90 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300/90 data-[state=on]:!bg-gray-600/90 rounded-l-full"
                    value="eth"
                  >
                    ETH
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    className="bg-gray-800 w-20 p-2 text-gray-100 shadow hover:bg-gray-800/90 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300/90 data-[state=on]:!bg-gray-600/90"
                    value="usdc"
                  >
                    USDC
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    className="bg-gray-800 w-20 p-2 text-gray-100 shadow hover:bg-gray-800/90 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300/90 data-[state=on]:!bg-gray-600/90 rounded-r-full"
                    value="usdt"
                  >
                    USDT
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              </div>
            </div>
            <div className="my-2">
              {campaign.deployed
              ? `Launched ${campaign.timeDeployed!.toLocaleString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: undefined,
                timeZoneName: undefined
              })}`
              : "Not launched yet"}
            </div>
            <p>{`Last updated ${campaign.updatedAt.toLocaleString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}`}</p>

            {campaign.deployed && (
              <p>{`Contract balance: ${ethers.formatEther(contractBalance)} ETH`}</p>
            )}
          </div>

          {!isPublic && (
            <Button onClick={handleEditToggle}>
              {editMode ? 'Save Changes' : 'Edit Campaign'}
            </Button>
          )}
          <div className="mt-4">
            {!campaign.deployed &&
              <LaunchCampaignButton
                campaign={campaign}
                subdomain={subdomain}
                onComplete={triggerRefresh}
              />
            }
            {campaign.deployed && (
              <CampaignContributeButton
                campaign={campaign}
                subdomain={subdomain}
                onComplete={triggerRefresh}
              />
            )}
            {!isPublic && campaign.deployed && (
              <CampaignWithdrawButton
                campaign={campaign}
                subdomain={subdomain}
                onComplete={triggerRefresh}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
  // return (
  //   <div>
  //     <div>
  //       <h1 className="text-2xl font-bold my-6">
  //         {campaign.name}
  //       </h1>
  //       <p className="text-xl">
  //         {`Goal: ${ethers.formatEther(campaign.thresholdWei)} ETH`}
  //       </p>
  //       {totalContributions > 0 &&
  //         <p>
  //           {`${ethers.formatEther(totalContributions)} ETH raised`}
  //         </p>
  //       }
  //       {campaign.content &&
  //         <p>
  //           {campaign.content}
  //         </p>
  //       }
  //       <p>
  //         {campaign.deployed
  //         ? `Launched ${campaign.timeDeployed!.toLocaleString(undefined, {
  //           year: 'numeric',
  //           month: '2-digit',
  //           day: '2-digit',
  //           hour: '2-digit',
  //           minute: '2-digit',
  //           second: undefined,
  //           timeZoneName: undefined
  //         })}`
  //         : "Not deployed"}
  //       </p>
  //       <p>
  //         {`Last updated ${campaign.updatedAt.toLocaleString(undefined, {
  //           year: 'numeric',
  //           month: '2-digit',
  //           day: '2-digit',
  //           hour: '2-digit',
  //           minute: '2-digit',
  //           second: undefined,
  //           timeZoneName: undefined
  //         })}`}
  //       </p>
  //       {campaign.deployed &&
  //         <p>
  //           {`Contract balance: ${ethers.formatEther(contractBalance)} ETH`}
  //         </p>
  //       }
  //     </div>
  //     {!isPublic &&
  //       <CampaignForm id={campaign.id} subdomain={subdomain} />
  //     }
  //     {!campaign.deployed &&
  //       <LaunchCampaignButton
  //         campaign={campaign}
  //         subdomain={subdomain}
  //         onComplete={triggerRefresh}
  //       />
  //     }
  //     {campaign.deployed && (
  //       <CampaignContributeButton
  //         campaign={campaign}
  //         subdomain={subdomain}
  //         onComplete={triggerRefresh}
  //       />
  //     )}
  //     {!isPublic && campaign.deployed && (
  //       <CampaignWithdrawButton
  //         campaign={campaign}
  //         subdomain={subdomain}
  //         onComplete={triggerRefresh}
  //       />
  //     )}
  //   </div>
  // );
// }