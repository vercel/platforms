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

import { ChevronDownIcon, Command } from "lucide-react";
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

  const handleCreateNewQuestion = async () => {
    if (newQuestion.trim() !== "") {
      const data = {
        formId: form.id,
        text: newQuestion,
        type: selectedQuestionType,
      };
      const newQ = await handleCreateQuestion(data);
      setNewQuestion("");
    }
  };
  return (
    <div className="flex flex-col space-y-6">
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
        </h1>{" "}
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
                    >
                      {q.text}
                      {mapQuestionTypeToInput(q.type, () => null, q.text)}
                      <Button
                        variant={"destructive"}
                        onClick={() => handleDeleteQuestion(q.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div>
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-x-4">
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <Select
              value={selectedQuestionType}
              onValueChange={(type: QuestionType) =>
                setSelectedQuestionType(type)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
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
          </div>

          <Button onClick={handleCreateNewQuestion}>Add Question</Button>
        </div>
      </div>
    </div>
  );
}

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

const mapQuestionTypeToInput = (type: QuestionType, handleChange: (value: any) => void, value: any,) => {
  switch (type) {
    case QuestionType.SHORT_TEXT:
      return <Input type="text" onChange={handleChange} value={value} />;
    case QuestionType.LONG_TEXT:
      return <Textarea onChange={handleChange} value={value} />;
    case QuestionType.SELECT:
      return (
        <Select
              value={value}
              onValueChange={handleChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
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
      return <MultiSelect onChange={handleChange} selected={[QuestionType.MULTI_SELECT]} options={[{ label: "Multi Select", value: QuestionType.MULTI_SELECT }]} />;
    case QuestionType.BOOLEAN:
      return <Checkbox onChange={handleChange} checked={value} />;
    default:
      return null;
  }
};