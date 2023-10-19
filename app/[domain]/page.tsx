import { notFound } from "next/navigation";
import { getPostsForOrganization, getSiteData } from "@/lib/fetchers";
import { getSession } from "@/lib/auth";

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  // domain = domain.replace('%3A', ':');
  const domain = params.domain.replace('%3A', ':');
  const session = await getSession();
  const [sitedata, posts] = await Promise.all([
    getSiteData(domain),
    getPostsForOrganization(domain),
  ]);

  if (!sitedata) {
    notFound();
  }

  console.log('session: ', session);

  return (
    <>
      <div className="mb-20 w-full">
        {session?.user.email}
        {session?.user.id}
        {session?.user.name}
        {session?.user.username}
      </div>

      {/* {posts.length > 1 && (
        <div className="mx-5 mb-20 max-w-screen-xl lg:mx-24 2xl:mx-auto">
          <h2 className="mb-10 font-title text-4xl dark:text-white md:text-5xl">
            More stories
          </h2>
          <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
            {posts.slice(1).map((metadata, index) => (
              <BlogCard key={index} data={metadata} />
            ))}
          </div>
        </div>
      )} */}
    </>
  );
}
