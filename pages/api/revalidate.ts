import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "https://app.vercel.pub");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // ... authenticate request ...
  // ... e.g. parse webhook from req.body ...
  const { urlPath } = req.body;

  try {
    // e.g.
    // await revalidate('/blog')
    // await revalidate('/blog/hello-world')
    await res.unstable_revalidate(urlPath);

    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Failed to revalidate "${urlPath}"`,
    });
  }
}
