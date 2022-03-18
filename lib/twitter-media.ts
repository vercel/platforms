import type { MediaTweet } from "@/types";

interface Video {
  bitrate: number;
  content_type: string;
  url: string;
}

export async function getTwitterMedia(id: string): Promise<Video | undefined> {
  try {
    const response = await fetch(
      `https://api.twitter.com/1.1/statuses/show.json?id=${id}&tweet_mode=extended`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_AUTH_TOKEN}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch Twitter media");

    const data = (await response.json()) as MediaTweet;

    return (
      data.extended_entities.media[0].video_info.variants
        // Filter to only include MP4 videos
        .filter((variant) => variant.content_type === "video/mp4")

        // Get the video with the best bitrate
        .reduce((prev, current) =>
          prev.bitrate > current.bitrate ? prev : current
        )
    );
  } catch (error) {
    console.error(id, error);
  }
}
