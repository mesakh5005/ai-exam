let questions = [];
let currentQuestion = 0;
let userAnswers = [];

let timeLeft = 10 * 60;
let timerInterval = null;

function startTimer() {
    clearInterval(timerInterval);

    timeLeft = 10 * 60;
    updateTimer();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Vaqt tugadi! Imtihon yakunlandi.");
            finishExam();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("timer").innerText =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

async function startExam() {
    const subject =
        document.getElementById("subject").value;

    const topic =
        document.getElementById("topic").value;

    const count =
        Number(document.getElementById("count").value);

    const status =
        document.getElementById("status");

    if (!topic.trim()) {
        status.innerText =
            "Iltimos, mavzuni kiriting.";
        return;
    }

    status.innerText =
        "Savollar tayyorlanmoqda...";

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    subject: subject,
                    topic: topic,
                    count: count
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Server xatosi: " + response.status
            );
        }

        const data = await response.json();

        questions = data.questions;

        userAnswers =
            new Array(questions.length).fill(null);

        currentQuestion = 0;

        document.getElementById("start").style.display =
            "none";

        document.getElementById("exam").style.display =
            "block";

        startTimer();
        showQuestion();

    } catch (error) {

        console.error(error);

        status.innerText =
            "Server bilan bog‘lanishda xatolik yuz berdi.";
    }
}

function showQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("progress").innerText =
        `${currentQuestion + 1} / ${questions.length}`;

    document.getElementById("question").innerText =
        q.question;

    const options =
        document.getElementById("options");

    options.innerHTML = "";

    q.options.forEach((option, index) => {

        const div =
            document.createElement("div");

        div.className = "option";

        div.innerText =
            `${String.fromCharCode(65 + index)}) ${option}`;

        div.onclick = function() {
            selectOption(index);
        };

        options.appendChild(div);
    });
}

function selectOption(index) {

    userAnswers[currentQuestion] =
        index;

    const allOptions =
        document.querySelectorAll(".option");

    allOptions.forEach((option, i) => {

        option.classList.remove("selected");

        if (i === index) {
            option.classList.add("selected");
        }
    });
}

function nextQuestion() {

    if (userAnswers[currentQuestion] === null) {

        alert(
            "Iltimos, javob variantini tanlang."
        );

        return;
    }

    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        showQuestion();

    } else {

        finishExam();
    }
}

function finishExam() {

    clearInterval(timerInterval);

    let score = 0;

    questions.forEach((q, index) => {

        if (
            userAnswers[index] ===
            q.correct
        ) {
            score++;
        }
    });

    document.getElementById("exam")
        .style.display = "none";

    document.getElementById("result")
        .style.display = "block";

    document.getElementById("score")
        .innerText =
        `${score} / ${questions.length}`;

    const percentage =
        Math.round(
            (score / questions.length) * 100
        );

    let text;

    if (percentage >= 90) {

        text = "A’lo natija!";

    } else if (percentage >= 70) {

        text = "Yaxshi natija!";

    } else if (percentage >= 60) {

        text = "Qoniqarli natija.";

    } else {

        text =
            "Mavzuni yana bir bor o‘rganish tavsiya etiladi.";
    }

    document.getElementById("resultText")
        .innerText =
        `${percentage}% — ${text}`;
}

function retryExam() {

    currentQuestion = 0;

    userAnswers =
        new Array(questions.length).fill(null);

    document.getElementById("result")
        .style.display = "none";

    document.getElementById("exam")
        .style.display = "block";

    startTimer();
    showQuestion();
}