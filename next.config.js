/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  experimental: {
    serverActions: true,
  },
  webpack(config) {
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,
      fs: false, // for pcd
    };
    return config;
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
      "avatar.vercel.sh",
    ],
  },
  reactStrictMode: false,
};
