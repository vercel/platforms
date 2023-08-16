"use client";

import { AreaChart, BadgeDelta, Card, Flex, Metric, Text } from "@tremor/react";
import { useMemo } from "react";

import { random } from "@/lib/utils";

export default function OverviewStats() {
  const data = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return [
      ...months.map((month) => ({
        Month: `${month} 23`,
        "Total Visitors": random(20000, 170418),
      })),
      {
        Month: "Jul 23",
        "Total Visitors": 170418,
      },
    ];
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="dark:!bg-stone-900">
        <Text>Total Visitors</Text>
        <Flex
          alignItems="baseline"
          className="space-x-3 truncate"
          justifyContent="start"
        >
          <Metric className="font-cal">170,418</Metric>
          <BadgeDelta
            className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
            deltaType="moderateIncrease"
          >
            34.3%
          </BadgeDelta>
        </Flex>
        <AreaChart
          categories={["Total Visitors"]}
          className="mt-6 h-28"
          colors={["blue"]}
          data={data}
          index="Month"
          showGridLines={false}
          showLegend={false}
          showXAxis={true}
          showYAxis={false}
          startEndOnly={true}
          valueFormatter={(number: number) =>
            `${Intl.NumberFormat("us").format(number).toString()}`
          }
        />
      </Card>
    </div>
  );
}
