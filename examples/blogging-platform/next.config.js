module.exports = {
  images: {
    domains: [
      "res.cloudinary.com",
      "abs.twimg.com",
      "pbs.twimg.com",
      "avatar.tobi.sh",
      "og-image.vercel.app",
    ],
  },
  redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "daojon.es",
          },
        ],
        destination: "https://daocentral.com/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "daojon.es",
          },
        ],
        destination: "https://daocentral.com/dao/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "daocentr.al",
          },
        ],
        destination: "https://daocentral.com/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "daocentr.al",
          },
        ],
        destination: "https://daocentral.com/dao/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "daojones.fyi",
          },
        ],
        destination: "https://daocentral.com/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "daojones.fyi",
          },
        ],
        destination: "https://daocentral.com/:path*",
        permanent: true,
      },
    ];
  },
};
