# FinLearn - Educación Financiera Gamificada

## 📖 Descripción del proyecto
FinLearn es una aplicación web para aprender finanzas personales mediante lecciones breves, ejercicios y decisiones simuladas. Nace con el propósito de resolver la falta de educación financiera básica en Colombia, un problema que afecta a gran parte de la población (solo el 16% domina conceptos básicos) y genera sobreendeudamiento y malas decisiones económicas. 

A diferencia de las herramientas tradicionales de presupuesto, FinLearn combina la educación teórica inspirada en microlecciones con una herramienta práctica de distribución de ingresos mensuales, y mecánicas de gamificación orientadas a reforzar hábitos financieros reales. Cabe resaltar que el sistema maneja simulaciones educativas y no se conecta a cuentas bancarias reales ni mueve dinero.

## ✨ Funcionalidades principales
* **Rutas de aprendizaje por niveles:** Ofrece módulos cortos sobre temas como ahorro, deuda, presupuesto, productos financieros e interés compuesto.
* **Microlecciones y cuestionarios:** Incluye ejercicios interactivos de opción múltiple que evalúan las respuestas y entregan retroalimentación inmediata con explicaciones.
* **Simulador de distribución de ingresos:** Permite al aprendiz ingresar su ingreso neto mensual y gastos fijos para calcular un plan según reglas seleccionables (como la regla 50/30/20).
* **Visualización y alertas de viabilidad:** Muestra los montos y porcentajes del plan de ingresos en cifras y gráficas, y genera alertas si los gastos superan el ingreso mensual.
* **Escenarios de decisiones:** Presenta situaciones simuladas de gasto, ahorro y deuda, mostrando las consecuencias de cada elección dentro del simulador para poner a prueba lo aprendido.
* **Sistema de Gamificación:** Otorga experiencia (XP) por lecciones completadas, calcula rachas diarias de actividad y asigna niveles e insignias de acuerdo con el progreso.
* **Explicaciones con Inteligencia Artificial:** Integra un servicio de IA externo (con autorización del usuario) para brindar explicaciones en lenguaje claro y natural sobre la distribución sugerida del presupuesto.
* **Panel de administración dinámico:** Permite a los administradores gestionar cuentas de usuario y realizar operaciones de creación, edición y publicación sobre las rutas, lecciones, reglas y escenarios sin necesidad de modificar el código de la aplicación.

## 👥 Actores del sistema
* **Usuario aprendiz:** Es la persona que interactúa con la plataforma para tomar las lecciones, acumular experiencia (XP) y construir su plan de ingresos simulado.
* **Administrador del sistema:** Es el encargado de gestionar las cuentas de usuario y administrar todo el contenido educativo y de simulación.
* **Sistema de gamificación:** Es el motor interno responsable de calcular el progreso del usuario, otorgando la XP, rachas e insignias.
* **Motor de recomendación de presupuesto:** Es el componente encargado de sugerir la distribución de los ingresos basándose en el perfil del usuario y las reglas configurables del sistema.

## 🛠️ Tecnologías y Arquitectura
* **Frontend:** React (Vite) junto con Tailwind CSS para construir una interfaz ligera y basada en componentes reutilizables.
* **Backend:** Node.js con el framework Express para el desarrollo de la API REST encargada de la lógica de gamificación, contenido y autenticación.
* **Base de datos:** PostgreSQL para el almacenamiento relacional de los usuarios, progreso, lecciones, respuestas y simulaciones de presupuesto.
* **Autenticación y Seguridad:** Se implementa JWT (JSON Web Tokens) con manejo de roles (aprendiz y administrador). Todas las comunicaciones utilizan HTTPS y las contraseñas se almacenan mediante hashes seguros.
* **Despliegue:** Railway se utiliza para el alojamiento del backend, la base de datos y el frontend.

## 👨‍💻 Equipo de Desarrollo (Ingeniería de Software 2)
Proyecto desarrollado por estudiantes de Ingeniería de Sistemas y Computación de la Universidad Nacional de Colombia (Bogotá D.C.):
* Arnold Oswaldo Acosta Ortega
* Omar Alejandro Salazar Carvajal
* Juan David Peña Lozada
* Luis Rodrigo Rivera Rivera
* Nicolas David Moreno Villanueva
