"use server";
import { initKafka } from "./kafka";

type AllowedPropertyValues = string | number | boolean | null;
const ANALYTICS_TOPIC = "analytics_event";

export const track = async (
  type: ALLOWED_ANALYTICS_EVENTS,
  data?: Record<string, AllowedPropertyValues>,
) => {
  const kafka = initKafka();

  try {
    const producer = kafka.producer();

    return producer.produce(ANALYTICS_TOPIC, {
      type,
      data,
    });
  } catch (error) {
    console.error(
      "Failed to produce analytics event: ",
      type,
      " with error: ",
      error,
    );
  }
};

export type ALLOWED_ANALYTICS_EVENTS =
  | "email_subscription_created"
  | "user_signup"
  | "city_created"
  | "city_deleted"
  | "form_created"
  | "form_updated"
  | "event_created"
  | "post_created"
  | "post_deleted"
  | "role_created"
  | "role_deleted";
