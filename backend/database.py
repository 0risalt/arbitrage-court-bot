import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        cursor_factory=RealDictCursor,
        client_encoding='UTF8'
    )

def get_case_by_number(case_number):
    conn = get_db_connection()
    cur = conn.cursor()
    search_number = case_number.replace('А', 'A')
    cur.execute(
        "SELECT * FROM court_cases WHERE REPLACE(case_number, 'А', 'A') = %s",
        (search_number,)
    )
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result