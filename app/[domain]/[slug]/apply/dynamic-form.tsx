"use client"
import { Form, Question } from '@prisma/client';
import React from 'react';
import { submitFormResponse } from '@/lib/actions';

function DynamicForm({ form }: { form: (Form & { questions: Question[] }) }) {
  return (
    <form action={async (formData) => submitFormResponse(formData, form.id).then((response) => {
      console.log('response: ', response);
    })}>
      {form.questions.map((question, index) => {
        switch (question.type) {
          case 'SHORT_TEXT':
          case 'LONG_TEXT':
            return (
              <div key={question.id}>
                <label>{question.text}</label>
                <input name={question.id} type="text" required={question.required} />
              </div>
            );
          case 'SELECT':
            return (
              <div key={question.id}>
                <label>{question.text}</label>
                <select required={question.required}>
                  {question?.options?.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            );
          case 'MULTI_SELECT':
            return (
              <div key={question.id}>
                <label>{question.text}</label>
                {question?.options?.map((option, i) => (
                  <div key={i}>
                    <input  type="checkbox" id={`option${i}`} name={option} value={option} />
                    <label htmlFor={`option${i}`}>{option}</label>
                  </div>
                ))}
              </div>
            );
          case 'BOOLEAN':
            return (
              <div key={question.id}>
                <label>{question.text}</label>
                <input  name={question.id} type="checkbox" required={question.required} />
              </div>
            );
          default:
            return null;
        }
      })}
      <button type="submit">Submit</button>
    </form>
  );
}

export default DynamicForm;