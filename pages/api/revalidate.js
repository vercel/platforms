export default async function handler(req, res) {
  const urlPath = req.body.urlPath;
  try {
    await res.unstable_revalidate(urlPath);
  } catch {
    res.status(500);
    return res.json({ message: `Failed to revalidate "${urlPath}"` });
  }
  return res.json({ message: "OK" });
}
