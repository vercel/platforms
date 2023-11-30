import { Kafka } from "@upstash/kafka";
import { NextFetchEvent, NextRequest, userAgent } from "next/server";

declare global {
  var kafka: Kafka | undefined;
}

const kafka =
  global.kafka ||
  new Kafka({
    url: process.env.UPSTASH_KAFKA_REST_URL as string,
    username: process.env.UPSTASH_KAFKA_REST_USERNAME as string,
    password: process.env.UPSTASH_KAFKA_REST_PASSWORD as string,
  });

export async function produceKafkaEvent(
  req: NextRequest,
  event: NextFetchEvent,
) {
  try {
    const eventProducer = kafka.producer();
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
    const hostname = req.headers
      .get("host")!
      .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = url.pathname;
    const searchParams = url.searchParams;
    const { device } = userAgent(req);

    const topic = "fora_request";
    const message = {
      hostname,
      xForwardedHost: req.headers.get("x-forwarded-host") || undefined,
      path,
      searchParams,
      hash: url.hash,
      locale: url.locale,
      city: req.geo?.city,
      country: req.geo?.country,
      region: req.geo?.region,
      url: req.url,
      ip: req.ip,
      device: device,
      userAgent: req.headers.get("user-agent"),
    };

    if (eventProducer) {
      event.waitUntil(eventProducer.produce(topic, JSON.stringify(message)));
    }
  } catch (error) {
    console.warn("Failed to produce event. ", error);
  }
}


export default kafka;
