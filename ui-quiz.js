const ROUND_SIZE = 10;

const questions = [
  {
    prompt: "A screen has three equally prominent buttons, but only one is the main action. What should you do first?",
    answers: [
      { label: "Give the primary action stronger visual hierarchy", correct: true },
      { label: "Make all three buttons brighter", correct: false },
      { label: "Move the buttons farther apart", correct: false },
      { label: "Add an extra confirmation step", correct: false }
    ],
    explanation: "Visual hierarchy helps people recognize the most important next step without having to compare every control."
  },
  {
    prompt: "What does an affordance help a person understand?",
    answers: [
      { label: "What they can do with an element", correct: true },
      { label: "How the product team is organized", correct: false },
      { label: "How many screens are in the product", correct: false },
      { label: "Which font was used to design the interface", correct: false }
    ],
    explanation: "An affordance communicates the possible actions an interface element supports, such as clicking, dragging, or entering text."
  },
  {
    prompt: "A complex form is overwhelming new users. Which UX principle can help?",
    answers: [
      { label: "Progressive disclosure", correct: true },
      { label: "Show every optional field up front", correct: false },
      { label: "Use smaller text for secondary fields", correct: false },
      { label: "Remove all field labels", correct: false }
    ],
    explanation: "Progressive disclosure reveals relevant choices as they become useful, keeping the first step focused."
  },
  {
    prompt: "When should you use an empty alt attribute on an image?",
    answers: [
      { label: "When the image is decorative and adds no information", correct: true },
      { label: "Whenever the image file has a long name", correct: false },
      { label: "When you want screen readers to announce the file path", correct: false },
      { label: "For every image on a page", correct: false }
    ],
    explanation: "An empty alt value (alt=\"\") lets assistive technology skip decorative images; meaningful images need a concise text alternative."
  },
  {
    prompt: "What is the best goal for a usability test?",
    answers: [
      { label: "Observe whether people can complete realistic tasks", correct: true },
      { label: "Prove that the design team is right", correct: false },
      { label: "Teach participants how to use the product", correct: false },
      { label: "Collect opinions without giving anyone a task", correct: false }
    ],
    explanation: "Realistic tasks reveal where people hesitate, misunderstand, or fail while trying to accomplish something."
  },
  {
    prompt: "For normal-sized text, what is the WCAG AA minimum contrast ratio?",
    answers: [
      { label: "4.5:1", correct: true },
      { label: "2:1", correct: false },
      { label: "3:1", correct: false },
      { label: "7:1 in every case", correct: false }
    ],
    explanation: "WCAG AA requires at least 4.5:1 for normal text. Large text has a lower 3:1 threshold."
  },
  {
    prompt: "A user makes an error in a long form. What should the interface do?",
    answers: [
      { label: "Explain the issue near the field and how to fix it", correct: true },
      { label: "Clear the whole form and start over", correct: false },
      { label: "Show a generic error only at the top of the page", correct: false },
      { label: "Silently prevent the form from submitting", correct: false }
    ],
    explanation: "Specific, nearby feedback helps people recover quickly without losing context or their other input."
  },
  {
    prompt: "A background save finishes. What is a useful response from the interface?",
    answers: [
      { label: "Confirm that the work was saved", correct: true },
      { label: "Leave the user wondering whether it worked", correct: false },
      { label: "Navigate to a different page", correct: false },
      { label: "Show an error message to get their attention", correct: false }
    ],
    explanation: "Timely status feedback reassures people that the system received and completed their action."
  },
  {
    prompt: "What is a good starting point for designing a mobile tap target?",
    answers: [
      { label: "Make it comfortably large and easy to reach", correct: true },
      { label: "Make it as small as possible to fit more actions", correct: false },
      { label: "Rely on hover to reveal its label", correct: false },
      { label: "Place several actions tightly together", correct: false }
    ],
    explanation: "Generous targets reduce missed taps, especially on the move. A 44px minimum is a useful web design baseline."
  },
  {
    prompt: "When organizing navigation, what should guide the labels and groupings?",
    answers: [
      { label: "The language and mental models of the people using it", correct: true },
      { label: "The internal reporting structure", correct: false },
      { label: "The order in which the pages were coded", correct: false },
      { label: "The number of letters in each label", correct: false }
    ],
    explanation: "Navigation is easier to scan when its structure reflects how users think about their tasks and information."
  },
  {
    prompt: "What is a design system primarily meant to improve?",
    answers: [
      { label: "Consistency and reuse across product experiences", correct: true },
      { label: "The number of colors on every screen", correct: false },
      { label: "The amount of documentation users must read", correct: false },
      { label: "The need to test product changes", correct: false }
    ],
    explanation: "A design system provides shared foundations and patterns so teams can build coherent experiences more efficiently."
  },
  {
    prompt: "A destructive action is easy to trigger by accident. What is a useful design response?",
    answers: [
      { label: "Add a clear confirmation or an undo path", correct: true },
      { label: "Make the action harder to see", correct: false },
      { label: "Use color as the only warning", correct: false },
      { label: "Place it beside the most common action", correct: false }
    ],
    explanation: "Confirmation or undo helps prevent costly mistakes while giving users a clear way to recover."
  }
];

