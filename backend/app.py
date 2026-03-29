from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import re
from database import get_case_by_number, get_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ ===
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Создаём таблицу, если её нет
    cur.execute("""
        CREATE TABLE IF NOT EXISTS court_cases (
            id SERIAL PRIMARY KEY,
            case_number VARCHAR(20) UNIQUE NOT NULL,
            status VARCHAR(50) NOT NULL,
            status_code VARCHAR(20) NOT NULL,
            judge VARCHAR(100) NOT NULL,
            plaintiff VARCHAR(200) NOT NULL,
            defendant VARCHAR(200) NOT NULL,
            next_hearing DATE,
            last_event TEXT,
            court_acts INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Проверяем, есть ли данные
    cur.execute("SELECT COUNT(*) FROM court_cases")
    count = cur.fetchone()[0]
    
    if count == 0:
        # Добавляем тестовые данные
        cur.execute("""
            INSERT INTO court_cases (case_number, status, status_code, judge, plaintiff, defendant, next_hearing, last_event, court_acts) VALUES
            ('A19-12345/2024', 'Назначено к слушанию', 'hearing', 'Иванова М.А.', 'ООО "Сибирские ресурсы"', 'ИП Петров А.В.', '2024-04-15', 'Поступил отзыв на иск', 2),
            ('A19-67890/2023', 'Решение вынесено', 'decided', 'Петров С.В.', 'Администрация г. Иркутска', 'ООО "СтройИнвест"', NULL, 'Решение вступило в силу', 5),
            ('A19-11111/2024', 'В процессе рассмотрения', 'pending', 'Сидорова Е.Н.', 'ИП Иванов А.А.', 'ООО "Торговый дом"', '2024-04-22', 'Назначено заседание', 1)
        """)
        conn.commit()
        print("✅ Таблица создана и заполнена тестовыми данными")
    
    cur.close()
    conn.close()

# Запускаем инициализацию при старте
init_db()
# === КОНЕЦ ИНИЦИАЛИЗАЦИИ ===

def validate_case_number(case_number: str) -> bool:
    pattern = r'^[АA]\d{2,3}-\d+/\d{4}$'
    return bool(re.match(pattern, case_number))

@app.get("/")
def root():
    return {"message": "API работает"}

@app.get("/api/case/{case_number:path}")
def get_case(case_number: str):
    print(f"Запрос: {case_number}")
    if not validate_case_number(case_number):
        raise HTTPException(400, "Неверный формат")
    case = get_case_by_number(case_number)
    if not case:
        raise HTTPException(404, "Дело не найдено")
    return {
        "number": case['case_number'],
        "status": case['status'],
        "statusCode": case['status_code'],
        "judge": case['judge'],
        "plaintiff": case['plaintiff'],
        "defendant": case['defendant'],
        "nextHearing": case['next_hearing'].strftime('%d.%m.%Y') if case['next_hearing'] else None,
        "lastEvent": case['last_event'],
        "courtActs": case['court_acts']
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)