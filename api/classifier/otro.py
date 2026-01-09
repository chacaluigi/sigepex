import os
from dotenv import load_dotenv
import sys
import codecs
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.buffer)
sys.stderr = codecs.getwriter("utf-8")(sys.stderr.buffer)
# Cargar las variables de entorno desde el archivo .env
load_dotenv()
# Acceder a la variable de entorno
full_news_path = os.getenv("REPORTS_PATH")
# Imprimir el valor
print("FULL_NEWS_PATH:", full_news_path)