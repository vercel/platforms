const DEFAULT_EDITOR_CONTENT = {
  content: [
    {
      attrs: { level: 2 },
      content: [{ text: "Introducing Novel", type: "text" }],
      type: "heading",
    },
    {
      content: [
        {
          text: "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletion. Built with ",
          type: "text",
        },
        {
          marks: [
            {
              attrs: {
                class:
                  "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                href: "https://tiptap.dev/",
                target: "_blank",
              },
              type: "link",
            },
          ],
          text: "Tiptap",
          type: "text",
        },
        { text: " and ", type: "text" },
        {
          marks: [
            {
              attrs: {
                class:
                  "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                href: "https://sdk.vercel.ai/docs",
                target: "_blank",
              },
              type: "link",
            },
          ],
          text: "Vercel AI SDK",
          type: "text",
        },
        { text: ".", type: "text" },
      ],
      type: "paragraph",
    },
    {
      attrs: { level: 3 },
      content: [{ text: "Features", type: "text" }],
      type: "heading",
    },
    {
      attrs: { start: 1, tight: true },
      content: [
        {
          content: [
            {
              content: [{ text: "Slash menu & bubble menu", type: "text" }],
              type: "paragraph",
            },
          ],
          type: "listItem",
        },
        {
          content: [
            {
              content: [
                { text: "AI autocomplete (type ", type: "text" },
                { marks: [{ type: "code" }], text: "++", type: "text" },
                {
                  text: " to activate, or select from slash menu)",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "listItem",
        },
        {
          content: [
            {
              content: [
                {
                  text: "Image uploads (drag & drop / copy & paste, or select from slash menu)",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "listItem",
        },
      ],
      type: "orderedList",
    },
    {
      attrs: {
        alt: "banner.png",
        src: "https://public.blob.vercel-storage.com/pJrjXbdONOnAeZAZ/banner-2wQk82qTwyVgvlhTW21GIkWgqPGD2C.png",
        title: "banner.png",
      },
      type: "image",
    },
    { type: "horizontalRule" },
    {
      attrs: { level: 3 },
      content: [{ text: "Learn more", type: "text" }],
      type: "heading",
    },
    {
      content: [
        {
          attrs: { checked: false },
          content: [
            {
              content: [
                { text: "Check out the ", type: "text" },
                {
                  marks: [
                    {
                      attrs: {
                        class:
                          "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                        href: "https://twitter.com/steventey/status/1669762868416512000",
                        target: "_blank",
                      },
                      type: "link",
                    },
                  ],
                  text: "launch video",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "taskItem",
        },
        {
          attrs: { checked: false },
          content: [
            {
              content: [
                { text: "Star us on ", type: "text" },
                {
                  marks: [
                    {
                      attrs: {
                        class:
                          "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                        href: "https://github.com/steven-tey/novel",
                        target: "_blank",
                      },
                      type: "link",
                    },
                  ],
                  text: "GitHub",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "taskItem",
        },
        {
          attrs: { checked: false },
          content: [
            {
              content: [
                {
                  marks: [
                    {
                      attrs: {
                        class:
                          "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
                        href: "https://vercel.com/templates/next.js/novel",
                        target: "_blank",
                      },
                      type: "link",
                    },
                  ],
                  text: "Deploy your own",
                  type: "text",
                },
                { text: " to Vercel", type: "text" },
              ],
              type: "paragraph",
            },
          ],
          type: "taskItem",
        },
      ],
      type: "taskList",
    },
  ],
  type: "doc",
};

export default DEFAULT_EDITOR_CONTENT;
