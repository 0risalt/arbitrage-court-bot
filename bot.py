import os
import logging
import re
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
from telegram import Update, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

load_dotenv()
TOKEN = os.getenv('TELEGRAM_TOKEN')

#  логирование
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# типа работа с картотекой
class KadAPI:
    """
    Класс для работы с Картотекой арбитражных дел.
    Сейчас имитация, потом можно заменить на реальные запросы к API
    """
    
    @staticmethod
    def validate_case_number(case_number):
        """
        Проверяет формат номера дела
        Формат: А19-12345/2024 (буква, дефис, цифры, слеш, год)
        """
        # Паттерн для номера дела: буква, цифры, дефис, цифры, слеш, год
        pattern = r'^[АA]\d{2,3}-\d+/\d{4}$'
        return bool(re.match(pattern, case_number))
    
    @staticmethod
    async def get_case_info(case_number):
        """
        Получает информацию о деле.
        СЕЙЧАС: имитация данных
        ПОТОМ: реальный запрос к API Картотеки арбитражных дел
        """
        
        # Имитация задержки как при реальном запросе
        await asyncio.sleep(1)
        
        # Генерируем случайные данные для имитации
        statuses = [
            "Назначено к слушанию",
            "В процессе рассмотрения",
            "Решение вынесено",
            "Апелляция",
            "Производство приостановлено",
            "Передано в другой суд"
        ]
        
        judges = ["Иванова М.А.", "Петров С.В.", "Сидорова Е.Н.", "Козлов Д.И.", "Смирнова О.П."]
        
        # Генерируем случайную дату в пределах месяца
        next_date = datetime.now() + timedelta(days=random.randint(1, 30))
        
        # Имитация данных
        case_data = {
            "case_number": case_number,
            "status": random.choice(statuses),
            "judge": random.choice(judges),
            "plaintiff": f"ООО \"Компания-{random.randint(1, 999)}\"",
            "defendant": f"ИП {random.choice(['Иванов', 'Петров', 'Сидоров'])}",
            "next_hearing": next_date.strftime("%d.%m.%Y %H:%M"),
            "last_event": f"Поступил {random.choice(['иск', 'отзыв', 'ходатайство'])}",
            "court_acts": random.randint(0, 3)
        }
        
        return case_data
    
    @staticmethod
    async def search_by_participant(inn_or_name):
        """
        Поиск дел по участнику (ИНН или названию).
        СЕЙЧАС: имитация
        ПОТОМ: реальный поиск
        """
        await asyncio.sleep(1.5)
        
        # Имитация списка дел
        cases = []
        for i in range(random.randint(1, 4)):
            cases.append({
                "case_number": f"А19-{random.randint(1000, 9999)}/{random.randint(2023, 2025)}",
                "status": random.choice(["В работе", "Завершено"]),
                "role": random.choice(["Истец", "Ответчик", "Третье лицо"])
            })
        
        return cases


# обработчики команд

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Отправляет приветственное сообщение и главное меню"""
    
    user = update.effective_user
    welcome_text = f"""
🤖 Здравствуйте, {user.first_name}! Я чат-бот Арбитражного суда Иркутской области.

Я могу помочь вам:
• Узнать реквизиты для оплаты госпошлины
• Проверить статус судебного дела
• Получить график заседаний
• Найти контакты и режим работы

Выберите интересующий раздел в меню ниже:
    """
    
    # Создаем клавиатуру
    keyboard = [
        ["🏛 Реквизиты", "📁 Статус дела"],
        ["📅 График заседаний", "📞 Контакты"],
        ["❓ Помощь"]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    await update.message.reply_text(welcome_text, reply_markup=reply_markup)


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обрабатывает все входящие сообщения"""
    
    text = update.message.text
    user = update.effective_user
    
    logger.info(f"Пользователь {user.first_name} ({user.id}): {text}")
    
    # Проверяем, не ждем ли мы номер дела
    if context.user_data.get('awaiting_case_number'):
        await handle_case_number_input(update, context, text)
        return
    
    # Обработка кнопок меню
    if text == "🏛 Реквизиты":
        await show_requisites(update)
    elif text == "📁 Статус дела":
        await ask_case_number(update, context)
    elif text == "📅 График заседаний":
        await show_schedule(update)
    elif text == "📞 Контакты":
        await show_contacts(update)
    elif text == "❓ Помощь":
        await show_help(update)
    else:
        await update.message.reply_text(
            "Пожалуйста, выберите пункт из меню или нажмите /start"
        )


# функции для работы с делами

