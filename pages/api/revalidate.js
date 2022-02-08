export default async function handler(req, res) {
  // ... authenticate request ...
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
