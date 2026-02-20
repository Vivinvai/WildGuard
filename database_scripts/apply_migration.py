"""Apply SQL migration to PostgreSQL database"""
import psycopg2

# Connect to database (using correct password and database name from .env)
conn = psycopg2.connect('postgresql://postgres:pokemon1234@localhost:5432/Wild_Guard_DB')
cursor = conn.cursor()

# Read and execute SQL migration
with open('migrations/add_indian_wildlife_complete.sql', 'r') as f:
    sql = f.read()
    cursor.execute(sql)
    conn.commit()

print('✅ Migration applied successfully')

# Verify data
cursor.execute('SELECT species_name, conservation_status, population FROM supported_animals LIMIT 5')
print('\n📊 Sample Data:')
for row in cursor.fetchall():
    print(f'  {row[0]} - {row[1]} - {row[2]}')

conn.close()
