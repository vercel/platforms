import { Kafka } from "@upstash/kafka";
import { NextFetchEvent, NextRequest, userAgent } from "next/server";

export function initKafka() {
  const {
    UPSTASH_KAFKA_REST_URL,
    UPSTASH_KAFKA_REST_USERNAME,
    UPSTASH_KAFKA_REST_PASSWORD,
  } = process.env;
  if (
    !UPSTASH_KAFKA_REST_URL ||
    !UPSTASH_KAFKA_REST_USERNAME ||
    !UPSTASH_KAFKA_REST_PASSWORD
  ) {
    console.warn(
      "Kafka environment variables are not set. Analytics is disabled.",
    );
    throw new Error(
      "Kafka environment variables are not set. Analytics is disabled.",
    );
  }

  try {
    const kafka = new Kafka({
      url: UPSTASH_KAFKA_REST_URL,
      username: UPSTASH_KAFKA_REST_USERNAME,
      password: UPSTASH_KAFKA_REST_PASSWORD,
    });

    return kafka;
  } catch (error) {
    console.warn("Failed to connect to Kafka", error);
    throw new Error("Failed to connect to Kafka");
  }
}

export async function produceKafkaEvent(
  req: NextRequest,
  event: NextFetchEvent,
) {
  try {
    const eventProducer = initKafka().producer();
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
