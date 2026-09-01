import type { Quiz } from "../types/study";

export const mockQuiz: Quiz = {
  id: "quiz-java-basics",
  title: "Java Inheritance & Polymorphism",
  questions: [
    {
      id: "q1",
      question: "What is inheritance in Java?",
      options: [
        "Acquiring properties and behavior from another class",
        "Creating multiple objects from one class",
        "Converting Java code into machine code",
        "Handling runtime exceptions",
      ],
      correctAnswer: "Acquiring properties and behavior from another class",
      explanation:
        "Inheritance allows a class to acquire properties and methods from another class using the extends keyword.",
    },
    {
      id: "q2",
      question: "Which keyword is used to inherit a class in Java?",
      options: ["implements", "extends", "inherits", "super"],
      correctAnswer: "extends",
      explanation:
        "The extends keyword is used when one class inherits from another class.",
    },
    {
      id: "q3",
      question: "What does polymorphism allow?",
      options: [
        "One interface to have multiple implementations",
        "A class to have only one object",
        "A method to never be overridden",
        "A program to run without compilation",
      ],
      correctAnswer: "One interface to have multiple implementations",
      explanation:
        "Polymorphism allows the same interface or parent type to represent different underlying implementations.",
    },
    {
      id: "q4",
      question: "Which concept allows a child class to provide its own implementation of a parent method?",
      options: [
        "Method overloading",
        "Method overriding",
        "Encapsulation",
        "Abstraction",
      ],
      correctAnswer: "Method overriding",
      explanation:
        "Method overriding occurs when a subclass provides its own implementation of a method defined in its parent class.",
    },
    {
      id: "q5",
      question: "Which keyword refers to the immediate parent class?",
      options: ["this", "parent", "super", "base"],
      correctAnswer: "super",
      explanation:
        "The super keyword is used to refer to the immediate parent class and access its members.",
    },
  ],
};