import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { FC, useState } from "react";

import { cn } from "@/lib/utils";

import { NodeSelector } from "./node-selector";

export interface BubbleMenuItem {
  command: () => void;
  icon: typeof BoldIcon;
  isActive: () => boolean;
  name: string;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
      isActive: () => props.editor.isActive("bold"),
      name: "bold",
    },
    {
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
      isActive: () => props.editor.isActive("italic"),
      name: "italic",
    },
    {
      command: () => props.editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
      isActive: () => props.editor.isActive("underline"),
      name: "underline",
    },
    {
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
      isActive: () => props.editor.isActive("strike"),
      name: "strike",
    },
    {
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
      isActive: () => props.editor.isActive("code"),
      name: "code",
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      // don't show if image is selected
      if (editor.isActive("image")) {
        return false;
      }
      return editor.view.state.selection.content().size > 0;
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        setIsNodeSelectorOpen(false);
      },
    },
  };

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex rounded border border-stone-200 bg-white shadow-xl"
    >
      <NodeSelector
        editor={props.editor}
        isOpen={isNodeSelectorOpen}
        setIsOpen={() => {
          setIsNodeSelectorOpen(!isNodeSelectorOpen);
        }}
      />

      {items.map((item, index) => (
        <button
          className="p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200"
          key={index}
          onClick={item.command}
        >
          <item.icon
            className={cn("h-4 w-4", {
              "text-blue-500": item.isActive(),
            })}
          />
        </button>
      ))}
    </BubbleMenu>
  );
};
