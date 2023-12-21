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
  Link,
} from "@react-email/components";
import { render } from "@react-email/render";
import { brand } from "@/lib/constants";
import { Organization } from "@prisma/client";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY as string);

type MagicLinkEmailProps = {
  org?: Organization;
  url: string;
  email: string;
};

function getMagicLinkSubjectLine(org?: Organization): string {
  return "Sign in to " + (org?.name ? org?.name : "Fora");
}

export const sendMagicLinkEmail = (props: MagicLinkEmailProps) => {
  return resend.emails.send({
    from: "Fora <no-reply@mail.fora.co>",
    to: [props.email],
    subject: getMagicLinkSubjectLine(props.org),
    html: render(<MagicLinkEmail {...props} />, {
      pretty: true,
    }),
  });
};

export const MagicLinkEmail = ({ org, url }: MagicLinkEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{getMagicLinkSubjectLine(org)}</Preview>
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
        <Body className={"w-full font-sans"}>
          <Container className="rounded bg-gray-150 px-16 pb-12 pt-10">
            <Img
              src={org?.logo ? org.logo : `https://fora.co/fora-logo.png`}
              width="40"
              height="40"
              alt="Fora Logo"
              className={"rounded-full"}
            />
            <Text className="font-serif text-xl font-bold text-gray-800 py-3">
              {getMagicLinkSubjectLine(org)}
            </Text>

              <Link
                href={url}
                className="h-10 cursor-pointer rounded-full bg-gray-800 px-6 py-3 font-semibold text-gray-200"
              >
                {`Sign In`}
              </Link>

            {/* <Section>
              <Text className={"text-md text-gray-700"}>
                {"If you did not initiate this request someone may be trying to get access to this account."}
              </Text>
            </Section> */}
            <Hr className="my-5 border-gray-600" />
            <Text className={"text-md text-gray-700"}>
              {org?.name || "Fora Cities, Inc."}
            </Text>
            {/* <Text className={"text-xs text-gray-600"}>
              1111b S Governors Avenue STE 7236 Dover, DE 19904 US
            </Text> */}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
