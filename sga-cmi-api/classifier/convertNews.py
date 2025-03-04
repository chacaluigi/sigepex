import os
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv
import re
import sys
import codecs

sys.stdout = codecs.getwriter("utf-8")(sys.stdout.buffer)
sys.stderr = codecs.getwriter("utf-8")(sys.stderr.buffer)

# Cargar variables de entorno
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("Error: La clave API no se encontró en el archivo .env")

genai.configure(api_key=api_key)

# Modelo Gemini 2.0 Flash-Lite Preview 02-05
model = genai.GenerativeModel("gemini-2.0-flash-lite-preview-02-05")

# Cargar datos de leaked_news.json

# Acceder a la variable de entorno
leaked_news_path = os.getenv("LEAKED_NEWS_PATH")
if not leaked_news_path:
    raise ValueError("Error: La ruta de FULL_NEWS_PATH no se encontró en el archivo .env")

with open(leaked_news_path, "r", encoding="utf-8") as f:
    leaked_news = json.load(f)

def transform_news_to_report(news_item, retries=3):
    """Transforma una noticia en un reporte de seguridad con ayuda de Gemini, con reintentos en caso de fallo."""
    prompt = f"""
    Convierte la siguiente noticia en un reporte de seguridad con los siguientes campos:
    - tema: Resumen del contenido de la noticia en una oración.
    - categoria: Mantener la misma categoría.
    - factor: Determinar si es Político, Militar, Económico o Psicosocial (puede ser más de uno).
    - lugar: Extraer el lugar mencionado.
    - departamento: Determinar el departamento si es posible.
    - pais: Identificar el país.
    - fuentes: Extraer fuentes mencionadas o usar el autor.
    - hecho: Convertir el contenido en un informe detallado.
    - actores: Identificar actores clave con su cargo.
    - probable_evolucion: Predecir posibles consecuencias en menos de 3 líneas.

    Noticia:
    Título: {news_item['title']}
    Categoría: {news_item['category']}
    Fecha: {news_item['date']}
    Hora: {news_item['time']}
    Autor: {news_item['author']}
    Contenido: {news_item['content']}

    Devuelve únicamente el JSON sin explicaciones.
    """

    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)

            # Extraer solo el JSON del texto usando regex
            match = re.search(r"```json\n(.*?)\n```", response.text, re.DOTALL)

            if match:
                json_str = match.group(1)  # Extrae solo el contenido JSON
                reporte = json.loads(json_str)  # Convertir a objeto Python

                # Asegurar que "image" y "link" se copien en el reporte
                reporte["_id"] = news_item.get("id", "")
                reporte["numero_reporte"] = news_item.get("numero_reporte", "")
                reporte["fecha"] = news_item.get("date", "")
                reporte["hora"] = news_item.get("time", "")
                reporte["image"] = news_item.get("image", "")

                return reporte
            else:
                raise ValueError("❌ No se encontró JSON en la respuesta del modelo.")

        except Exception as e:
            print(f"⚠️ Error en intento {attempt+1}: {e}")
            time.sleep(2)  # Esperar antes de reintentar

    raise ValueError(f"❌ Falló la conversión después de {retries} intentos.")

# Procesar noticias en lotes de 20 RPM
reportes = []
for i, news in enumerate(leaked_news):
    try:
        reportes.append(transform_news_to_report(news))
        print(f"✅ Noticia {i+1}/{len(leaked_news)} procesada con éxito.")

    except ValueError as e:
        print(f"❌ Error al procesar la noticia {i+1}: {e}")

    # Controlar el límite de 20 RPM
    if (i + 1) % 20 == 0:
        print("⏳ Esperando 60 segundos para evitar el límite de 20 RPM...")
        time.sleep(60)

# Guardar en reports.json

# Acceder a la variable de entorno
reports_path = os.getenv("REPORTS_PATH")
if not reports_path:
    raise ValueError("Error: La ruta de REPORTS_PATH no se encontró en el archivo .env")

with open(reports_path, "w", encoding="utf-8") as f:
    json.dump(reportes, f, ensure_ascii=False, indent=4)

print("✅ Transformación completada. Archivo reports.json generado.")
