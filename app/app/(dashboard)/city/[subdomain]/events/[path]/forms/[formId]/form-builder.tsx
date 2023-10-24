"use client";
import { useRouter } from "next/navigation";

import {
  Form,
  Organization,
  Event,
  Question,
  Role,
  QuestionType,
} from "@prisma/client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  updateFormName,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  QuestionDataInputCreate,
  QuestionDataInputUpdate,
  batchUpdateQuestionOrder,
} from "@/lib/actions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ShortTextIcon from "./svgs/short-text";
import LongTextIcon from "./svgs/long-text";

import {
  ChevronDownIcon,
  Command,
  PlusIcon,
  MoreVertical,
  Check,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multiselect";
import DrawerPaper from "@/components/drawer-paper";
import { Badge } from "@/components/ui/badge";
import PaperDoc from "@/components/paper-doc";
import locales from "@/locales/en-US/translations.json";
import { useDebouncedCallback } from "use-debounce";
import DrawerLink from "@/components/drawer-link";

type FormAndContext = Form & {
  organization: Organization;
  event: Event | null;
  questions: Question[];
  role: Role[];
};
const questionTypes = Object.values(QuestionType);

export default function EventFormsPage({
  session,
  form,
}: {
  session: {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
    };
  };
  form: FormAndContext;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<QuestionType>(QuestionType.SHORT_TEXT);

  const router = useRouter();

  useEffect(() => {
    setFormName(form.name);
    setQuestions(form.questions.sort((q1, q2) => q1.order - q2.order));
  }, [form.name, form.questions]);

  const handleUpdateName = async (name: string) => {
    if (form.name !== formName) {
      setFormName(name);
      updateFormName(form.id, name);
    }
  };

  const handleCreateQuestion = async (data: QuestionDataInputCreate) => {
    const newQuestion = await createQuestion(data);
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = async (
    id: string,
    data: QuestionDataInputUpdate,
  ) => {
    const updatedQuestion = await updateQuestion(id, data);
    const updatedQuestions = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q,
    );
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = async (id: string) => {
    await deleteQuestion(id);
    const updatedQuestions = questions.filter((q) => q.id !== id);
    const updatedItems = updatedQuestions.map((item, index) => {
      return { ...item, order: index };
    });

    // Update the state
    setQuestions(updatedItems);
    // Prepare batch update operations
    await batchUpdateQuestionOrder(updatedItems);
  };

  const handleOnDragEnd = async (result: any) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // Update the order of each question
    const updatedItems = items.map((item, index) => {
      return { ...item, order: index };
    });

    // Update the state
    setQuestions(updatedItems);

    // Prepare batch update operations
    await batchUpdateQuestionOrder(updatedItems);
  };

  const handleCreateNewQuestion = async (type: QuestionType) => {
    // if (newQuestion.trim() !== "") {
    const data = {
      formId: form.id,
      text: newQuestion,
      type: type,
    };
    handleCreateQuestion(data);
    setNewQuestion("");
    // }
  };

  const handleUpdateQuestionText = (newQ: Question, text: string) => {
    const nextQuestions = questions.map((q) =>
      q.id === newQ.id ? { ...q, text } : q,
    );
    setQuestions(nextQuestions);
    handleUpdateQuestionThrottled(newQ.id, { id: newQ.id, text: text });
  };

  const handleUpdateQuestionThrottled = useDebouncedCallback(
    (id, data) => {
      return updateQuestion(id, data);
    },
    600,
    { trailing: true },
  );

  return (
    <>
      <div className="absolute bottom-0 left-0 top-0">
        <DrawerPaper showSidebar={false} className="px-0">
          <div className="flex flex-col">
            <DrawerLink
              name={"Back to Forms"}
              href={`/city/${form.organization.subdomain}/events/${form.event?.path}/forms`}
              icon={<ArrowLeft width={18} />}
              isActive={false}
            />
            <div className="flex items-center justify-between py-4 pl-4 pr-3">
              <h6 className="font-semibold">Content</h6>
              <Popover>
                <PopoverTrigger>
                  {
                    <Button size="icon" className="h-8 w-8">
                      <PlusIcon className="h-4" />
                    </Button>
                  }
                </PopoverTrigger>
                <PopoverContent sideOffset={10}>
                  {questionTypes.map((type) => {
                    return (
                      <Button
                        key={type}
                        value={type}
                        onClick={() => handleCreateNewQuestion(type)}
                      >
                        {questionTypeToDisplayText(type)}
                      </Button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {questions.map((q, index) => (
                      <Draggable key={q.id} draggableId={q.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex h-14 w-full items-center justify-between py-4 pl-4 pr-2 hover:bg-brand-gray400/50"
                          >
                            <QuestionBadge q={q} />
                            <p className="ml-3 flex flex-1 text-xs">{q.text}</p>
                            {/* {mapQuestionTypeToInput(q.type, () => null, q.text)} */}
                            <Popover>
                              <PopoverTrigger>
                                <MoreVertical size={16} />
                              </PopoverTrigger>
                              <PopoverContent>
                                <Button
                                  variant={"destructive"}
                                  size={"sm"}
                                  onClick={() => handleDeleteQuestion(q.id)}
                                >
                                  Delete
                                </Button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </DrawerPaper>
      </div>
      <div className="flex flex-col space-y-6">
        <PaperDoc className="">
          <div className="flex items-center justify-between">
            <h1
              className="p-1 font-serif text-3xl dark:text-white"
              onMouseEnter={() => setIsEditing(true)}
              onMouseLeave={() => {
                setIsEditing(false);
                handleUpdateName(formName);
              }}
            >
              {isEditing ? (
                <Input
                  className="p-2 font-serif text-3xl dark:text-white"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  onKeyDownCapture={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateName(formName);
                      setIsEditing(false);
                    }
                  }}
                />
              ) : (
                formName
              )}
            </h1>
          </div>

          <div>
            {questions.map((q, index) => (
              <EditableQuestion
                key={q.id}
                q={q}
                handleUpdateQuestion={handleUpdateQuestion}
                handleUpdateQuestionText={handleUpdateQuestionText}
              />
            ))}
          </div>
        </PaperDoc>
      </div>
    </>
  );
}

type EditableQuestionProps = {
  q: Question;
  handleUpdateQuestion: (id: string, data: any) => void;
  handleUpdateQuestionText: (q: Question, text: string) => void;
};

const EditableQuestion = ({
  q,
  handleUpdateQuestion,
  handleUpdateQuestionText,
}: EditableQuestionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  // const [questionText, setQuestionText] = useState(q.text);

  // const handleUpdateQuestionText = (text: string) => {
  //   if (q.text !== text) {
  //     handleUpdateQuestion(q.id, { text: text });
  //   }
  // };

  return (
    <div className="my-8">
      <span
        onMouseEnter={() => setIsEditing(true)}
        onMouseLeave={() => {
          console.log("");
          setIsEditing(false);
          // handleUpdateQuestionText(questionText);
        }}
      >
        {isEditing ? (
          <Input
            className="text-md m-0 h-auto border-0 p-0 focus:border-b"
            placeholder={locales.QUESTION_PLACEHODLER_TEXT}
            value={q.text}
            onChange={(e) => handleUpdateQuestionText(q, e.target.value)}
            onBlur={() => {
              setIsEditing(false);

              // handleUpdateQuestionText(questionText);
            }}
          />
        ) : q.text.length > 0 ? (
          q.text
        ) : (
          <span className="text-md text-brand-gray400">
            {locales.QUESTION_PLACEHODLER_TEXT}
          </span>
        )}
      </span>

      {mapQuestionTypeToInput(q.type, () => null)}
    </div>
  );
};

const QuestionBadge = ({ q }: { q: Question }) => {
  return (
    <Badge className="h-6 gap-x-3 px-1.5">
      {questionTypeToBadgeIcon(q.type)}
      <span className="ml-1">{q.order + 1}</span>
    </Badge>
  );
};

const questionTypeToBadgeIcon = (type: QuestionType) => {
  switch (type) {
    case QuestionType.SHORT_TEXT:
      return <ShortTextIcon className="h-6 fill-white" />;
    case QuestionType.LONG_TEXT:
      return <LongTextIcon className="h-6 fill-white" />;
    case QuestionType.SELECT:
      return <ChevronDown className="h-6 w-4" />;
    case QuestionType.MULTI_SELECT:
      return <Check className="h-6 w-4" />;
    case QuestionType.BOOLEAN:
      return "Yes/No";
    default:
      return <ShortTextIcon className="h-6 fill-white" />;
  }
};

const questionTypeToDisplayText = (type: QuestionType) => {
  switch (type) {
    case QuestionType.SHORT_TEXT:
      return "Short Text";
    case QuestionType.LONG_TEXT:
      return "Long Text";
    case QuestionType.SELECT:
      return "Dropdown";
    case QuestionType.MULTI_SELECT:
      return "Multiple Choice";
    case QuestionType.BOOLEAN:
      return "Yes/No";
    default:
      return type;
  }
};

const mapQuestionTypeToInput = (
  type: QuestionType,
  handleChange: (value: any) => void,
) => {
  switch (type) {
    case QuestionType.SHORT_TEXT:
      return <Input type="text" />;
    case QuestionType.LONG_TEXT:
      return <Textarea />;
    case QuestionType.SELECT:
      return (
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {questionTypes.map((type) => {
              return (
                <SelectItem key={type} value={type}>
                  {questionTypeToDisplayText(type)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
    case QuestionType.MULTI_SELECT:
      return (
        <MultiSelect
          onChange={handleChange}
          selected={[]}
          options={[
            { label: "Multi Select", value: QuestionType.MULTI_SELECT },
          ]}
        />
      );
    case QuestionType.BOOLEAN:
      return <Checkbox />;
    default:
      return null;
  }
};

// const MobileControls = () => {
//   return (
//     <div>
//     <div className="flex flex-col gap-y-4">
//       <div className="flex gap-x-4">
//         <Input
//           value={newQuestion}
//           onChange={(e) => setNewQuestion(e.target.value)}
//         />
//         <Select
//           value={selectedQuestionType}
//           onValueChange={(type: QuestionType) =>
//             setSelectedQuestionType(type)
//           }
//         >
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Type" />
//           </SelectTrigger>
//           <SelectContent>
//             {questionTypes.map((type) => {
//               return (
//                 <SelectItem key={type} value={type}>
//                   {questionTypeToDisplayText(type)}
//                 </SelectItem>
//               );
//             })}
//           </SelectContent>
//         </Select>
//       </div>

//       <Button onClick={handleCreateNewQuestion}>{<PlusIcon />}</Button>
//     </div>
//   </div>
//   )
// }
