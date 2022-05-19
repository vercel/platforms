const isProduction = process.env.NODE_ENV === "production";

const appLink = () => {
  return isProduction ? "https://app.hlist.me" : "http://app.localhost:3000";
};

export const homeLink = () => {
  return isProduction ? "https://hlist.me" : "http://localhost:3000";
};

export const getSiteSubDomain = (subDomain?: string | null, url = true) => {
  if (!subDomain) {
    return url ? appLink() : "Site not found";
  }

  if (!url) {
    return isProduction
      ? `${subDomain}.hlist.me`
      : `${subDomain}.localhost:3000`;
  }

  return isProduction
    ? `https://${subDomain}.hlist.me`
    : `http://${subDomain}.localhost:3000`;
};

export default appLink;
