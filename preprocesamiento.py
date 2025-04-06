from pymongo import MongoClient

# Conectar a la base de datos NoSQL (MongoDB)
client = MongoClient("mongodb://localhost:27017/")
db = client["red_social"]
collection = db["POSTS"]


# Consultar todos los posts almacenados en la colección
posts = collection.find({}, {"fuente": 1, "contenido": 1, "imagenes": 1, "fecha_publicacion": 1, "interacciones": 1})

# Convertir los datos en una lista para su procesamiento
posts_list = list(posts)


{
    "_id": "660a8e3b9f1a2b001b5e7e63",
    "fuente": "Cuenta_Oficial",
    "contenido": "Se ha reportado un incidente en la frontera norte. Las autoridades están en alerta.",
    "imagenes": ["https://x.com/image1.jpg"],
    "fecha_publicacion": "2025-03-30T14:30:00",
    "interacciones": {
        "comentarios": 150,
        "likes": 320,
        "views": 5000
    }
}



# Verificar la cantidad de posts recuperados
print(f"Total de posts recuperados: {len(posts_list)}")

# Mostrar una muestra de los primeros cinco posts
for post in posts_list[:5]:
    print(post)








{
    "contenido": "📢 Última hora: @NoticiasX informa sobre un incidente. Más detalles aquí 👉 https://x.com/noticia123 #Urgente 🚨"
}


import re

def limpiar_texto(texto):
    # Eliminar URLs
    texto = re.sub(r'http\S+|www\S+', '', texto)
    # Eliminar menciones de usuarios (@usuario)
    texto = re.sub(r'@\w+', '', texto)
    # Eliminar caracteres especiales y emojis
    texto = re.sub(r'[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]', '', texto)
    return texto

# Aplicar limpieza al conjunto de posts
for post in posts_list:
    post["contenido"] = limpiar_texto(post["contenido"])


{
    "contenido": "Última hora informa sobre un incidente Más detalles aquí Urgente"
}



# Los posts_list ya contiene los posts extraídos de la base de datos
for post in posts_list[:5]:  # Muestra de los primeros cinco posts
    print("Antes:", post["contenido"])


# Aplicar conversión a minúsculas
for post in posts_list:
    post["contenido"] = post["contenido"].lower()


# Verificar la conversión
for post in posts_list[:5]:  # Muestra de los primeros cinco posts procesados
    print("Después:", post["contenido"])

#Antes
{
    "contenido": "Se HA Reportado un Incidente en la Frontera Norte. Las Autoridades están en ALERTA."
}
#Despues
{
    "contenido": "se ha reportado un incidente en la frontera norte. las autoridades están en alerta."
}