async def ask_case_number(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Запрашивает номер дела"""
    
    await update.message.reply_text(
        "📁 Введите номер дела в формате: **А19-12345/2024**\n\n"
        "Например: А19-4567/2023\n\n"
        "Или введите ИНН для поиска всех дел участника:",
        parse_mode='Markdown'
    )
    # Устанавливаем состояние ожидания номера дела
    context.user_data['awaiting_case_number'] = True


async def handle_case_number_input(update: Update, context: ContextTypes.DEFAULT_TYPE, text: str):
    """Обрабатывает введенный номер дела"""
    
    # Показываем, что ищем
    wait_message = await update.message.reply_text("🔍 Ищу информацию по делу...")
    
    # Проверяем, является ли ввод номером дела или ИНН
    if KadAPI.validate_case_number(text):
        # Это номер дела
        case_info = await KadAPI.get_case_info(text)
        await send_case_info(update, case_info)
    elif text.isdigit() and (len(text) == 10 or len(text) == 12):
        # Это ИНН (10 или 12 цифр)
        await search_by_inn(update, context, text)
    else:
        # Непонятный ввод
        await update.message.reply_text(
            "❌ Неправильный формат.\n\n"
            "Введите номер дела в формате А19-12345/2024\n"
            "или ИНН (10 или 12 цифр)"
        )
    
    # Удаляем сообщение "Ищу информацию..."
    await wait_message.delete()
    
    # Сбрасываем состояние ожидания
    context.user_data['awaiting_case_number'] = False


async def send_case_info(update: Update, case_info: dict):
    """Отправляет информацию о деле пользователю"""
    
    # Определяем эмодзи в зависимости от статуса
    status_emoji = "⚖️"
    if "решение" in case_info['status'].lower():
        status_emoji = "📋"
    elif "апелляция" in case_info['status'].lower():
        status_emoji = "⬆️"
    elif "приостановлено" in case_info['status'].lower():
        status_emoji = "⏸️"
    
    response = f"""
📋 **Информация по делу {case_info['case_number']}**

{status_emoji} **Статус:** {case_info['status']}
👨‍⚖️ **Судья:** {case_info['judge']}
🏢 **Истец:** {case_info['plaintiff']}
🏛 **Ответчик:** {case_info['defendant']}
📅 **Дата следующего заседания:** {case_info['next_hearing']}
📌 **Последнее событие:** {case_info['last_event']}
📑 **Судебных актов:** {case_info['court_acts']}

🔗 Подробнее: https://kad.arbitr.ru/Card/{case_info['case_number']}
    """
    
    await update.message.reply_text(response, parse_mode='Markdown')


async def search_by_inn(update: Update, context: ContextTypes.DEFAULT_TYPE, inn: str):
    """Поиск дел по ИНН"""
    
    cases = await KadAPI.search_by_participant(inn)
    
    if not cases:
        await update.message.reply_text("❌ Дел по данному ИНН не найдено")
        return
    
    response = f"🔍 **Найдено дел: {len(cases)}**\n\n"
    
    for i, case in enumerate(cases, 1):
        response += f"{i}. Дело {case['case_number']}\n"
        response += f"   Статус: {case['status']}\n"
        response += f"   Роль: {case['role']}\n\n"
    
    await update.message.reply_text(response, parse_mode='Markdown')


# справочные ф-и

async def show_requisites(update: Update):
    """Показывает реквизиты для оплаты"""
    
    text = """
🏛 *Реквизиты для уплаты государственной пошлины*

*Получатель:* УФК по Иркутской области (Арбитражный суд Иркутской области)
*ИНН:* 380000000000
*КПП:* 380001001
*БИК:* 012520123
*Счет:* 03100643000000013400
*КБК:* 18210801000011000110

📍 *Адрес суда:* г. Иркутск, ул. Седова, 76
🌐 *Сайт:* https://irkutsk.arbitr.ru
📞 *Справочная:* 8 (3952) 20-10-00

*Для получения актуальной информации посетите официальный сайт суда*
    """
    
    await update.message.reply_text(text, parse_mode='Markdown')


async def show_schedule(update: Update):
    """Показывает график работы"""
    
    text = """
📅 График работы суда

Понедельник-Четверг: 9:00 - 18:00
Пятница: 9:00 - 16:45
Обед: 13:00 - 13:45
Выходные: суббота, воскресенье

Прием документов:
• Пн-Чт: 9:00 - 17:00
• Пт: 9:00 - 15:45

🗂 Архив: прием по предварительной записи
    """
    
    await update.message.reply_text(text)


async def show_contacts(update: Update):
    """Показывает контактную информацию"""
    
    text = """
📞 Контакты Арбитражного суда Иркутской области

Адрес: г. Иркутск, ул. Седова, 76

Телефоны:
• Приемная председателя: 8 (3952) 20-10-01
• Канцелярия: 8 (3952) 20-10-02
• Справочная: 8 (3952) 20-10-00

Email: info@irkutsk.arbitr.ru

Официальный сайт: https://irkutsk.arbitr.ru

Картотека арбитражных дел: https://kad.arbitr.ru
    """
    
    await update.message.reply_text(text)


async def show_help(update: Update):
    """Показывает справку"""
    
    text = """
❓ *Помощь по использованию бота*

Я могу помочь вам с:
• *Реквизиты* - информация для оплаты госпошлины
• *Статус дела* - проверка статуса судебного дела
• *График заседаний* - время работы и приема
• *Контакты* - телефоны и адрес суда

Для проверки статуса дела:
1. Нажмите "📁 Статус дела"
2. Введите номер дела в формате А19-12345/2024
3. Получите информацию

Если ваш вопрос не входит в этот список, обратитесь:
📞 По телефону: 8 (3952) 20-10-00
📧 По email: info@irkutsk.arbitr.ru
🌐 На сайте: https://irkutsk.arbitr.ru
    """
    
    await update.message.reply_text(text, parse_mode='Markdown')


# запуск бота

def main():
    """Запускает бота"""
    
    # Создаем приложение
    app = Application.builder().token(TOKEN).build()
    
    # Добавляем обработчики
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Запускаем бота
    print("🤖 Бот Арбитражного суда Иркутской области запущен...")
    print("📝 Для остановки нажмите Ctrl+C")
    app.run_polling()

if __name__ == '__main__':
    # Импортируем asyncio здесь, чтобы избежать циклического импорта
    import asyncio
    main()