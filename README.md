# Frontend SPA — Brief Management Application (`/frontend`)

![Angular](https://img.shields.io/badge/Angular-18.2-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-Azure_Blue-1976D2?logo=materialdesign&logoColor=white)

Aplicación Web de Página Única (**SPA**) desarrollada con **Angular 18**, **Standalone Components** y **Angular Material** (tema corporativo Azul), diseñada para la creación, filtrado en memoria y seguimiento de campañas publicitarias y briefs procesados con IA.

---

## Características Principales

- **Arquitectura Standalone & Angular Router:** Navegación fluida sin recarga de página entre las vistas de Inicio (`/`), Listado de Campañas (`/posts`) y Formulario de Creación/Edición (`/posts/new`, `/posts/:id/edit`).
- **Codificación de Adjuntos en Base64:** Los archivos seleccionados en el formulario se convierten en el navegador mediante `FileReader.readAsDataURL()` y se envían en un único payload JSON hacia `POST /posts`.
- **Carga Única y Filtrado 100% Local:** La vista de listado invoca `GET /posts` una sola vez durante el ciclo `ngOnInit()`. El filtrado por nombre de campaña opera íntegramente en la memoria del cliente.
- **Tema Visual Corporativo Azul:** Barra de navegación superior (`<mat-toolbar color="primary">`), tablas de datos (`<table mat-table>`), indicadores de estado (`PENDIENTE` / `COMPLETADO`) y pie de página institucional para **TCIT**.

---

## Estructura de Vistas y Componentes

```text
frontend/src/app/
├── app.config.ts                     # Proveedores globales (Router, HttpClient, Animations)
├── app.routes.ts                     # Definición de rutas de la SPA
├── app.component.ts / .html / .scss  # Layout principal (Navbar Azul, RouterOutlet y Footer)
├── models/
│   └── post.model.ts                 # Interfaces TypeScript en estricto camelCase
├── services/
│   └── post.service.ts               # Cliente HTTP conectado a http://localhost:8080/posts
└── components/
    ├── home/                         # Ruta '/' -> Pantalla de bienvenida TCIT
    ├── post-filter/                  # Barra de búsqueda reactiva en memoria
    ├── post-list/                    # Ruta '/posts' -> Tabla Material con estados y acciones
    └── post-form/                    # Ruta '/posts/new' -> Formulario reactivo (Name, Description, Brief, Attachment)
```

### Mapa de Rutas

| Ruta | Componente | Descripción |
| :--- | :--- | :--- |
| `/` | `HomeComponent` | Pantalla de bienvenida con accesos rápidos al listado y creación de campañas. |
| `/posts` | `PostListComponent` | Tabla de campañas con filtro local, estado de procesamiento, datos extraídos por IA y botones *Edit* / *Delete*. |
| `/posts/new` | `PostFormComponent` | Formulario reactivo con validación para *Campaign Name*, *Description*, *Campaign Brief* y archivo adjunto en Base64. |
| `/posts/:id/edit` | `PostFormComponent` | Vista de edición de una campaña existente con redirección automática a `/posts` al guardar. |

---

## Requisitos Previos

- **Node.js `18.19+` o `20+` / `22+`** y **npm**.
- **Backend en Golang** ejecutándose en `http://localhost:8080` (ver [`/backend/README.md`](../backend/README.md)).

---

## Instrucciones de Instalación y Ejecución

Abre una terminal en **PowerShell** y ejecuta:

```powershell
# 1. Posicionarse en la carpeta del frontend
cd frontend

# 2. Instalar las dependencias de Node.js y Angular Material
npm install

# 3. Levantar el servidor de desarrollo en http://localhost:4200
npx ng serve --port 4200
```

Una vez iniciado el servidor, abre tu navegador en:
**http://localhost:4200**

---

## Comandos Útiles de Mantenimiento

```powershell
# Limpiar la caché de compilación de Angular (.angular/cache) y carpeta dist
Remove-Item -Recurse -Force .angular\cache, dist -ErrorAction SilentlyContinue

# Compilar el bundle de verificación para desarrollo o producción
npx ng build --configuration development
```

