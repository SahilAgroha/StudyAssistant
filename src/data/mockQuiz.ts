import type { QuizQuestion } from "../types/quiz";

export const mockQuizQuestions: QuizQuestion[] = [
  {
    question: "What is inheritance in Java?",
    options: [
      "Acquiring properties and behavior from another class",
      "Creating multiple objects from one class",
      "Converting Java code into machine code",
      "Handling runtime exceptions",
    ],
    correctAnswer: 0,
    explanation:
      "Inheritance allows a class to acquire properties and methods from another class using the extends keyword.",
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
    explanation:
      "The extends keyword is used when one class inherits from another class.",
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
    explanation:
      "Polymorphism allows the same interface or parent type to represent different underlying implementations.",
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
    explanation:
      "Method overriding occurs when a subclass provides its own implementation of a method defined in its parent class.",
  },
  {
    question:
      "Which keyword refers to the immediate parent class?",
    options: [
      "this",
      "parent",
      "super",
      "base",
    ],
    correctAnswer: 2,
    explanation:
      "The super keyword is used to refer to the immediate parent class and access its members.",
  },
];