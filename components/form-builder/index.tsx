"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Form,
  Organization,
  Event,
  Question,
  Role,
  QuestionType,
} from "@prisma/client";
import { useState, useEffect, useTransition, useLayoutEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  updateFormName,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  QuestionDataInputCreate,
  QuestionDataInputUpdate,
  batchUpdateQuestionOrder,
  updateForm,
  UpdateFormInput,
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
  ExternalLink,
  CalendarRange,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multiselect";
import DrawerPaper from "@/components/drawer-paper";
import { Badge } from "@/components/ui/badge";
import PaperDoc from "@/components/paper-doc";
import locales from "@/locales/en-US/translations.json";
import { useDebouncedCallback } from "use-debounce";
import DrawerLink from "@/components/drawer-link";
import FormTitle from "@/components/form-title";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuestionSettingsForm } from "./question-settings-form";
import { DateRangePicker } from "./date-range-picker";
import { DatePicker } from "./date-picker";
import YesNoIcon from "./svgs/yes-no";

type FormAndContext = Form & {
  organization: Organization;
  event: Event | null;
  questions: Question[];
  role: Role[];
};
const questionTypes = Object.values(QuestionType);

export default function FormBuilder({
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
  const [isPendingSaving, setIsPendingSaving] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  let [isPendingPublishing, startTransitionPublishing] = useTransition();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedQuestionType, setSelectedQuestionType] =
    useState<QuestionType>(QuestionType.SHORT_TEXT);

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

  const handleUpdate = async (input: UpdateFormInput) => {
    if (form.name !== input.name || form.published !== input.published) {
      updateForm(form.id, input);
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
    setIsPendingSaving(true);
    const updatedQuestion = await updateQuestion(id, data);
    const updatedQuestions = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q,
    );
    setQuestions(updatedQuestions);
    setIsPendingSaving(false);
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

  const block = searchParams.get("block");

  useEffect(() => {
    if (!block && questions?.[0]) {
      router.push(`${pathname}?block=${questions?.[0].id}`);
    }
  }, [block, pathname, questions, router]);

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

  const selectedQuestion = questions.find(
    ({ id }) => id === searchParams.get("block"),
  );

  return (
    <div className="flex flex-1 flex-row text-gray-800 dark:text-gray-200">
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
              <h6 className="font-semibold text-gray-800 dark:text-gray-200">
                Content
              </h6>
              <Popover>
                <PopoverTrigger>
                  {
                    <Button size="icon" className="h-8 w-8">
                      <PlusIcon className="h-4" />
                    </Button>
                  }
                </PopoverTrigger>
                <PopoverContent sideOffset={10}>
                  <div className="space-x-3 space-y-2">
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
                  </div>
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
                            className={cn(
                              "flex h-14 w-full items-center justify-between py-4 pl-4 pr-2 text-gray-800 hover:bg-gray-250 dark:text-gray-200 dark:hover:bg-gray-750",
                              selectedQuestion && selectedQuestion.id === q.id
                                ? "bg-gray-300 dark:bg-gray-850"
                                : "",
                            )}
                            onClick={() => {
                              router.push(`${pathname}?block=${q.id}`);
                            }}
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
      <div className="relative flex w-full flex-1 flex-col space-y-6 xl:pr-60">
        <PaperDoc className="mx-auto w-full max-w-4xl">
          <div className="flex items-center justify-between">
            <FormTitle
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
            </FormTitle>
            <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
              {form.published && (
                <a
                  href={``}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-gray-400 hover:text-gray-500"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <div className="bg-brand-50 rounded-lg px-2 py-1 text-sm text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                {isPendingSaving ? "Saving..." : "Saved"}
              </div>
              <button
                onClick={() => {
                  startTransitionPublishing(async () => {
                    await handleUpdate({ published: !form.published }).then(
                      () => {
                        toast.success(
                          `Successfully ${
                            form.published ? "unpublished" : "published"
                          } your post.`,
                        );
                        // setData((prev) => ({
                        //   ...prev,
                        //   published: !prev.published,
                        // }));
                      },
                    );
                  });
                }}
                className={cn(
                  "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
                  isPendingPublishing
                    ? "bg-brand-50 cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    : "active:bg-brand-50 border border-black bg-black text-gray-100 hover:bg-gray-50 hover:text-black dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-gray-100 dark:active:bg-gray-800",
                )}
                disabled={isPendingPublishing}
              >
                {isPendingPublishing ? (
                  <LoadingDots />
                ) : (
                  <p>{form.published ? "Unpublish" : "Publish"}</p>
                )}
              </button>
            </div>
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
      <RightDrawer
        form={form}
        questions={questions}
        selectedQuestion={selectedQuestion}
        handleUpdateQuestion={handleUpdateQuestion}
      />
    </div>
  );
}

const RightDrawer = ({
  questions,
  selectedQuestion,
  form,
  handleUpdateQuestion,
}: {
  questions: Question[];
  selectedQuestion?: Question;
  form: Form;
  handleUpdateQuestion: (
    id: string,
    data: QuestionDataInputUpdate,
  ) => Promise<void>;
}) => {
  if (!selectedQuestion) {
    return null;
  }

  return (
    <DrawerPaper
      showSidebar={true}
      className="fixed bottom-0 right-0 top-0 hidden border-l pl-6 xl:flex xl:w-60"
    >
      <QuestionSettingsForm
        question={selectedQuestion}
        handleUpdateQuestion={handleUpdateQuestion}
      />
    </DrawerPaper>
  );
};

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
          setIsEditing(false);
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
          <span className="text-md text-gray-400">
            {locales.QUESTION_PLACEHODLER_TEXT}
          </span>
        )}
      </span>
      {q.required && <span>*</span>}

      {mapQuestionTypeToInput(q)}
      {q.type === QuestionType.DATE_RANGE}
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
      return <ShortTextIcon className="h-6 fill-gray-100" />;
    case QuestionType.LONG_TEXT:
      return <LongTextIcon className="h-6 fill-gray-100" />;
    case QuestionType.SELECT:
      return <ChevronDown className="h-6 w-4 " />;
    case QuestionType.MULTI_SELECT:
      return <Check className="h-6 w-4" />;
    case QuestionType.BOOLEAN:
      return <YesNoIcon className="h-6 w-4 fill-gray-100" />;
    case QuestionType.DATE:
      return <Calendar className="h-6 w-4" />;
    case QuestionType.DATE_RANGE:
      return <CalendarRange className="h-6 w-4" />;
    default:
      return null;
  }
};

