module.exports = {
    images: {
        domains: ['og-image.vercel.app', 'pbs.twimg.com', 'avatars.githubusercontent.com']
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
}