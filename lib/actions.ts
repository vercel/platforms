"use server";

import prisma from "@/lib/prisma";
import {
  Event,
  Post,
  Organization,
  Role,
  Form,
  Question,
  Prisma,
  QuestionType,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import {
  withPostAuth,
  withOrganizationAuth,
  withEventAuth,
  withEventRoleAuth,
} from "./auth";
import { getSession } from "@/lib/auth";
import {
  addDomainToVercel,
  // getApexDomain,
  removeDomainFromVercelProject,
  // removeDomainFromVercelTeam,
  validDomainRegex,
} from "@/lib/domains";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";
import supabase from "./supabase";
import { CreatTicketTierFormSchema } from "./schema";
import { z } from "zod";
import { JSONValue } from "ai";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const createOrganization = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;

  try {
    const [role, organization] = await prisma.$transaction([
      prisma.role.create({
        data: {
          name: "Admin",
        },
      }),
      prisma.organization.create({
        data: {
          name,
          description,
          subdomain,
        },
        include: {
          roles: true,
        },
      }),
    ]);

    try {
      await prisma.$transaction([
        prisma.organizationRole.create({
          data: {
            organization: {
              connect: {
                id: organization.id,
              },
            },
            role: {
              connect: {
                id: role.id,
              },
            },
          },
        }),
        prisma.userRole.create({
          data: {
            user: {
              connect: {
                id: session.user.id,
              },
            },
            role: {
              connect: {
                id: role.id,
              },
            },
          },
        }),
      ]);
    } catch (error) {
      // If user role creation fails, delete the organization
      await prisma.role.delete({
        where: {
          id: role.id,
        },
      });
      await prisma.organization.delete({
        where: {
          id: organization.id,
        },
      });
      throw error; // Re-throw the error to be handled by the outer catch block
    }

    await revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    return organization;
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export async function userOrgRoles(userId: string, organizationId: string) {
  return await prisma.userRole.findMany({
    where: {
      userId: userId,
      role: {
        organizationRole: {
          some: {
            organizationId: organizationId,
          },
        },
      },
    },
    include: {
      role: true,
    },
  });
}

export async function userHasOrgRole(
  userId: string,
  organizationId: string,
  roleName: string,
) {
  const userRoles = await prisma.userRole.findMany({
    where: {
      userId: userId,
      role: {
        organizationRole: {
          some: {
            organizationId: organizationId,
            role: {
              name: roleName,
            },
          },
        },
      },
    },
  });

  return userRoles.length > 0;
}

export async function getUserEventRoles(userId: string, eventId: string) {
  const userRoles = await prisma.userRole.findMany({
    where: {
      userId: userId,
      role: {
        eventRole: {
          some: {
            eventId: eventId,
          },
        },
      },
    },
    include: {
      role: true,
    },
  });

  return userRoles;
}

export async function userHasEventRole(
  userId: string,
  eventId: string,
  role: string,
) {
  const userEventRoles = await getUserEventRoles(userId, eventId);
  const hasRole =
    userEventRoles.findIndex((eventRole) => eventRole.role.name === role) > -1;
  return hasRole;
}

export const createEvent = async (input: {
  name: string;
  description: string;
  organizationId: string;
  path: string;
}) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const name = input.name;
  const description = input.description;
  const organizationId = input.organizationId;
  const path = input.path;

  const hasAdminRole = await userHasOrgRole(
    session.user.id,
    organizationId,
    "Admin",
  );

  console.log("has admin role: ", hasAdminRole);

  try {
    const [event, role] = await prisma.$transaction([
      prisma.event.create({
        data: {
          name,
          description,
          path,
          organization: {
            connect: {
              id: organizationId,
            },
          },
        },
      }),
      prisma.role.create({
        data: {
          name: "Host",
        },
      }),
    ]);

    const [_eventRole, _userRole] = await prisma.$transaction([
      prisma.eventRole.create({
        data: {
          event: {
            connect: {
              id: event.id,
            },
          },
          role: {
            connect: {
              id: role.id,
            },
          },
        },
      }),
      prisma.userRole.create({
        data: {
          user: {
            connect: {
              id: session.user.id,
            },
          },
          role: {
            connect: {
              id: role.id,
            },
          },
        },
      }),
    ]);

    return event;
  } catch (error: any) {
    console.error(error);
    return {
      error: error.message,
    };
  }
};

export async function getOrganizationData(domain: string) {
  return await prisma.organization.findFirst({
    where: {
      // Assuming domain can be either subdomain or customDomain
      OR: [{ subdomain: domain }, { customDomain: domain }],
    },
  });
}

export async function getEventData(path: string, domain: string) {
  return await prisma.event.findFirst({
    where: {
      path: path,
      organization: {
        // Assuming domain can be either subdomain or customDomain
        OR: [{ subdomain: domain }, { customDomain: domain }],
      },
    },
    include: {
      organization: true,
    },
  });
}

export const updateOrganization = withOrganizationAuth(
  async (formData: FormData, organization: Organization, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              customDomain: value,
            },
          });
          await addDomainToVercel(value);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        // if the Organization had a different customDomain before, we need to remove it from Vercel
        if (organization.customDomain && organization.customDomain !== value) {
          response = await removeDomainFromVercelProject(
            organization.customDomain,
          );

          /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other Organizations
          const apexDomain = getApexDomain(`https://${organization.customDomain}`);
          const domainCount = await prisma.organization.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other Organizations
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(organization.customDomain);
          } else {
            // this is the only Organization using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              organization.customDomain
            );
          }
          
          */
        }
      } else if (key === "image" || key === "logo") {
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
          return {
            error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY token.",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { data, error } = await supabase.storage
          .from("media")
          .upload(`/public/${filename}`, file);

        console.log({ data, error });
        // const { url } = await put(filename, file, {
        //   access: "public",
        // });

        if (error || !data?.path) {
          return {
            error: "Failed to upload image.",
          };
        }
        const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${data.path}`;

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else {
        response = await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            [key]: value,
          },
        });
      }
      console.log(
        "Updated Organization data! Revalidating tags: ",
        `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${organization.customDomain}-metadata`,
      );
      await revalidateTag(
        `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      organization.customDomain &&
        (await revalidateTag(`${organization.customDomain}-metadata`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteOrganization = withOrganizationAuth(
  async (_: FormData, organization: Organization) => {
    try {
      const response = await prisma.organization.delete({
        where: {
          id: organization.id,
        },
      });
      await revalidateTag(
        `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      response.customDomain &&
        (await revalidateTag(`${organization.customDomain}-metadata`));
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const getOrganizationFromPostId = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      organization: {
        select: {
          subdomain: true,
        },
      },
    },
  });
  return post?.organization?.subdomain ?? undefined;
};

export const createPost = withOrganizationAuth(
  async (_: FormData, organization: Organization) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const response = await prisma.post.create({
      data: {
        organizationId: organization.id,
        userId: session.user.id,
      },
    });

    await revalidateTag(
      `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
    );
    organization.customDomain &&
      (await revalidateTag(`${organization.customDomain}-posts`));

    return response;
  },
);

// creating a separate function for this because we're not using FormData
export const updatePost = async (data: Post) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: data.id,
    },
    include: {
      organization: true,
    },
  });
  if (!post || post.userId !== session.user.id) {
    return {
      error: "Post not found",
    };
  }
  try {
    const response = await prisma.post.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
      },
    });

    await revalidateTag(
      `${post.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
    );
    await revalidateTag(
      `${post.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`,
    );

    // if the Organization has a custom domain, we need to revalidate those tags too
    post.organization?.customDomain &&
      (await revalidateTag(`${post.organization?.customDomain}-posts`),
      await revalidateTag(`${post.organization?.customDomain}-${post.slug}`));

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updatePostMetadata = withPostAuth(
  async (
    formData: FormData,
    post: Post & {
      organization: Organization;
    },
    key: string,
  ) => {
    console.log('post: ', post);
    const value = formData.get(key) as string;

    try {
      let response;
      if (key === "image") {
        const file = formData.get("image") as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = await getBlurDataURL(url);

        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            image: url,
            imageBlurhash: blurhash,
          },
        });
      } else {
        response = await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            [key]: key === "published" ? value === "true" : value,
          },
        });
      }

      await revalidateTag(
        `${post.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
      );
      await revalidateTag(
        `${post.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`,
      );

      // if the Organization has a custom domain, we need to revalidate those tags too
      post.organization?.customDomain &&
        (await revalidateTag(`${post.organization?.customDomain}-posts`),
        await revalidateTag(`${post.organization?.customDomain}-${post.slug}`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This slug is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deletePost = withPostAuth(async (_: FormData, post: Post) => {
  try {
    const response = await prisma.post.delete({
      where: {
        id: post.id,
      },
      select: {
        organizationId: true,
      },
    });
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const value = formData.get(key) as string;

  try {
    const response = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [key]: value,
      },
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const createEventRole = withEventAuth(
  async (formData: FormData, event: Event & { organization: Organization }) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      const role = await prisma.role.create({
        data: {
          name,
          description,
        },
      });

      await prisma.eventRole.create({
        data: {
          eventId: event.id,
          roleId: role.id,
        },
      });

      return role;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const updateEventRole = withEventRoleAuth(
  async (
    formData: FormData,
    data: { role: Role; event: Event; organization: Organization },
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      const role = await prisma.role.update({
        where: {
          id: data.role.id,
        },
        data: {
          name,
          description,
        },
      });

      return role;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const deleteEventRole = withEventRoleAuth(
  async (
    _: FormData,
    data: { role: Role; event: Event; organization: Organization },
  ) => {
    try {
      const response = await prisma.$transaction([
        prisma.eventRole.delete({
          where: {
            roleId_eventId: {
              eventId: data.event.id,
              roleId: data.role.id,
            },
          },
        }),
        prisma.role.delete({
          where: {
            id: data.role.id,
          },
        }),
      ]);
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

// export const updateRole = withOrganizationAuth(
//   async (formData: FormData, organization: Organization, roleId: string) => {
//     const name = formData.get("name") as string;
//     const description = formData.get("description") as string;

//     try {
//       const role = await prisma.role.update({
//         where: {
//           id: roleId,
//         },
//         data: {
//           name,
//           description,
//         },
//       });
//       return role;
//     } catch (error: any) {
//       return {
//         error: error.message,
//       };
//     }
//   },
// );

// export const deleteRole = withOrganizationAuth(
//   async (_: FormData, organization: Organization, roleId: string) => {
//     try {
//       const role = await prisma.role.delete({
//         where: {
//           id: roleId,
//         },
//       });
//       return role;
//     } catch (error: any) {
//       return {
//         error: error.message,
//       };
//     }
//   },
// );

export async function getUsersWithRoleInOrganization(subdomain: string) {
  const users = await prisma.user.findMany({
    where: {
      userRoles: {
        some: {
          role: {
            organizationRole: {
              some: {
                organization: {
                  subdomain: subdomain,
                },
              },
            },
          },
        },
      },
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    roles: user.userRoles.map((userRole) => userRole.role),
  }));
}

export async function getUsersWithRoleInEvent(eventPath: string) {
  const users = await prisma.user.findMany({
    where: {
      userRoles: {
        some: {
          role: {
            eventRole: {
              some: {
                event: {
                  path: eventPath,
                },
              },
            },
          },
        },
      },
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    roles: user.userRoles.map((userRole) => userRole.role),
  }));
}

export async function getEventRolesAndUsers(eventId: string) {
  return await prisma.userRole.findMany({
    where: {
      role: {
        eventRole: {
          some: {
            eventId: eventId,
          },
        },
      },
    },
    include: {
      user: true,
      role: true,
    },
  });
}

export const updateEvent = withEventAuth(
  async (
    formData: FormData,
    event: Event & { organization: Organization },
    key: string,
  ) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "image" || key === "logo") {
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
          return {
            error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY token.",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { data, error } = await supabase.storage
          .from("media")
          .upload(`/public/${filename}`, file);

        console.log({ data, error });
        // const { url } = await put(filename, file, {
        //   access: "public",
        // });

        if (error || !data?.path) {
          return {
            error: "Failed to upload image.",
          };
        }
        const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${data.path}`;

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.event.update({
          where: {
            id: event.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else {
        response = await prisma.event.update({
          where: {
            id: event.id,
          },
          data: {
            [key]: value,
          },
        });
      }
      console.log(
        "Updated Organization data! Revalidating tags: ",
        `${event.organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${event.organization.customDomain}-metadata`,
      );
      await revalidateTag(
        `${event.organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${event.path}-metadata`,
      );
      event.organization.customDomain &&
        (await revalidateTag(
          `${event.organization.customDomain}/${event.path}-metadata`,
        ));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const createTicketTier = withEventAuth(
  async (
    data: z.infer<typeof CreatTicketTierFormSchema>,
    event: Event & { organization: Organization },
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    const result = CreatTicketTierFormSchema.safeParse(data);
    if (!result.success) {
      return {
        error: result.error.formErrors.fieldErrors,
      };
    }

    try {
      const ticketTier = await prisma.ticketTier.create({
        data,
      });
      return ticketTier;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export async function getEventTicketTiers(eventId: string) {
  return await prisma.ticketTier.findMany({
    where: {
      eventId: eventId,
    },
    include: {
      role: true,
    },
  });
}

export const createEventForm = withEventAuth(
  async (_: any, event: Event & { organization: Organization }) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    const response = await prisma.form.create({
      data: {
        organizationId: event.organization.id,
        eventId: event.id,
      },
      include: {
        organization: true,
        event: true,
      },
    });

    return response;
  },
);

type FormAndContext = Form & {
  organization: Organization;
  event: Event | null;
  questions: Question[];
  role: Role[];
};

// Update Form
export async function updateFormName(id: string, name: string) {
  const form = await prisma.form.update({
    where: { id },
    data: {
      name,
    },
  });
  return form;
}

// Update Form
export type UpdateFormInput = { name?: string, published?: boolean};
export async function updateForm(id: string, data: UpdateFormInput) {
  const form = await prisma.form.update({
    where: { id },
    data: data,
  });
  return form;
}

// Delete Form
export async function deleteForm(id: string) {
  const form = await prisma.form.delete({
    where: { id },
  });
  return form;
}

export type QuestionDataInputUpdate = {
  id: string;
  text?: string;
  type?: QuestionType;
  options?: Prisma.InputJsonValue;
  order?: number;
  required?: boolean;
};

export type QuestionDataInputCreate = {
  formId: string;
  text: string;
  type: QuestionType;
  options?: Prisma.InputJsonValue;
};

// Create Question
export async function createQuestion(data: QuestionDataInputCreate) {
  const count = await prisma.question.count({
    where: { formId: data.formId },
  });

  const question = await prisma.question.create({
    data: {
      ...data,
      order: count,
    },
  });
  return question;
}

// Update Question
export async function updateQuestion(
  id: string,
  data: QuestionDataInputUpdate,
) {
  const question = await prisma.question.update({
    where: { id },
    data,
  });
  return question;
}

// Delete Question
export async function deleteQuestion(id: string) {
  const question = await prisma.question.delete({
    where: { id },
  });
  return question;
}

export async function batchUpdateQuestionOrder(questions: Question[]) {
  // Prepare batch update operations
  const updateOperations = questions.map((item) =>
    prisma.question.update({
      where: { id: item.id },
      data: { order: item.order },
    }),
  );

  // Execute all updates in a transaction
  await prisma.$transaction(updateOperations);
}

export const submitFormResponse = async (
  formData: FormData,
  formId: string,
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const entries = formData.entries();

  // Parse the form data to get the answers
  const answers = Array.from(formData.entries()).map(([key, value]) => ({
    questionId: key,
    value: value.toString(),
  }));

  try {
    const formResponse = await prisma.formResponse.create({
      data: {
        userId: session.user.id,
        formId,
      },
    });
    // Start a transaction to ensure all database operations succeed or fail together
    const questions = await prisma.$transaction([
      // Create the FormResponse

      // Create the Answers
      ...answers.map((answer) =>
        prisma.answer.create({
          data: {
            ...answer,
            answersId: formResponse.id, // assuming this is the correct way to link the answer to the form response
          },
        }),
      ),
    ]);
    return { ...formResponse, questions };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getUsersOrganizations = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              organizationRole: {
                include: {
                  organization: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  // Extract organizations and roles from userRoles
  const organizationsAndRoles = user.userRoles.flatMap((userRole) =>
    userRole.role.organizationRole.map((orgRole) => ({
      organization: orgRole.organization,
      role: userRole.role,
    })),
  );

  // Remove duplicates and maintain roles
  const organizationMap: Record<
    string,
    { organization: Organization; roles: Role[] }
  > = {};
  for (const orgAndRole of organizationsAndRoles) {
    const { organization, role } = orgAndRole;
    if (organizationMap[organization.id]) {
      organizationMap[organization.id].roles.push(role);
    } else {
      organizationMap[organization.id] = { organization, roles: [role] };
    }
  }
  return organizationMap;
};

export async function getLatestEventForOrganization(organizationId: string) {
  const event = await prisma.event.findFirst({
    where: {
      organizationId: organizationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return event;
}