const questionElement = document.querySelector("#quiz-question");
const optionsElement = document.querySelector("#quiz-options");
const feedbackElement = document.querySelector("#quiz-feedback");
const nextButton = document.querySelector("#quiz-next");
const countElement = document.querySelector("#quiz-count");
const progressFill = document.querySelector("#quiz-progress-fill");
const scoreElement = document.querySelector("#quiz-score");
const answeredElement = document.querySelector("#quiz-answered");
const playElement = document.querySelector("#quiz-play");
const resultsElement = document.querySelector("#quiz-results");
const resultTitleElement = document.querySelector("#quiz-result-title");
const resultCopyElement = document.querySelector("#quiz-result-copy");
const finalScoreElement = document.querySelector("#quiz-final-score");
const retryButton = document.querySelector("#quiz-retry");

if (
  !questionElement ||
  !optionsElement ||
  !feedbackElement ||
  !nextButton ||
  !countElement ||
  !progressFill ||
  !scoreElement ||
  !answeredElement ||
  !playElement ||
  !resultsElement ||
  !resultTitleElement ||
  !resultCopyElement ||
  !finalScoreElement ||
  !retryButton
) {
  throw new Error("The UX quiz could not start because one or more required elements are missing.");
}

let deck = [];
let deckPosition = 0;
let previousDeck = [];
let answered = 0;
let score = 0;
let hasAnswered = false;

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function createDeck(previous = []) {
  const nextDeck = shuffled(questions.map((_, index) => index)).slice(0, ROUND_SIZE);
  if (nextDeck.every((questionIndex) => previous.includes(questionIndex))) {
    const replacement = questions.findIndex((_, index) => !nextDeck.includes(index));
    nextDeck[Math.floor(Math.random() * nextDeck.length)] = replacement;
  }
  return shuffled(nextDeck);
}

function startRound({ moveFocus = false } = {}) {
  deck = createDeck(previousDeck);
  previousDeck = [...deck];
  deckPosition = 0;
  answered = 0;
  score = 0;
  scoreElement.textContent = "0";
  answeredElement.textContent = "0";
  playElement.hidden = false;
  resultsElement.hidden = true;
  showQuestion({ moveFocus });
}

function showQuestion({ moveFocus = false } = {}) {
  const questionIndex = deck[deckPosition];
  const question = questions[questionIndex];
  deckPosition += 1;
  hasAnswered = false;

  countElement.textContent = `Question ${deckPosition} / ${ROUND_SIZE}`;
  progressFill.style.width = `${(deckPosition / ROUND_SIZE) * 100}%`;
  questionElement.textContent = question.prompt;
  optionsElement.replaceChildren();
  feedbackElement.textContent = "";
  feedbackElement.removeAttribute("data-state");
  nextButton.hidden = true;

  shuffled(question.answers).forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = answer.label;
    button.dataset.correct = String(answer.correct);
    button.style.setProperty("--option-index", String(index));
    button.addEventListener("click", () => chooseAnswer(button, answer, question.explanation));
    optionsElement.append(button);
  });

  if (moveFocus) {
    questionElement.focus();
  }
}

function chooseAnswer(selectedButton, selectedAnswer, explanation) {
  if (hasAnswered) {
    return;
  }

  hasAnswered = true;
  answered += 1;
  const isCorrect = selectedAnswer.correct;
  if (isCorrect) {
    score += 1;
  }

  optionsElement.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
    if (button.dataset.correct === "true") {
      button.classList.add("is-correct");
    }
  });

  if (!isCorrect) {
    selectedButton.classList.add("is-incorrect");
  }

  scoreElement.textContent = String(score);
  answeredElement.textContent = String(answered);
  feedbackElement.dataset.state = isCorrect ? "correct" : "incorrect";
  feedbackElement.textContent = `${isCorrect ? "That's right." : "Not quite."} ${explanation}`;
  if (answered === ROUND_SIZE) {
    nextButton.innerHTML = 'See my results <span aria-hidden="true">→</span>';
    nextButton.dataset.results = "true";
    nextButton.hidden = false;
    return;
  }
  nextButton.innerHTML = 'Next question <span aria-hidden="true">→</span>';
  delete nextButton.dataset.results;
  nextButton.hidden = false;
}

function showResults() {
  const result = score >= 9
    ? {
        title: "You have a sharp UX eye.",
        copy: "You consistently spotted the details that make experiences clearer, more accessible, and easier to trust."
      }
    : score >= 7
      ? {
          title: "You have strong UX instincts.",
          copy: "You have a solid feel for what helps people move through a product with confidence."
        }
      : score >= 4
        ? {
            title: "You're building a thoughtful UX mindset.",
            copy: "You already notice several important patterns. Keep questioning, observing, and learning from real people."
          }
        : {
            title: "Curiosity is your best UX tool.",
            copy: "Great UX starts with asking good questions. Keep exploring how thoughtful design makes everyday tasks easier."
          };

  finalScoreElement.textContent = String(score);
  resultTitleElement.textContent = result.title;
  resultCopyElement.textContent = result.copy;
  playElement.hidden = true;
  resultsElement.hidden = false;
  resultTitleElement.focus();
}

nextButton.addEventListener("click", () => {
  if (answered === ROUND_SIZE) {
    showResults();
    return;
  }
  showQuestion({ moveFocus: true });
});
retryButton.addEventListener("click", () => startRound({ moveFocus: true }));
startRound();
