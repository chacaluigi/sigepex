import tweepy

# Credenciales de la API de X
API_KEY = "TU_API_KEY"
API_SECRET_KEY = "TU_API_SECRET_KEY"
ACCESS_TOKEN = "TU_ACCESS_TOKEN"
ACCESS_TOKEN_SECRET = "TU_ACCESS_TOKEN_SECRET"

# Autenticación con OAuth 2.0
auth = tweepy.OAuthHandler(API_KEY, API_SECRET_KEY)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth, wait_on_rate_limit=True)

# Verificación de autenticación exitosa
try:
    user = api.verify_credentials()
    print("Autenticación exitosa. Usuario:", user.screen_name)
except Exception as e:
    print("Error en la autenticación:", e)

#PARAMETROS

#Configuración de la Consulta

# Definición de los parámetros de búsqueda
query = "#DefensaNacional OR 'seguridad estratégica'"  # Palabras clave y hashtags
start_date = "2025-01-01"
end_date = "2025-03-31"
language = "es"

# Construcción de la consulta en la API
tweets = tweepy.Cursor(api.search_tweets, 
                       q=query,
                       lang=language,
                       since=start_date,
                       until=end_date).items(100)

#Ejecución y Validación de la Consulta

# Almacenar los resultados en una lista
data = [{"usuario": tweet.user.screen_name, "texto": tweet.text, "fecha": tweet.created_at} for tweet in tweets]

# Mostrar una muestra de los resultados obtenidos
for post in data[:5]:
    print(post)

#Ajuste de Parámetros para Optimización

# Ajuste de consulta con operadores de exclusión y filtrado por usuario específico
query = "#DefensaNacional OR 'seguridad estratégica' -deporte from:MinDefensa"



# Solicitar posts a la API de X usando los parámetros definidos
tweets = tweepy.Cursor(api.search_tweets, 
                       q=query,         # Parámetros de búsqueda
                       lang=language,   # Idioma especificado
                       since=start_date,  # Fecha de inicio
                       until=end_date).items(100)  # Número de posts a recuperar



# Extracción de metadatos de los posts obtenidos
data = [{"usuario": tweet.user.screen_name,  # Usuario que publicó
         "fecha": tweet.created_at,          # Fecha de publicación
         "contenido": tweet.text,            # Contenido del post
         "likes": tweet.favorite_count,      # Número de likes
         "replies": tweet.reply_count,       # Número de replies
         "retweets": tweet.retweet_count}    # Número de retweets
        for tweet in tweets]



# Normalización de los datos extraídos para MongoDB
normalized_data = []
for post in data:
    normalized_post = {
        "usuario": post["usuario"],  # Nombre de usuario
        "fecha": post["fecha"],      # Fecha de publicación
        "contenido": post["contenido"],  # Contenido del post
        "likes": post["likes"],      # Número de likes
        "replies": post["replies"],  # Número de replies
        "retweets": post["retweets"],  # Número de retweets
        "timestamp": post["fecha"].timestamp(),  # Convertir la fecha a timestamp para indexación
        "relevancia": calcular_relevancia(post)  # Calcular y asignar un valor de relevancia
    }
    normalized_data.append(normalized_post)



# Almacenamiento de los posts en la colección "POSTS" de MongoDB
posts_collection = db["POSTS"]
posts_collection.insert_many(normalized_data)

# Crear índices para optimizar consultas por fecha y relevancia
posts_collection.create_index([("timestamp", pymongo.ASCENDING)])
posts_collection.create_index([("relevancia", pymongo.DESCENDING)])




# Consulta de prueba para verificar el almacenamiento de los datos
post_example = posts_collection.find_one({"usuario": "ejemplo_usuario"})
print(post_example)


















