import Cors from "cors";

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST"],
    origin: ["https://app.vercel.pub", "http://app.localhost:3000"],
  })
);

export default async function handler(req, res) {
  // Run cors
  await cors(req, res);

  // ... e.g. parse webhook from req.body ...
  const urlPath = req.body.urlPath;
  try {
    // e.g.
    // await revalidate('/blog')
    // await revalidate('/blog/hello-world')
    await res.unstable_revalidate(urlPath);
  } catch {
    res.status(500);
    return res.json({ message: `Failed to revalidate "${urlPath}"` });
  }
  return res.json({ message: "OK" });
}
