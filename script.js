const answers = [
  "Yes",
  "No",
  "Definitely",
  "Ask again later",
  "Absolutely",
  "Unlikely",
  "Maybe",
  "It is certain",
  "Very doubtful",
  "Without a doubt"
];

let lastAnswer = null;
const usage = {};
answers.forEach(a => usage[a] = 0);

const questionMemory = new Map();

function normalize(q) {
  return q.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

function areRelated(q1, q2) {
  const a = normalize(q1).split(" ");
  const b = normalize(q2).split(" ");
  const overlap = a.filter(word => b.includes(word));
  return overlap.length >= 2;
}

function getSmartAnswer(question) {
  const norm = normalize(question);

  if (questionMemory.has(norm)) {
    const previous = questionMemory.get(norm);
    previous.timesAsked++;

    let answer;

    if (previous.timesAsked >= 3 && Math.random() < 0.3) {
      do {
        answer = answers[Math.floor(Math.random() * answers.length)];
      } while (answer === previous.answer);
    } else {
      do {
        answer = answers[Math.floor(Math.random() * answers.length)];
      } while (answer === previous.answer);
    }

    previous.answer = answer;
    usage[answer]++;
    lastAnswer = answer;
    return answer;
  }

  for (const [pastQ, data] of questionMemory.entries()) {
    if (areRelated(norm, pastQ)) {
      const answer = data.answer;
      questionMemory.set(norm, { answer, timesAsked: 1 });
      usage[answer]++;
      lastAnswer = answer;
      return answer;
    }
  }

  const minUsage = Math.min(...Object.values(usage));
  const leastUsed = answers.filter(a => usage[a] === minUsage);

  let answer;
  do {
    answer = leastUsed[Math.floor(Math.random() * leastUsed.length)];
  } while (answer === lastAnswer);

  questionMemory.set(norm, { answer, timesAsked: 1 });
  usage[answer]++;
  lastAnswer = answer;

  return answer;
}

const ball = document.querySelector(".eight-ball");
const inner = document.querySelector(".inner");
const answerText = document.getElementById("answerText");
const questionInput = document.getElementById("question");
const askBtn = document.getElementById("askBtn");

askBtn.addEventListener("click", () => {
  const question = questionInput.value.trim();

  if (!question) {
    answerText.textContent = "Ask something!";
    return;
  }

  ball.classList.remove("shake", "spin-3d");
  inner.classList.remove("glow");
  answerText.classList.remove("fade-in", "thinking");

  void ball.offsetWidth;

  ball.classList.add("shake", "spin-3d");

  answerText.textContent = "Thinking...";
  answerText.classList.add("thinking");

  setTimeout(() => {
    const smartAnswer = getSmartAnswer(question);

    answerText.textContent = smartAnswer;
    answerText.classList.remove("thinking");
    answerText.classList.add("fade-in");
    inner.classList.add("glow");
  }, 1200);
});