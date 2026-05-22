# dump_db.py
# Extract all tables + latest 10 rows from Neon PostgreSQL
# Save everything into db_dump.json

import os
import json
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Load .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in .env")

# Connect to Neon DB
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor(cursor_factory=RealDictCursor)

dump_data = {}

try:
    print("Connected to Neon DB")

    # Get all public tables
    cursor.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    """)

    tables = [row["table_name"] for row in cursor.fetchall()]

    print(f"Found tables: {tables}")

    for table in tables:
        try:
            print(f"\nFetching table: {table}")

            # Check if created_at exists
            cursor.execute(f"""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = %s
                AND column_name = 'created_at';
            """, (table,))

            has_created_at = cursor.fetchone() is not None

            # Query latest 10 rows
            if has_created_at:
                query = f'''
                    SELECT *
                    FROM "{table}"
                    ORDER BY created_at DESC
                    LIMIT 10;
                '''
            else:
                query = f'''
                    SELECT *
                    FROM "{table}"
                    LIMIT 10;
                '''

            cursor.execute(query)

            rows = cursor.fetchall()

            # Convert rows to normal dict
            dump_data[table] = [dict(row) for row in rows]

            print(f"Saved {len(rows)} rows from {table}")

        except Exception as table_error:
            print(f"Error in table {table}: {table_error}")

            dump_data[table] = {
                "error": str(table_error)
            }

    # Save JSON dump
    with open("db_dump.json", "w", encoding="utf-8") as f:
        json.dump(dump_data, f, indent=2, default=str)

    print("\nDatabase dump saved to db_dump.json")

except Exception as e:
    print("Database error:", e)

finally:
    cursor.close()
    conn.close()
    print("Connection closed")