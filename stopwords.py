import nltk
from nltk.corpus import stopwords

# Descargar lista de stopwords en español si no está disponible
nltk.download("stopwords")

# Definir lista de stopwords en español
stop_words = set(stopwords.words("spanish"))

# Datos preprocesados sin caracteres especiales
posts_procesados = [
    {"contenido": "las autoridades han reportado un incidente en la frontera norte"},
    {"contenido": "se están evaluando los daños tras la explosión en la refinería"},
]





def eliminar_stopwords(texto):
    palabras = texto.split()
    palabras_filtradas = [palabra for palabra in palabras if palabra not in stop_words]
    return " ".join(palabras_filtradas)

# Aplicar eliminación de stopwords en los posts
for post in posts_procesados:
    post["contenido_limpio"] = eliminar_stopwords(post["contenido"])


for post in posts_procesados:
    print(f"Texto original: {post['contenido']}")
    print(f"Texto sin stopwords: {post['contenido_limpio']}\n")




# Importar librerías necesarias
import nltk
from nltk.tokenize import word_tokenize

# Descargar recursos de NLTK si es necesario
nltk.download('punkt')

# Ejemplo de un post preprocesado
post_preprocesado = "se ha reportado incidente frontera norte autoridades alerta"



# Aplicar tokenización a múltiples posts
posts_tokenizados = [word_tokenize(post["contenido"]) for post in posts_list]

# Mostrar una muestra de los primeros posts tokenizados
for i, tokens in enumerate(posts_tokenizados[:5]):
    print(f"Post {i+1} Tokenizado: {tokens}")



# Aplicar tokenización al contenido del post
tokens = word_tokenize(post_preprocesado)

# Mostrar los tokens obtenidos
print(tokens)



import spacy

# Cargar el modelo de lenguaje en español
nlp = spacy.load("es_core_news_sm")


def lematizar_texto(texto):
    doc = nlp(texto)
    texto_lematizado = " ".join([token.lemma_ for token in doc if not token.is_punct])
    return texto_lematizado


# Aplicar lematización a cada post
for post in posts_list:
    post["contenido_lematizado"] = lematizar_texto(post["contenido"])

# Verificar la actualización de los datos
print(posts_list[:5])  # Muestra los primeros cinco posts procesados




# Verificar que todos los posts procesados tienen los campos esperados
def validar_integridad(posts_procesados):
    for post in posts_procesados:
        assert "fuente" in post and isinstance(post["fuente"], str)
        assert "contenido_procesado" in post and isinstance(post["contenido_procesado"], str)
        assert "fecha_publicacion" in post and isinstance(post["fecha_publicacion"], str)
        assert "interacciones" in post and isinstance(post["interacciones"], dict)

    print("✅ Integridad de datos validada correctamente.")

validar_integridad(posts_procesados)




# Verificar que no haya caracteres especiales, URLs o menciones en el contenido procesado
import re

def validar_limpieza(posts_procesados):
    for post in posts_procesados:
        assert not re.search(r"http[s]?://\S+", post["contenido_procesado"])  # No debe haber URLs
        assert not re.search(r"@\w+", post["contenido_procesado"])  # No debe haber menciones
        assert not re.search(r"[^\w\s]", post["contenido_procesado"])  # No debe haber caracteres especiales

    print("✅ Limpieza de datos validada correctamente.")

validar_limpieza(posts_procesados)



# Verificar que el contenido procesado está tokenizado y lematizado
def validar_lemas(posts_procesados, nlp_model):
    for post in posts_procesados:
        doc = nlp_model(post["contenido_procesado"])
        lemas = [token.lemma_ for token in doc]
        assert all(isinstance(lemma, str) for lemma in lemas)  # Todos deben ser cadenas de texto

    print("Lematización validada correctamente.")

validar_lemas(posts_procesados, nlp_model)



# Función para validar todos los pasos del preprocesamiento
def validar_preprocesamiento(posts_procesados, nlp_model):
    try:
        validar_integridad(posts_procesados)
        validar_limpieza(posts_procesados)
        validar_lemas(posts_procesados, nlp_model)
        print("✅ Todos los pasos del preprocesamiento han sido validados con éxito.")
    except AssertionError as e:
        print("⚠️ Error en la validación del preprocesamiento:", e)

# Ejecutar la validación completa
validar_preprocesamiento(posts_procesados, nlp_model)


