import { Kafka } from "@upstash/kafka";
import { NextFetchEvent, NextRequest } from "next/server";

export function initKafka() {
  const { KAFKA_BROKER, KAFKA_USERNAME, KAFKA_PASSWORD } = process.env;
  if (!KAFKA_BROKER || !KAFKA_USERNAME || !KAFKA_PASSWORD) {
    console.warn(
      "Kafka environment variables are not set. Analytics is disabled.",
    );
    return;
  }

  try {
    const kafka = new Kafka({
      url: KAFKA_BROKER,
      username: KAFKA_USERNAME,
      password: KAFKA_PASSWORD,
    });

    return kafka;
  } catch (error) {
    console.warn("Failed to connect to Kafka. Analytics is disabled.", error);
  }
}

export async function produceKafkaEvent(
  req: NextRequest,
  event: NextFetchEvent,
) {
  try {
    const kafka = initKafka();
    const eventProducer = kafka?.producer();
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
    const hostname = req.headers
      .get("host")!
      .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = url.pathname;
    const searchParams = url.searchParams;

    const topic = "fora_request";

    const message = {
      hostname,
      path,
      searchParams,
      country: req.geo?.country,
      city: req.geo?.city,
      region: req.geo?.region,
      url: req.url,
      ip: req.headers.get("x-real-ip"),
      mobile: req.headers.get("sec-ch-ua-mobile"),
      platform: req.headers.get("sec-ch-ua-platform"),
      useragent: req.headers.get("user-agent"),
    };

    if (eventProducer) {
      event.waitUntil(eventProducer.produce(topic, JSON.stringify(message)));
    }
  } catch (error) {
    console.warn("Failed to produce event. ", error);
  }
}