const questionTypeToDisplayText = (type: QuestionType) => {
  switch (type) {
    case QuestionType.SHORT_TEXT:
      return "Short Text";
    case QuestionType.LONG_TEXT:
      return "Long Text";
    case QuestionType.SELECT:
    case QuestionType.DROPDOWN:
      return "Dropdown";
    case QuestionType.MULTI_SELECT:
      return "Multiple Choice";
    case QuestionType.BOOLEAN:
      return "Yes/No";
    case QuestionType.DATE:
      return "Date";
    case QuestionType.DATE_RANGE:
      return "Date Range";
    default:
      return type;
  }
};

const mapQuestionTypeToInput = (
  q: Question,
  handleChange: (value: any) => void,
) => {
  switch (q.type) {
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
            {q?.variants
              ? q.variants.map((variant) => {
                  console.log("variant: ", variant);
                  return (
                    <SelectItem key={variant?.name} value={variant?.value}>
                      {variant?.name}
                    </SelectItem>
                  );
                })
              : null}
          </SelectContent>
        </Select>
      );
    // case QuestionType.MULTI_SELECT:
    //   return (
    //     <MultiSelect
    //       onChange={handleChange}
    //       selected={[]}
    //       options={[
    //         { label: "Multi Select", value: QuestionType.MULTI_SELECT },
    //       ]}
    //     />
    //   );
    case QuestionType.DATE:
      return <DatePicker />;
    case QuestionType.DATE_RANGE:
      return <DateRangePicker />;
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
