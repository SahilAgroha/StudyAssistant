import type { QuizQuestion } from "../types/quiz";

const mockQuestions: QuizQuestion[] = [
  {
    question: "What is inheritance in Java?",
    options: [
      "Acquiring properties and behavior from another class",
      "Creating multiple objects from one class",
      "Converting Java code into machine code",
      "Handling runtime exceptions",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which keyword is used to inherit a class in Java?",
    options: [
      "implements",
      "extends",
      "inherits",
      "super",
    ],
    correctAnswer: 1,
  },
  {
    question: "What does polymorphism allow?",
    options: [
      "One interface to have multiple implementations",
      "A class to have only one object",
      "A method to never be overridden",
      "A program to run without compilation",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Which concept allows a child class to provide its own implementation of a parent method?",
    options: [
      "Method overloading",
      "Method overriding",
      "Encapsulation",
      "Abstraction",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which keyword refers to the immediate parent class?",
    options: [
      "this",
      "parent",
      "super",
      "base",
    ],
    correctAnswer: 2,
  },
];

export const generateQuiz = async (
  topic: string
): Promise<QuizQuestion[]> => {
  // Simulate an API request
  await new Promise((resolve) => {
    setTimeout(resolve, 1200);
  });

  if (!topic.trim()) {
    throw new Error("Please enter a study topic.");
  }

  return mockQuestions;
};