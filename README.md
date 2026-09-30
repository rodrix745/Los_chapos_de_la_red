# 💸 FinLearn - Educación Financiera Gamificada

## 📖 Descripción del proyecto
FinLearn es una aplicación web para aprender finanzas personales mediante lecciones breves, ejercicios y decisiones simuladas. Nace con el propósito de resolver la falta de educación financiera básica en Colombia, un problema que afecta a gran parte de la población (solo el 16% domina conceptos básicos) y genera sobreendeudamiento y malas decisiones económicas. 

A diferencia de las herramientas tradicionales de presupuesto, FinLearn combina la educación teórica inspirada en microlecciones con una herramienta práctica de distribución de ingresos mensuales, y mecánicas de gamificación orientadas a reforzar hábitos financieros reales. Cabe resaltar que el sistema maneja simulaciones educativas y no se conecta a cuentas bancarias reales ni mueve dinero.

## ✨ Funcionalidades principales
* **Rutas de aprendizaje por niveles:** Ofrece módulos cortos sobre temas como ahorro, deuda, presupuesto, productos financieros e interés compuesto.
* **Microlecciones y cuestionarios:** Incluye ejercicios interactivos de opción múltiple que obligan al usuario a seleccionar una respuesta, evaluando y entregando retroalimentación inmediata con explicaciones.
* **Simulador de distribución de ingresos:** Permite al aprendiz ingresar su ingreso neto mensual y gastos fijos para calcular un plan según reglas seleccionables (como la regla 50/30/20). El sistema rechaza valores negativos y explica los errores de entrada.
* **Visualización y alertas de viabilidad:** Muestra los montos y porcentajes del plan en cifras y gráficas. Si los gastos fijos superan el ingreso mensual, el sistema activa una alerta de inviabilidad y evita presentar el plan como equilibrado.
* **Escenarios de decisiones:** Presenta cartas con escenarios cotidianos donde el usuario elige entre distintas opciones para avanzar en un ciclo mensual de 30 días.
* **Barras de estado dinámicas:** Las decisiones en el simulador afectan inmediatamente cinco barras de estado: Ingresos, Gastos, Ahorros, Inversión y Diversión. Al finalizar el mes, el sistema evalúa si hubo éxito o un "desastre financiero" que obligue a reiniciar el ciclo.
* **Sistema de Gamificación:** Otorga experiencia (XP) por lecciones completadas, calcula rachas diarias de actividad y asigna niveles e insignias de acuerdo con el progreso, asegurando no otorgar la misma recompensa dos veces.

## 👥 Actores del sistema
* **Usuario aprendiz:** Persona que interactúa con la plataforma para tomar lecciones, acumular experiencia (XP) y construir su plan de ingresos simulado.
* **Administrador del sistema:** Encargado de gestionar las cuentas de usuario y administrar todo el contenido educativo y de simulación, sin tener acceso a las contraseñas originales de los usuarios.
* **Visitante:** Persona sin cuenta registrada que puede explorar la propuesta de valor y crear una cuenta nueva.

## 🛠️ Tecnologías y Arquitectura
* **Frontend:** React (Vite) junto con Tailwind CSS. Se garantiza la accesibilidad permitiendo que el registro, estudio y elaboración de presupuestos puedan completarse utilizando únicamente el teclado.
* **Backend:** Node.js con el framework Express para el desarrollo de la API REST encargada de la lógica de la plataforma.
* **Base de datos:** PostgreSQL para el almacenamiento relacional de los usuarios, progreso y simulaciones. Se garantiza la integridad de los presupuestos mediante transacciones, evitando guardados parciales.
* **Autenticación y Seguridad:** Se implementa JWT con manejo de roles en el servidor. Todas las comunicaciones utilizan HTTPS y las contraseñas se almacenan mediante hashes seguros.
* **Despliegue:** Alojamiento en Railway para backend, base de datos y frontend.

## 🚀 Roadmap de Lanzamientos (Releases)
El desarrollo del proyecto está estructurado en tres fases principales:
1. **Release 1 - Aprender y planificar (MVP):** Contempla el registro de cuentas, navegación de rutas teóricas, cuestionarios y la creación del plan de presupuesto base.
2. **Release 2 - Motivar y administrar:** Introduce el panel de identidad del perfil, métricas de retención (XP, rachas, insignias) y el panel completo de gestión de contenidos para los administradores.
3. **Release 3 - Simular y explicar con IA:** Implementación del mazo de decisiones complejas, las barras de estado dinámicas, evaluación de fin de mes y la integración con Inteligencia Artificial externa.

## 👨‍💻 Equipo de Desarrollo (Ingeniería de Software 2)
Proyecto desarrollado por estudiantes de Ingeniería de Sistemas y Computación de la Universidad Nacional de Colombia (Bogotá D.C.):
* Arnold Oswaldo Acosta Ortega
* Omar Alejandro Salazar Carvajal
* Juan David Peña Lozada
* Luis Rodrigo Rivera Rivera
* Nicolas David Moreno Villanueva
