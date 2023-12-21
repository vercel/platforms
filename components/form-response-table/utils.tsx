import {
  Answer,
  Question,
  QuestionType,
} from "@prisma/client";
import format from "date-fns/format";

export function formatCalendarDay(time: string) {
  return format(new Date(time), "MM/dd/yy");
}

export function formatAnswer(q: Question, a?: Answer) {
  if (!a) {
    return "";
  }
  switch (q.type) {
    case QuestionType.SHORT_TEXT:
    case QuestionType.LONG_TEXT:
    case QuestionType.SELECT:
    case QuestionType.DROPDOWN:
      return a.value?.toString();
    case QuestionType.BOOLEAN:
      return a.value ? "Yes" : "No";
    case QuestionType.DATE:
      return <div>{formatCalendarDay(a.value as string)}</div>;
    case QuestionType.DATE_RANGE: {
      const dateRange = a.value as unknown as { to: string; from: string };
      return (
        <div>
          {`${formatCalendarDay(dateRange.from)}
          -
          ${formatCalendarDay(dateRange.to)}`}
        </div>
      );
    }
  }
}