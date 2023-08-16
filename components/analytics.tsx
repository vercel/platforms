"use client";

import {
  AreaChart,
  BarList,
  Bold,
  Card,
  Flex,
  Grid,
  Text,
  Title,
} from "@tremor/react";
import Image from "next/image";

const chartdata = [
  {
    Visitors: 2890,
    date: "Jan 23",
  },
  {
    Visitors: 2756,
    date: "Feb 23",
  },
  {
    Visitors: 3322,
    date: "Mar 23",
  },
  {
    Visitors: 3470,
    date: "Apr 23",
  },
  {
    Visitors: 3475,
    date: "May 23",
  },
  {
    Visitors: 3129,
    date: "Jun 23",
  },
];

const pages = [
  { name: "/platforms-starter-kit", value: "1,230" },
  { name: "/vercel-is-now-bercel", value: 751 },
  { name: "/nextjs-conf", value: 471 },
  { name: "/150m-series-d", value: 280 },
  { name: "/about", value: 78 },
];

const referrers = [
  { name: "t.co", value: 453 },
  { name: "vercel.com", value: 351 },
  { name: "linkedin.com", value: 271 },
  { name: "google.com", value: 191 },
  {
    name: "news.ycombinator.com",
    value: 71,
  },
];

const countries = [
  { code: "US", name: "United States of America", value: 789 },
  { code: "IN", name: "India", value: 676 },
  { code: "DE", name: "Germany", value: 564 },
  { code: "GB", name: "United Kingdom", value: 234 },
  { code: "ES", name: "Spain", value: 191 },
];

const categories = [
  {
    data: pages,
    subtitle: "Page",
    title: "Top Pages",
  },
  {
    data: referrers,
    subtitle: "Source",
    title: "Top Referrers",
  },
  {
    data: countries,
    subtitle: "Country",
    title: "Countries",
  },
];

export default function AnalyticsMockup() {
  return (
    <div className="grid gap-6">
      <Card>
        <Title>Visitors</Title>
        <AreaChart
          categories={["Visitors"]}
          className="mt-4 h-72"
          colors={["indigo"]}
          data={chartdata}
          index="date"
          valueFormatter={(number: number) =>
            Intl.NumberFormat("us").format(number).toString()
          }
        />
      </Card>
      <Grid className="gap-6" numItemsLg={3} numItemsSm={2}>
        {categories.map(({ data, subtitle, title }) => (
          <Card className="max-w-lg" key={title}>
            <Title>{title}</Title>
            <Flex className="mt-4">
              <Text>
                <Bold>{subtitle}</Bold>
              </Text>
              <Text>
                <Bold>Visitors</Bold>
              </Text>
            </Flex>
            <BarList
              // @ts-ignore
              className="mt-2"
              data={data.map(({ code, name, value }) => ({
                icon: () => {
                  if (title === "Top Referrers") {
                    return (
                      <Image
                        alt={name}
                        className="mr-2.5"
                        height={20}
                        src={`https://www.google.com/s2/favicons?sz=64&domain_url=${name}`}
                        width={20}
                      />
                    );
                  } else if (title === "Countries") {
                    return (
                      <Image
                        alt={code}
                        className="mr-2.5"
                        height={16}
                        src={`https://flag.vercel.app/m/${code}.svg`}
                        width={24}
                      />
                    );
                  } else {
                    return null;
                  }
                },
                name,
                value,
              }))}
            />
          </Card>
        ))}
      </Grid>
    </div>
  );
}
