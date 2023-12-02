import {
  Tailwind,
  Button,
  Html,
  Head,
  Preview,
  Body,
  Container,
  Img,
  Text,
  Section,
  Hr,
} from "@react-email/components";
import { render } from "@react-email/render";
import { brand } from "@/lib/colors";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

type WaitlistWelcomeEmailProps = { userFirstname: string };

export const WaitlistWelcomeEmail = ({
  userFirstname,
}: WaitlistWelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Fora!</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand,
                gray: brand.gray,
              },
            },
          },
        }}
      >
        <Body className={"font-sans"}>
          <Container className="mx-auto  rounded bg-gray-250 px-5 pb-12 pt-10">
            <Img
              src={`https://fora.co/fora-logo.png`}
              width="45"
              height="45"
              alt="Fora Logo"
              className={"mx-auto"}
            />
            <Text className="text-md text-gray-800">Hi {userFirstname},</Text>
            <Text className="text-md text-gray-800">
              Welcome to Fora, the platform for startup cities.
            </Text>
            <Text className="text-md text-gray-800">
              Fora is currently in private beta. You have been added to the
              first cohort to be notified when we launch. In the meantime, we
              will review your submission and will be in touch shortly.
            </Text>
            <Text className="text-md text-gray-800">
              Best,
              <br />
              The Fora team.
            </Text>
            <Hr className="my-5 border-gray-600" />
            <Text className={"text-md text-gray-700"}>Fora Cities, Inc.</Text>
            <Text className={"text-xs text-gray-600"}>
              1111b S Governors Avenue STE 7236 Dover, DE 19904 US
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const renderWaitlistWelcomeEmail = (props: WaitlistWelcomeEmailProps) =>
  render(<WaitlistWelcomeEmail {...props} />, {
    pretty: true,
  });
