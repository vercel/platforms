"use server";

type PageViewsData = {
  hostname: string;
  path: string;
  "count()": number;
};

export const getCityPageViews = async (subdomain: string) => {
  let url = new URL(
    `https://api.us-east.tinybird.co/v0/pipes/city_page_views_pipe.json`,
  );

  const hostname = `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  console.log("hostname: ", hostname);

  url.searchParams.append("hostname", hostname);
  url.searchParams.append("custom_domain", subdomain);

  const result = await fetch(url, {
    headers: {
      Authorization: "Bearer " + process.env.TINYBIRD_TOKEN_CITY_PAGE_VIEWS,
    },
  })
    .then((r) => r.json())
    .then((r) => r)
    .catch((e) => e.toString());

  if (!result.data) {
    console.error(`there is a problem running the query: ${result}`);
    return;
  }
  return result.data as PageViewsData[];
};

export const getCityPageViewsOriginCountry = async (
  subdomainOrDomain: string,
) => {
  let url = new URL(
    `https://api.us-east.tinybird.co/v0/pipes/city_page_views_origin_country_pipe.json`,
  );

  url.searchParams.append("hostname", subdomainOrDomain + ".fora.co");
  url.searchParams.append("custom_domain", subdomainOrDomain);

  const result = await fetch(url, {
    headers: {
      Authorization:
        "Bearer " + process.env.TINYBIRD_TOKEN_CITY_PAGE_VIEWS_ORIGIN_COUNTRY,
    },
  })
    .then((r) => r.json())
    .then((r) => r)
    .catch((e) => e.toString());

  if (!result.data) {
    console.error(`there is a problem running the query: ${result}`);
    return;
  }
  return result.data;
};
