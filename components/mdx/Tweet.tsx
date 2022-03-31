import BlurImage from "../BlurImage";
import { format } from "date-fns";
import { useState } from "react";

import type { TweetData, WithClassName } from "@/types";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

function getRemainingTime(ISOString: string) {
  const currentTime = new Date();
  const endTime = new Date(ISOString).getTime();
  const diff = endTime - currentTime.getTime();

  if (diff > 36e5 * 24) {
    const days = Math.floor(diff / (36e5 * 24));
    const hours = Math.floor((diff - days * 36e5 * 24) / 36e5);

    return `${days} day${days > 1 ? "s" : ""} ${hours} hours`;
  }

  if (diff > 36e5) return `${Math.floor(diff / 36e5)} hours`;

  if (diff > 60e3) return `${Math.floor(diff / 60e3)} minutes`;

  return "Less than a minute";
}

interface TweetProps extends WithClassName {
  id: string;
  metadata: string;
}

export default function Tweet({ id, metadata, className }: TweetProps) {
  const parsedMetadata = JSON.parse(
    metadata.replace(/\n/g, "\\n")
  ) as TweetData;

  const {
    author,
    created_at,
    media,
    polls,
    public_metrics,
    referenced_tweets,
    text,
    url_meta,
    video,
  } = parsedMetadata;

  const authorUrl = `https://twitter.com/${author.username}`;
  const likeUrl = `https://twitter.com/intent/like?tweet_id=${id}`;
  const retweetUrl = `https://twitter.com/intent/retweet?tweet_id=${id}`;
  const replyUrl = `https://twitter.com/intent/tweet?in_reply_to=${id}`;
  const tweetUrl = `https://twitter.com/${author.username}/status/${id}`;
  const createdAt = new Date(created_at);

  const regexToMatchURL =
    /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

  const formattedText = text
    // Format all hyperlinks
    .replace(
      regexToMatchURL,
      (match) =>
        `<a style="color: rgb(29,161,242); font-weight:normal; text-decoration: none" href="${match}" target="_blank">${match.replace(
          /^http(s?):\/\//i,
          ""
        )}</a>`
    )
    // Format all @ mentions
    .replace(
      /\B\@([\w\-]+)/gim,
      (match) =>
        `<a style="color: rgb(29,161,242); font-weight:normal; text-decoration: none" href="https://twitter.com/${match.replace(
          "@",
          ""
        )}" target="_blank">${match}</a>`
    )
    // Format all # hashtags
    .replace(
      /(#+[a-zA-Z0-9(_)]{1,})/g,
      (match) =>
        `<a style="color: rgb(29,161,242); font-weight:normal; text-decoration: none" href="https://twitter.com/hashtag/${match.replace(
          "#",
          ""
        )}" target="_blank">${match}</a>`
    );

  const quoteTweet =
    referenced_tweets && referenced_tweets.find((t) => t.type === "quoted");

  const repliedTo =
    referenced_tweets && referenced_tweets.find((t) => t.type === "replied_to");

  const [copied, setCopied] = useState(false);

  return (
    <div
      className={`${className} tweet rounded-lg border border-gray-300 bg-white px-8 pt-6 pb-2 my-4 w-full`}
    >
      <div className="flex items-center">
        <a
          className="flex h-12 w-12 rounded-full overflow-hidden"
          href={authorUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BlurImage
            alt={author.username}
            height={48}
            width={48}
            src={author.profile_image_url}
          />
        </a>
        <a
          href={authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="author flex flex-col ml-4 !no-underline"
        >
          <span
            className="flex items-center font-bold text-gray-900 leading-5 mt-1"
            title={author.name}
          >
            {author.name}
            {author.verified ? (
              <svg
                aria-label="Verified Account"
                className="ml-1 text-blue-500 inline h-4 w-4"
                viewBox="0 0 24 24"
              >
                <g fill="currentColor">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                </g>
              </svg>
            ) : null}
          </span>
          <span
            className="!text-gray-500 text-base"
            title={`@${author.username}`}
          >
            @{author.username}
          </span>
        </a>
        <a
          className="ml-auto"
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            viewBox="328 355 335 276"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 630, 425    A 195, 195 0 0 1 331, 600    A 142, 142 0 0 0 428, 570    A  70,  70 0 0 1 370, 523    A  70,  70 0 0 0 401, 521    A  70,  70 0 0 1 344, 455    A  70,  70 0 0 0 372, 460    A  70,  70 0 0 1 354, 370    A 195, 195 0 0 0 495, 442    A  67,  67 0 0 1 611, 380    A 117, 117 0 0 0 654, 363    A  65,  65 0 0 1 623, 401    A 117, 117 0 0 0 662, 390    A  65,  65 0 0 1 630, 425    Z"
              style={{ fill: "#3BA9EE" }}
            />
          </svg>
        </a>
      </div>
      {repliedTo && repliedTo.username && (
        <div className="text-gray-500 text-base mt-5">
          Replying to{" "}
          <a
            className="!no-underline !text-[#1da1f2]"
            href={`https://twitter.com/${repliedTo.author.username}`}
            rel="noreferrer"
            target="_blank"
          >
            @{repliedTo.author.username}
          </a>
        </div>
      )}
      <div
        className="mt-4 mb-2 leading-normal whitespace-pre-wrap text-lg text-gray-700"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
      {media && media.length ? (
        <div
          className={
            media.length === 1
              ? "inline-grid grid-cols-1 gap-x-2 gap-y-2 my-2"
              : "inline-grid grid-cols-2 gap-x-2 gap-y-2 my-2"
          }
        >
          {media.map((m, i) => (
            <a href={tweetUrl} key={i} rel="noreferrer" target="_blank">
              {m.type == "video" || m.type == "animated_gif" ? (
                video ? (
                  <video
                    className="rounded-2xl -mt-10"
                    loop
                    width="2048px"
                    height="2048px"
                    autoPlay
                    muted
                    playsInline
                    src={video.url}
                  />
                ) : (
                  <BlurImage
                    key={m.media_key}
                    alt={text}
                    width={2048}
                    height={m.height * (2048 / m.width)}
                    src={m.preview_image_url}
                    className="rounded-2xl hover:brightness-90 transition-all ease-in-out duration-150"
                  />
                )
              ) : (
                <BlurImage
                  key={m.media_key}
                  alt={text}
                  width={2048}
                  height={m.height * (2048 / m.width)}
                  src={m.url}
                  className="rounded-2xl hover:brightness-90 transition-all ease-in-out duration-150"
                />
              )}
            </a>
          ))}
        </div>
      ) : null}
      {url_meta?.images ? (
        <a
          className="!no-underline"
          href={url_meta.unwound_url}
          rel="noreferrer"
          target="_blank"
        >
          <div className="rounded-2xl overflow-hidden border border-gray-200 drop-shadow-sm mb-5">
            <BlurImage
              key={url_meta.unwound_url}
              alt={url_meta.title}
              width={2048}
              height={1000}
              objectFit="cover"
              src={url_meta.images[0].url}
              className="hover:brightness-90 transition-all ease-in-out duration-150"
            />
            <div className="w-full bg-white px-8 py-2">
              <p className="!m-0">{url_meta.title}</p>
              <p className="text-sm">{url_meta.description}</p>
            </div>
          </div>
        </a>
      ) : null}
      {polls && (
        <div className="mt-5">
          {polls.map((poll) => {
            poll.total_votes = poll.options.reduce(
              (sum, option) => sum + option.votes,
              0
            );
            return poll.voting_status == "open" ? (
              <div>
                {poll.options.map((option, i) => (
                  <a
                    className="!no-underline"
                    href={tweetUrl}
                    key={i}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="text-center font-bold text-[#1da1f2] border border-[#1da1f2] rounded-3xl my-2 hover:bg-[#1da1f2] hover:bg-opacity-10 transition-all ease-in-out duration-150">
                      {option.label}
                    </div>
                  </a>
                ))}
                <div className="text-gray-500 text-base mt-4">
                  {poll.total_votes} votes ·{" "}
                  {getRemainingTime(poll.end_datetime)} left
                </div>
              </div>
            ) : (
              <div>
                {poll.options.map((option) => (
                  <>
                    <div
                      className={classNames(
                        option.position == 1 ? "font-bold" : "",
                        "relative text-black my-2 cursor-pointer px-3 whitespace-nowrap flex justify-between"
                      )}
                    >
                      <p className="!my-0 z-10">{option.label}</p>
                      <p className="!my-0 z-10">{`${(
                        (option.votes / poll.total_votes) *
                        100
                      )
                        .toFixed(1)
                        .replace(".0", "")}%`}</p>
                      <div
                        className={classNames(
                          option.position == 1
                            ? "font-bold bg-[#1da1f2]"
                            : "bg-gray-300",
                          "absolute top-0 left-0 rounded-md w-full h-full"
                        )}
                        style={{
                          width: `${Math.round(
                            (option.votes / poll.total_votes) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </>
                ))}
                <div className="text-gray-500 text-base mt-4">
                  {poll.total_votes} votes · Final results
                </div>
              </div>
            );
          })}
        </div>
      )}
      {quoteTweet && quoteTweet.author && (
        <Tweet id={quoteTweet.id} metadata={JSON.stringify(quoteTweet)} />
      )}
      <a
        className="block mt-3 mb-4 !text-gray-500 text-base hover:!underline !no-underline"
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <time
          title={`Time Posted: ${createdAt.toUTCString()}`}
          dateTime={createdAt.toISOString()}
        >
          {format(createdAt, "h:mm a - MMM d, y")}
        </time>
      </a>
      <div className="border-t border-gray-300 pt-1 flex space-x-2 md:space-x-6 text-base text-gray-700 mt-2">
        <a
          className="flex items-center !text-gray-500 group transition !no-underline space-x-1"
          href={likeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="group-hover:!text-red-600 rounded-full w-10 h-10 group-hover:bg-red-100 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                className="fill-current"
                d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.813-1.148 2.353-2.73 4.644-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.375-7.454 13.11-10.037 13.156H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.035 11.596 8.55 11.658 1.52-.062 8.55-5.917 8.55-11.658 0-2.267-1.822-4.255-3.902-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.015-.03-1.426-2.965-3.955-2.965z"
              />
            </svg>
          </div>
          <span className="group-hover:!text-red-600 group-hover:!underline">
            {new Number(public_metrics.like_count).toLocaleString()}
          </span>
        </a>
        <a
          className="flex items-center mr-4 !text-gray-500 group transition !no-underline space-x-1"
          href={retweetUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="group-hover:!text-purple-600 rounded-full w-10 h-10 group-hover:bg-purple-100 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                className="fill-current"
                d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
              />
            </svg>
          </div>
          <span className="group-hover:!text-purple-600 group-hover:!underline">
            {new Number(public_metrics.retweet_count).toLocaleString()}
          </span>
        </a>
        <a
          className="flex items-center mr-4 !text-gray-500 group transition !no-underline space-x-1"
          href={replyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="group-hover:!text-[#1da1f2] rounded-full w-10 h-10 group-hover:bg-blue-100 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                className="fill-current"
                d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.045.286.12.403.143.225.385.347.633.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.368-3.43-7.788-7.8-7.79zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.334-.75-.75-.75h-.395c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"
              />
            </svg>
          </div>
          <span className="group-hover:!text-[#1da1f2] group-hover:!underline">
            {new Number(public_metrics.reply_count).toLocaleString()}
          </span>
        </a>
        <button
          className="flex items-center mr-4 !text-gray-500 group transition !no-underline space-x-1"
          onClick={() => {
            navigator.clipboard.writeText(tweetUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 5000);
          }}
        >
          <div className="group-hover:!text-green-600 rounded-full w-10 h-10 group-hover:bg-green-100 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                className="fill-current"
                d={
                  copied
                    ? "M9 20c-.264 0-.52-.104-.707-.293l-4.785-4.785c-.39-.39-.39-1.023 0-1.414s1.023-.39 1.414 0l3.946 3.945L18.075 4.41c.32-.45.94-.558 1.395-.24.45.318.56.942.24 1.394L9.817 19.577c-.17.24-.438.395-.732.42-.028.002-.057.003-.085.003z"
                    : "M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"
                }
              />
            </svg>
          </div>
          <span className="group-hover:!text-green-600 group-hover:!underline sm:block hidden">
            {copied ? "Copied!" : "Copy link to Tweet"}
          </span>
        </button>
      </div>
    </div>
  );
}
