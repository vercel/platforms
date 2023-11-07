"use client";

import { random } from "@/lib/utils";
import { Card, Metric, Text, AreaChart, BadgeDelta, Flex } from "@tremor/react";
import { useMemo } from "react";

export default function CityOverviewStats() {
  const data = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return [
      ...months.map((month) => ({
        Month: `${month} 23`,
        "Total Visitors": random(20000, 170418),
      })),
    ];
  }, []);

  const visitorsData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return [
      ...months.map((month) => ({
        Month: `${month} 23`,
        "Total Backers": random(10, 200),
      })),
    ];
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <Card className="bg-gray-100 dark:!bg-gray-900">
        <Text>Total Backers</Text>
        <Flex
          className="space-x-3 truncate"
          justifyContent="start"
          alignItems="baseline"
        >
          <Metric className="font-cal">
            {visitorsData.reduce(
              (a, b) => (b["Total Backers"] as number) + a,
              0,
            )}
          </Metric>
          <BadgeDelta
            deltaType="moderateIncrease"
            className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
          >
            17%
          </BadgeDelta>
        </Flex>
        <AreaChart
          className="mt-6 h-20"
          data={visitorsData}
          index="Month"
          valueFormatter={(number: number) =>
            `${Intl.NumberFormat("us").format(number).toString()}`
          }
          categories={["Total Backers"]}
          colors={["emerald"]}
          showXAxis={true}
          showGridLines={false}
          startEndOnly={true}
          showYAxis={false}
          showLegend={false}
        />
      </Card>
      <Card className="bg-gray-100 dark:!bg-gray-900">
        <Text>Treasury Value</Text>
        <Flex
          className="space-x-3 truncate"
          justifyContent="start"
          alignItems="baseline"
        >
          <Metric className="font-cal">
            ${" "}
            {Intl.NumberFormat("us")
              .format(
                data.reduce((a, b) => (b["Total Visitors"] as number) + a, 0),
              )
              .toString()}
          </Metric>
          <BadgeDelta
            deltaType="moderateIncrease"
            className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
          >
            34.3%
          </BadgeDelta>
        </Flex>
        <AreaChart
          className="mt-6 h-20"
          data={data}
          index="Month"
          valueFormatter={(number: number) =>
            `${Intl.NumberFormat("us").format(number).toString()}`
          }
          categories={["Total Visitors"]}
          colors={["emerald"]}
          showXAxis={true}
          showGridLines={false}
          startEndOnly={true}
          showYAxis={false}
          showLegend={false}
        />
      </Card>

      <Card className="bg-gray-100 dark:!bg-gray-900">
        <Text>Total Visitors</Text>
        <Flex
          className="space-x-3 truncate"
          justifyContent="start"
          alignItems="baseline"
        >
          <Metric className="font-cal">10,418</Metric>
          <BadgeDelta
            deltaType="moderateIncrease"
            className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
          >
            17%
          </BadgeDelta>
        </Flex>
        <AreaChart
          className="mt-6 h-20"
          data={data}
          index="Month"
          valueFormatter={(number: number) =>
            `${Intl.NumberFormat("us").format(number).toString()}`
          }
          categories={["Total Visitors"]}
          colors={["emerald"]}
          showXAxis={true}
          showGridLines={false}
          startEndOnly={true}
          showYAxis={false}
          showLegend={false}
        />
      </Card>
    </div>
  );
}
