/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "fora.co",
      "ooybxjivdvmpbxtwunrr.supabase.co",
      "agxfxvcrqbumicguksnl.supabase.co",
      "public.blob.vercel-storage.com",
      "res.cloudinary.com",
      "abs.twimg.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "www.google.com",
      "flag.vercel.app",
      "illustrations.popsy.co",
      "avatar.vercel.sh"
    ],
  },
  reactStrictMode: false,
};
