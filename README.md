# DOU - Plataforma de Entrenamiento en Programación Competitiva 🦜

## ⚠️ Importante
Este repositorio contiene únicamente el frontend de la plataforma DOU. Para que funcione correctamente, es necesario tener el backend en ejecución. El frontend está diseñado para trabajar en conjunto con el backend desarrollado en Rust, por lo que su funcionalidad estará limitada sin él.

## Descripción
DOU es una plataforma educativa especializada en programación competitiva, diseñada para ayudar a estudiantes y entusiastas a desarrollar sus habilidades de programación. La plataforma ofrece un entorno interactivo y desafiante donde los usuarios pueden practicar, competir y mejorar sus habilidades de resolución de problemas algorítmicos.

## Características Principales
- **Sistema de Prácticas**: Ejercicios estructurados por niveles de dificultad
- **Contests**: Competencias programadas con ranking y seguimiento de progreso
- **Tutoriales Interactivos**: Material educativo detallado sobre algoritmos y estructuras de datos
- **Sistema de Envíos**: Evaluación en tiempo real de soluciones
- **Perfil de Usuario**: Seguimiento de progreso y estadísticas de rendimiento
- **Comunidad**: Interacción entre usuarios y discusión de soluciones

## Tecnologías
### Frontend
- **React**: Biblioteca principal para la interfaz de usuario
- **Vite**: Bundler y herramienta de desarrollo
- **CSS**: Estilos y diseño responsivo
- **JavaScript**: Lógica de la aplicación

### Backend
- **Rust**: Lenguaje de programación principal
- **PostgreSQL**: Base de datos relacional
- **JWT**: Autenticación y autorización

## Equipo de Desarrollo
DOU es desarrollado por estudiantes de Ingeniería de Sistemas de la Universidad Pedagógica y Tecnológica de Colombia (UPTC):

- **Nicolás Sarmiento** - Backend
- **Nicolás Tinjaca** - Backend
- **José Salamanca** - Frontend

## Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/your-username/dou-frontend.git
cd dou-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto
```
dou-frontend/
├── src/
│   ├── components/     # Componentes React reutilizables
│   ├── pages/         # Páginas principales
│   ├── context/       # Contextos de React
│   ├── hooks/         # Hooks personalizados
│   ├── services/      # Servicios y llamadas API
│   └── styles/        # Estilos globales
├── public/            # Archivos estáticos
└── tests/             # Pruebas unitarias y de integración
```

---

**DOU** - Transformando el aprendizaje de programación competitiva 🚀