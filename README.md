# 💸 FinLearn - Educación Financiera Gamificada

## 📖 Descripción del proyecto
FinLearn es una aplicación web para aprender finanzas personales mediante lecciones breves, ejercicios y decisiones simuladas[cite: 1]. Nace con el propósito de resolver la falta de educación financiera básica en Colombia, un problema que afecta a gran parte de la población (solo el 16% domina conceptos básicos) y genera sobreendeudamiento y malas decisiones económicas[cite: 1]. 

A diferencia de las herramientas tradicionales de presupuesto, FinLearn combina la educación teórica inspirada en microlecciones con una herramienta práctica de distribución de ingresos mensuales, y mecánicas de gamificación orientadas a reforzar hábitos financieros reales[cite: 1]. Cabe resaltar que el sistema maneja simulaciones educativas y no se conecta a cuentas bancarias reales ni mueve dinero[cite: 1].

## ✨ Funcionalidades principales
* **Rutas de aprendizaje por niveles:** Ofrece módulos cortos sobre temas como ahorro, deuda, presupuesto, productos financieros e interés compuesto[cite: 1].
* **Microlecciones y cuestionarios:** Incluye ejercicios interactivos de opción múltiple que obligan al usuario a seleccionar una respuesta, evaluando y entregando retroalimentación inmediata con explicaciones[cite: 1].
* **Simulador de distribución de ingresos:** Permite al aprendiz ingresar su ingreso neto mensual y gastos fijos para calcular un plan según reglas seleccionables (como la regla 50/30/20)[cite: 1]. El sistema rechaza valores negativos y explica los errores de entrada[cite: 1].
* **Visualización y alertas de viabilidad:** Muestra los montos y porcentajes del plan en cifras y gráficas[cite: 1]. Si los gastos fijos superan el ingreso mensual, el sistema activa una alerta de inviabilidad y evita presentar el plan como equilibrado[cite: 1].
* **Escenarios de decisiones:** Presenta cartas con escenarios cotidianos donde el usuario elige entre distintas opciones para avanzar en un ciclo mensual de 30 días[cite: 1].
* **Barras de estado dinámicas:** Las decisiones en el simulador afectan inmediatamente cinco barras de estado: Ingresos, Gastos, Ahorros, Inversión y Diversión[cite: 1]. Al finalizar el mes, el sistema evalúa si hubo éxito o un "desastre financiero" que obligue a reiniciar el ciclo[cite: 1].
* **Sistema de Gamificación:** Otorga experiencia (XP) por lecciones completadas, calcula rachas diarias de actividad y asigna niveles e insignias de acuerdo con el progreso, asegurando no otorgar la misma recompensa dos veces[cite: 1].
* **Explicaciones con Inteligencia Artificial:** Integra un servicio de IA externo para brindar explicaciones claras sobre el presupuesto[cite: 1]. Requiere el consentimiento explícito del usuario y solo envía datos agregados, protegiendo la privacidad[cite: 1]. Si la IA tarda más de 10 segundos o falla, el sistema provee una explicación básica predeterminada basada en reglas[cite: 1].
* **Panel de administración dinámico:** Permite a los administradores gestionar cuentas, modificar roles y crear, editar o despublicar rutas, lecciones y escenarios sin necesidad de modificar el código fuente de la aplicación[cite: 1].

## 👥 Actores del sistema
* **Usuario aprendiz:** Persona que interactúa con la plataforma para tomar lecciones, acumular experiencia (XP) y construir su plan de ingresos simulado[cite: 1].
* **Administrador del sistema:** Encargado de gestionar las cuentas de usuario y administrar todo el contenido educativo y de simulación, sin tener acceso a las contraseñas originales de los usuarios[cite: 1].
* **Visitante:** Persona sin cuenta registrada que puede explorar la propuesta de valor y crear una cuenta nueva[cite: 1].

## 🛠️ Tecnologías y Arquitectura
* **Frontend:** React (Vite) junto con Tailwind CSS. Se garantiza la accesibilidad permitiendo que el registro, estudio y elaboración de presupuestos puedan completarse utilizando únicamente el teclado[cite: 1].
* **Backend:** Node.js con el framework Express para el desarrollo de la API REST encargada de la lógica de la plataforma[cite: 1].
* **Base de datos:** PostgreSQL para el almacenamiento relacional de los usuarios, progreso y simulaciones[cite: 1]. Se garantiza la integridad de los presupuestos mediante transacciones, evitando guardados parciales[cite: 1].
* **Autenticación y Seguridad:** Se implementa JWT con manejo de roles en el servidor[cite: 1]. Todas las comunicaciones utilizan HTTPS y las contraseñas se almacenan mediante hashes seguros[cite: 1].
* **Despliegue:** Alojamiento en Railway para backend, base de datos y frontend[cite: 1].

## 🚀 Roadmap de Lanzamientos (Releases)
El desarrollo del proyecto está estructurado en tres fases principales[cite: 1]:
1. **Release 1 - Aprender y planificar (MVP):** Contempla el registro de cuentas, navegación de rutas teóricas, cuestionarios y la creación del plan de presupuesto base[cite: 1].
2. **Release 2 - Motivar y administrar:** Introduce el panel de identidad del perfil, métricas de retención (XP, rachas, insignias) y el panel completo de gestión de contenidos para los administradores[cite: 1].
3. **Release 3 - Simular y explicar con IA:** Implementación del mazo de decisiones complejas, las barras de estado dinámicas, evaluación de fin de mes y la integración con Inteligencia Artificial externa[cite: 1].

## 👨‍💻 Equipo de Desarrollo (Ingeniería de Software 2)
Proyecto desarrollado por estudiantes de Ingeniería de Sistemas y Computación de la Universidad Nacional de Colombia (Bogotá D.C.)[cite: 1]:
* Arnold Oswaldo Acosta Ortega[cite: 1]
* Omar Alejandro Salazar Carvajal[cite: 1]
* Juan David Peña Lozada[cite: 1]
* Luis Rodrigo Rivera Rivera[cite: 1]
* Nicolas David Moreno Villanueva[cite: 1]
