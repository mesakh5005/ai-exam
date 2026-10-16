from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AI Exam API",
    description="AI asosidagi imtihon platformasi",
    version="1.0.0"
)

# Frontend bilan bog'lanish
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    subject: str
    topic: str
    count: int = 5


# Hozircha test uchun namunaviy savollar
QUESTIONS = [
    {
        "id": 1,
        "question": "Kuchli parolning asosiy xususiyati nima?",
        "options": [
            "123456",
            "Faqat ism va familiyadan foydalanish",
            "Uzun, murakkab va noyob parol",
            "Tug'ilgan sanadan foydalanish"
        ],
        "correct": 2,
        "explanation": "Kuchli parol uzun, murakkab va boshqa xizmatlarda takrorlanmaydigan bo'lishi kerak."
    },
    {
        "id": 2,
        "question": "Phishing nima?",
        "options": [
            "Kompyuterni tozalash usuli",
            "Soxta xabar yoki sayt orqali ma'lumotlarni qo'lga kiritish usuli",
            "Antivirus dasturi",
            "Internet tezligini oshirish texnologiyasi"
        ],
        "correct": 1,
        "explanation": "Phishing foydalanuvchini aldab, parol yoki boshqa maxfiy ma'lumotlarni olishga qaratilgan hujumdir."
    },
    {
        "id": 3,
        "question": "Ikki faktorli autentifikatsiya (2FA) nima uchun ishlatiladi?",
        "options": [
            "Internetni tezlashtirish uchun",
            "Qo'shimcha xavfsizlik qatlamini yaratish uchun",
            "Fayllarni siqish uchun",
            "Kompyuterni tezlashtirish uchun"
        ],
        "correct": 1,
        "explanation": "2FA paroldan tashqari qo'shimcha tasdiqlash usulini talab qiladi."
    },
    {
        "id": 4,
        "question": "Antivirus dasturining asosiy vazifasi nima?",
        "options": [
            "Virus va zararli dasturlarni aniqlash va ulardan himoyalash",
            "Monitor yorqinligini oshirish",
            "Internet tezligini oshirish",
            "Parol yaratish"
        ],
        "correct": 0,
        "explanation": "Antivirus zararli dasturlarni aniqlash, bloklash yoki o'chirishga yordam beradi."
    },
    {
        "id": 5,
        "question": "HTTPS protokolining asosiy afzalligi nima?",
        "options": [
            "Saytni avtomatik tarjima qiladi",
            "Internetni bepul qiladi",
            "Ma'lumot almashinuvini shifrlashni ta'minlaydi",
            "Kompyuter xotirasini oshiradi"
        ],
        "correct": 2,
        "explanation": "HTTPS TLS orqali brauzer va server o'rtasidagi aloqani himoyalaydi."
    }
]


@app.get("/")
def home():
    return {
        "message": "AI Exam API ishlayapti!",
        "version": "1.0.0"
    }


@app.post("/generate")
def generate_questions(request: QuestionRequest):

    count = max(1, min(request.count, len(QUESTIONS)))

    selected_questions = QUESTIONS[:count]

    return {
        "subject": request.subject,
        "topic": request.topic,
        "count": len(selected_questions),
        "questions": selected_questions
    }