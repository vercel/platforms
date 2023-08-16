import { Editor, Extension, Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import va from "@vercel/analytics";
import { useCompletion } from "ai/react";
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
} from "lucide-react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import tippy from "tippy.js";

import LoadingCircle from "@/components/icons/loading-circle";
import Magic from "@/components/icons/magic";

import { handleImageUpload } from "../utils";

interface CommandItemProps {
  description: string;
  icon: ReactNode;
  title: string;
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

const Command = Extension.create({
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          props,
          range,
        }: {
          editor: Editor;
          props: any;
          range: Range;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
  name: "slash-command",
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      description: "Use AI to expand your thoughts.",
      icon: <Magic className="w-7 text-black dark:text-white" />,
      searchTerms: ["gpt"],
      title: "Continue writing",
    },
    {
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        window.open("https://github.com/vercel/platforms/issues", "_blank");
      },
      description: "Let us know how we can improve.",
      icon: <MessageSquarePlus size={18} />,
      title: "Send Feedback",
    },
    {
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run();
      },
      description: "Just start typing with plain text.",
      icon: <Text size={18} />,
      searchTerms: ["p", "paragraph"],
      title: "Text",
    },
    {
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
      description: "Track tasks with a to-do list.",
      icon: <CheckSquare size={18} />,
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      title: "To-do List",
    },
    {
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
      description: "Big section heading.",
      icon: <Heading1 size={18} />,
      searchTerms: ["title", "big", "large"],
      title: "Heading 1",
    },
    {
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
      description: "Medium section heading.",
      icon: <Heading2 size={18} />,
      searchTerms: ["subtitle", "medium"],
      title: "Heading 2",
    },
    {
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
      description: "Small section heading.",
      icon: <Heading3 size={18} />,
      searchTerms: ["subtitle", "small"],
      title: "Heading 3",
    },
    {
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
      description: "Create a simple bullet list.",
      icon: <List size={18} />,
      searchTerms: ["unordered", "point"],
      title: "Bullet List",
    },
    {
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
      description: "Create a list with numbering.",
      icon: <ListOrdered size={18} />,
      searchTerms: ["ordered"],
      title: "Numbered List",
    },
    {
      command: ({ editor, range }: CommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
      description: "Capture a quote.",
      icon: <TextQuote size={18} />,
      searchTerms: ["blockquote"],
      title: "Quote",
    },
    {
      command: ({ editor, range }: CommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
      description: "Capture a code snippet.",
      icon: <Code size={18} />,
      searchTerms: ["codeblock"],
      title: "Code",
    },
    {
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        // upload image
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (event) => {
          if (input.files?.length) {
            const file = input.files[0];
            return handleImageUpload(file, editor.view, event);
          }
        };
        input.click();
      },
      description: "Upload an image from your computer.",
      icon: <ImageIcon size={18} />,
      searchTerms: ["photo", "picture", "media"],
      title: "Image",
    },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const CommandList = ({
  command,
  editor,
  items,
  range,
}: {
  command: any;
  editor: any;
  items: CommandItemProps[];
  range: any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { complete, isLoading } = useCompletion({
    api: "/api/generate",
    id: "novel",
    onError: () => {
      toast.error("Something went wrong.");
    },
    onFinish: (_prompt, completion) => {
      // highlight the generated text
      editor.commands.setTextSelection({
        from: range.from,
        to: range.from + completion.length,
      });
    },
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        va.track("Rate Limit Reached");
        return;
      }
      editor.chain().focus().deleteRange(range).run();
    },
  });

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      va.track("Slash Command Used", {
        command: item.title,
      });
      if (item) {
        if (item.title === "Continue writing") {
          // we're using this for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
          complete(editor.getText());
          // complete(editor.storage.markdown.getMarkdown());
        } else {
          command(item);
        }
      }
    },
    [complete, command, editor, items],
  );

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all dark:border-stone-700 dark:bg-black"
      id="slash-command"
      ref={commandListContainer}
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 dark:text-white dark:hover:bg-stone-800 ${
              index === selectedIndex
                ? "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white"
                : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white dark:border-stone-700 dark:bg-black">
              {item.title === "Continue writing" && isLoading ? (
                <LoadingCircle />
              ) : (
                item.icon
              )}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-stone-500">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onStart: (props: { clientRect: DOMRect; editor: Editor }) => {
      component = new ReactRenderer(CommandList, {
        editor: props.editor,
        props,
      });

      // @ts-ignore
      popup = tippy("body", {
        appendTo: () => document.body,
        content: component.element,
        getReferenceClientRect: props.clientRect,
        interactive: true,
        placement: "bottom-start",
        showOnCreate: true,
        trigger: "manual",
      });
    },
    onUpdate: (props: { clientRect: DOMRect; editor: Editor }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
  };
};

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export default SlashCommand;
