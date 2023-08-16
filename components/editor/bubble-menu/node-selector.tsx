import { Editor } from "@tiptap/core";
import {
  Check,
  CheckSquare,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  TextIcon,
  TextQuote,
} from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

import { BubbleMenuItem } from ".";

interface NodeSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const NodeSelector: FC<NodeSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const items: BubbleMenuItem[] = [
    {
      command: () =>
        editor.chain().focus().toggleNode("paragraph", "paragraph").run(),
      icon: TextIcon,
      // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
      isActive: () =>
        editor.isActive("paragraph") &&
        !editor.isActive("bulletList") &&
        !editor.isActive("orderedList"),

      name: "Text",
    },
    {
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      icon: Heading1,
      isActive: () => editor.isActive("heading", { level: 1 }),
      name: "Heading 1",
    },
    {
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: Heading2,
      isActive: () => editor.isActive("heading", { level: 2 }),
      name: "Heading 2",
    },
    {
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: Heading3,
      isActive: () => editor.isActive("heading", { level: 3 }),
      name: "Heading 3",
    },
    {
      command: () => editor.chain().focus().toggleTaskList().run(),
      icon: CheckSquare,
      isActive: () => editor.isActive("taskItem"),
      name: "To-do List",
    },
    {
      command: () => editor.chain().focus().toggleBulletList().run(),
      icon: ListOrdered,
      isActive: () => editor.isActive("bulletList"),
      name: "Bullet List",
    },
    {
      command: () => editor.chain().focus().toggleOrderedList().run(),
      icon: ListOrdered,
      isActive: () => editor.isActive("orderedList"),
      name: "Numbered List",
    },
    {
      command: () =>
        editor
          .chain()
          .focus()
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
      icon: TextQuote,
      isActive: () => editor.isActive("blockquote"),
      name: "Quote",
    },
    {
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      icon: Code,
      isActive: () => editor.isActive("codeBlock"),
      name: "Code",
    },
  ];

  const activeItem = items.filter((item) => item.isActive()).pop() ?? {
    name: "Multiple",
  };

  return (
    <div className="relative h-full">
      <button
        className="flex h-full items-center gap-1 p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{activeItem?.name}</span>

        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <section className="fixed top-full z-[99999] mt-1 flex w-48 flex-col overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          {items.map((item, index) => (
            <button
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
              key={index}
              onClick={() => {
                item.command();
                setIsOpen(false);
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border border-stone-200 p-1">
                  <item.icon className="h-3 w-3" />
                </div>
                <span>{item.name}</span>
              </div>
              {activeItem.name === item.name && <Check className="h-4 w-4" />}
            </button>
          ))}
        </section>
      )}
    </div>
  );
};
