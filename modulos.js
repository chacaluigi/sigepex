@startuml
skinparam linetype ortho
skinparam rectangle {
  RoundCorner 15
  Shadowing true
}

entity "Usuario" as Usuario {
  _id : ObjectId
  nombre : String
  correo : String
  password : String
  brand_color : String
  img : String
  rol : ObjectId (ref Rol)
  estado : Boolean
  createdAt : Date
  updatedAt : Date
}

entity "Rol" as Rol {
  _id : ObjectId
  nombre : String
  slug : String
  descripcion : String
  estado : String
  createdAt: Date,
  updatedAt: Date
  modulos : [ObjectId] (ref Modulo)
}

entity "Modulo" as Modulo {
  _id : ObjectId
  position : Number
  name : String
  icon : String
  path : String
  estado : String
  createdAt: Date,
  updatedAt: Date
}

entity "Solicitud" as Solicitud {
  _id : ObjectId
  usuario : ObjectId (ref Usuario)
  asignadoA : [ObjectId] (ref Rol)
  reportes : [ObjectId] (ref Reporte)
  titulo : String
  descripcion : String
  palabrasClave : [String]
  rangoFechaHora : { inicio : Date, fin : Date }
  estado : String
  fecha_creacion : Date
  fecha_finalizacion : Date
  createdAt : Date
  updatedAt : Date
}

entity "Reporte" as Reporte {
  _id : ObjectId
  numero_reporte : Number
  tema : String
  categoria : String
  factor : [String]
  lugar : [String]
  departamento : [String]
  pais : [String]
  fuentes : [String]
  fechaHora : Date
  hecho : String
  actores : [{ nombre, cargo, _id }]
  probable_evolucion : String
  image : String
  createdAt : Date
  updatedAt : Date
  posts : [ObjectId] (ref Post)
}

entity "Post" as Post {
  _id : ObjectId
  contenido : String
  fuente : String
  fecha_publicacion : Date
  imagenes : String
  cantidad_replies : Number
  cantidad_likes : Number
  cantidad_views : Number
  createdAt: Date,
  updatedAt: Date
}

Usuario - Rol : tiene
Rol -- Modulo : contiene >
Solicitud --> Usuario : creada por >
Solicitud -- Rol : asignada a >
Solicitud -- Reporte : contiene >
Reporte -- Post : contiene >
Reporte - "Actores (embebido)"
@enduml



const ReporteSchema = new Schema({
  numero_reporte: { type: Number, required: true },
  tema: { type: String, required: true },
  categoria: { type: String },
  factor: [{ type: String }],
  lugar: [{ type: String }],
  departamento: [{ type: String }],
  pais: [{ type: String }],
  fuentes: [{ type: String }],
  fechaHora: { type: Date },
  hecho: { type: String },
  actores: [
    {
      nombre: { type: String },
      cargo: { type: String },
    },
  ],
  probable_evolucion: { type: String },
  image: { type: String },
});

const UsuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { type: String },
    rol: { type: Schema.Types.ObjectId, ref: "Rol", required: true },
    sedes: [{ type: Schema.Types.ObjectId, ref: "Sede" }],
    estado: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const RolSchema = new Schema({
  nombre: { type: String, required: true },
  slug: { type: String, required: true },
  descripcion: { type: String },
  modulos: [{ type: Schema.Types.ObjectId, ref: "Modulo" }],
});

const ModuloSchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String },
  path: { type: String },
  estado: { type: String, default: "activo" },
});

const SolicitudSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
  asignadoA: { type: Schema.Types.ObjectId, ref: "Usuario" },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  palabrasClave: [{ type: String }],
  rangoFechaHora: {
    inicio: { type: Date },
    fin: { type: Date },
  },
  estado: { type: String, default: "En Proceso" },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_finalizacion: { type: Date },
});

const PostSchema = new Schema({
  contenido: { type: String, required: true },
  fuente: { type: String },
  fecha_publicacion: { type: Date },
  imagenes: { type: String },
  cantidad_replies: { type: Number, default: 0 },
  cantidad_likes: { type: Number, default: 0 },
  cantidad_views: { type: Number, default: 0 },
});


