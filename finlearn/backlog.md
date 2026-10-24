# FinLearn — Backlog

## Contexto

FinLearn: app web gamificada para enseñar finanzas personales a usuarios comunes, con módulo teórico (lecciones + quizzes con EXP), simulador de decisiones financieras (mazo de cartas, 5 barras, ciclo mensual de 30 días) y perfil con logros y estadísticas. Proyecto de curso.

**Stack:** React + Vite (frontend) · Node/Express (backend) · PostgreSQL · Roles: jugador y admin

**Decisiones caras:** Roles y permisos (desde el día 1; el resto no aplica)

## Backlog

1. Como **usuario**, quiero **registrarme e iniciar sesión**, para que **mi progreso quede guardado bajo mi identidad**. (completado)
2. Como **usuario**, quiero **leer una lección conceptual breve y completar su quiz**, para que **aprenda el concepto y gane EXP**. Requiere: #1
3. Como **usuario**, quiero **ver mi avatar, apodo, nivel y EXP acumulada en mi perfil**, para que **reconozca mi identidad y avance en la plataforma**. Requiere: #2
4. Como **usuario**, quiero **jugar cartas con escenarios financieros y ver cómo cada decisión mueve de inmediato las cinco barras (ingresos, gastos, ahorros, inversión, diversión)**, para que **practique decisiones con consecuencias visibles**. Requiere: #1
5. Como **usuario**, quiero **que la simulación dure un ciclo mensual de 30 días y termine con una evaluación: EXP si tengo éxito o "desastre" que me obliga a reiniciar el mes**, para que **aprenda a gestionar bien mis recursos**. Requiere: #4
6. Como **admin**, quiero **crear y editar lecciones con sus quizzes**, para que **el contenido teórico crezca sin tocar el código**. Requiere: #2
7. Como **admin**, quiero **crear y editar cartas de escenario con sus opciones y su efecto sobre las barras**, para que **pueda diseñar y balancear el simulador**. Requiere: #4
8. Como **admin**, quiero **iniciar sesión con un rol distinto al de jugador**, para que **solo quien corresponde gestione el contenido**. Requiere: #1, #6
9. Como **usuario**, quiero **desbloquear logros e insignias al alcanzar hitos (quizzes superados, simulaciones difíciles vencidas)**, para que **tener metas más allá de la EXP**. Requiere: #5
10. Como **usuario**, quiero **ver estadísticas de avance (% completitud teórica y desempeño histórico en simulaciones)**, para que **sepa qué tanto he progresado**. Requiere: #2, #5
11. Como **usuario**, quiero **personalizar mi avatar/apodo y cerrar sesión desde los ajustes de mi cuenta**, para que **tenga control sobre mi identidad y mi sesión**. Requiere: #3
12. Como **usuario**, quiero **recuperar mi contraseña mediante un link enviado a mi correo electrónico**, para que **vuelva a entrar a mi cuenta si la olvido**.
