https://app.swaggerhub.com/apis/universidadnacionald-8aa/finlearn_api/1.0.0

# Catálogo de API REST – FinLearn (Release 1: MVP)

Especificación de endpoints para el **Release 1 (MVP – Aprender y planificar)** del proyecto **FinLearn** (Ingeniería de Software 2 – Universidad Nacional de Colombia). Cubre las 12 Historias de Usuario (*Must*) correspondientes a Autenticación, Educación/Evaluaciones y Presupuestos en COP.

> **Nota de alcance:** Todos los montos y cálculos son educativos/simulados en pesos colombianos (COP). El sistema no mueve dinero real ni se conecta a entidades financieras.

---

## 1. Convenciones Globales

* **Base URL:** `/api/v1`
* **Formato de intercambio:** `application/json` (UTF-8)
* **Autenticación:** Token JWT enviado en cabecera:
  `Authorization: Bearer <token>`
* **Estructura estándar de errores:**

```json
{
  "timestamp": "2026-11-27T21:00:00Z",
  "status": 422,
  "error": "Unprocessable Entity",
  "code": "BR-14_NEGATIVE_AMOUNT",
  "message": "El ingreso mensual y los gastos fijos no pueden ser negativos.",
  "details": [
    {
      "field": "monthly_income_cop",
      "issue": "Debe ser mayor o igual a 0"
    }
  ]
}
```

---

## 2. Mapeo de Códigos de Estado HTTP

| Código | Estado | Aplicación en FinLearn | Trazabilidad |
| :--- | :--- | :--- | :--- |
| `200` / `201` | OK / Created | Consulta exitosa (`200`) o creación de usuario, intento de quiz o plan de presupuesto (`201`). | General |
| `400` | Bad Request | JSON malformado, tipos de dato incorrectos o parámetros de ruta/consulta inválidos. | Validación sintáctica |
| `401` | Unauthorized | Token JWT ausente, expirado o inválido; credenciales incorrectas en inicio de sesión. | RNF Seguridad |
| `403` | Forbidden | Rol insuficiente para la operación o cuenta desactivada lógicamente. | BR-03, BR-06 |
| `404` | Not Found | Recurso inexistente o en estado borrador/no publicado (oculto para `LEARNER`). | BR-15, BR-33 |
| `409` | Conflict | Conflicto con el estado actual: correo duplicado al registrarse o lección bloqueada por prerrequisito pendiente. | BR-01, BR-09 |
| `422` | Unprocessable Entity | Violación de regla de negocio: montos negativos en COP, suma de regla != 100% o respuestas inválidas en quiz. | BR-14, BR-16, BR-23 |

---

## 3. Catálogo de Endpoints

### Módulo A: Autenticación y Perfil (`HU 1.1`)

| Método | Endpoint | Descripción | Roles | Códigos HTTP | Reglas (BR) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Registra un nuevo usuario con rol `LEARNER` por defecto y contraseña hasheada. | Público | `201`, `400`, `409`, `422` | BR-01, BR-03, BR-05 |
| `POST` | `/auth/login` | Autentica credenciales y retorna JWT junto con el perfil básico. | Público | `200`, `400`, `401`, `403` | BR-05, BR-06 |
| `GET` | `/users/me` | Retorna el perfil del usuario autenticado (sin exponer el hash de contraseña). | `LEARNER`, `ADMIN` | `200`, `401` | BR-03 |

### Módulo B: Educación y Evaluaciones (`HU 3.1 – HU 3.6`, `HU 3.8`)

| Método | Endpoint | Descripción | Roles | Códigos HTTP | Reglas (BR) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/learning-paths` | Lista las rutas de aprendizaje publicadas con sus módulos. | `LEARNER`, `ADMIN` | `200`, `401` | BR-15 |
| `GET` | `/modules/{moduleId}/lessons` | Lista las lecciones publicadas de un módulo, indicando estado de bloqueo y completitud. | `LEARNER`, `ADMIN` | `200`, `401`, `404` | BR-09, BR-15 |
| `GET` | `/lessons/{lessonId}` | Obtiene el contenido completo de una microlección publicada (valida prerrequisito). | `LEARNER`, `ADMIN` | `200`, `401`, `404`, `409` | BR-09, BR-15 |
| `POST` | `/lessons/{lessonId}/complete` | Registra o actualiza `user_lesson_progress` marcando la lección como completada. | `LEARNER` | `200`, `401`, `404`, `409` | BR-09, BR-15 |
| `GET` | `/lessons/{lessonId}/quiz` | Obtiene el cuestionario de la lección con preguntas y opciones (sin revelar la correcta). | `LEARNER`, `ADMIN` | `200`, `401`, `404` | BR-15 |
| `POST` | `/quizzes/{quizId}/attempts` | Evalúa las respuestas, guarda `quiz_attempts` y devuelve puntaje + explicación inmediata. | `LEARNER` | `201`, `400`, `401`, `404`, `422` | BR-10 |
| `GET` | `/users/me/progress` | Retorna el resumen de progreso educativo (lecciones completadas, porcentaje y últimos quizzes). | `LEARNER` | `200`, `401` | HU 3.8 |

### Módulo C: Presupuestos en COP (`HU 4.7 – HU 4.10`)

| Método | Endpoint | Descripción | Roles | Códigos HTTP | Reglas (BR) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/distribution-rules` | Lista las reglas de distribución publicadas (ej. 50/30/20). | `LEARNER`, `ADMIN` | `200`, `401` | BR-16, BR-33 |
| `GET` | `/expense-categories` | Lista las categorías de gastos fijos disponibles. | `LEARNER`, `ADMIN` | `200`, `401` | BR-18 |
| `POST` | `/budgets` | Crea un plan de presupuesto mensual en COP, calcula distribución, deduce gastos fijos y evalúa déficit. | `LEARNER` | `201`, `400`, `401`, `404`, `422` | BR-14, BR-16, BR-18, BR-19, BR-23 |
| `GET` | `/budgets` | Lista el historial paginado de presupuestos del usuario autenticado. | `LEARNER` | `200`, `401` | BR-22 |
| `GET` | `/budgets/{budgetId}` | Obtiene el detalle completo de un plan de presupuesto propio. | `LEARNER` | `200`, `401`, `403`, `404` | BR-22 |

---

## 4. Ejemplos de Payloads Clave

### Enviar intento de Quiz (`POST /quizzes/{quizId}/attempts`)

**Request:**
```json
{
  "answers": [
    { "question_id": 101, "selected_option_id": 402 },
    { "question_id": 102, "selected_option_id": 405 }
  ]
}
```

**Response (`201 Created` – BR-10):**
```json
{
  "attempt_id": 55,
  "quiz_id": 12,
  "score_percentage": 50.0,
  "passed": false,
  "completed_at": "2026-11-27T21:10:00Z",
  "feedback": [
    {
      "question_id": 101,
      "is_correct": true,
      "explanation": "Correcto. Un fondo de emergencia debe cubrir entre 3 y 6 meses de gastos básicos."
    },
    {
      "question_id": 102,
      "is_correct": false,
      "correct_option_id": 406,
      "explanation": "El interés compuesto calcula rendimientos sobre el capital inicial más los intereses acumulados."
    }
  ]
}
```

### Crear Presupuesto con Alerta de Déficit (`POST /budgets`)

**Request (BR-14, BR-18, BR-23):**
```json
{
  "month": "2026-11",
  "monthly_income_cop": 2500000,
  "distribution_rule_id": 1,
  "savings_goal_cop": 400000,
  "fixed_expenses": [
    { "category_id": 1, "name": "Arriendo", "amount_cop": 1100000 },
    { "category_id": 1, "name": "Servicios públicos", "amount_cop": 250000 }
  ]
}
```

**Response (`201 Created` – BR-19):**
```json
{
  "budget_id": 89,
  "month": "2026-11",
  "monthly_income_cop": 2500000,
  "rule_applied": { "id": 1, "name": "50/30/20" },
  "savings_goal_cop": 400000,
  "total_fixed_expenses_cop": 1350000,
  "has_deficit": true,
  "deficit_alerts": [
    {
      "bucket": "NEEDS",
      "allocated_cop": 1250000,
      "spent_cop": 1350000,
      "difference_cop": -100000,
      "message": "Tus gastos fijos en Necesidades superan la asignación recomendada en $100.000 COP."
    }
  ],
  "breakdown": [
    { "bucket": "NEEDS", "percentage": 50, "allocated_cop": 1250000, "remaining_cop": -100000 },
    { "bucket": "WANTS", "percentage": 30, "allocated_cop": 750000, "remaining_cop": 750000 },
    { "bucket": "SAVINGS", "percentage": 20, "allocated_cop": 500000, "remaining_cop": 500000 }
  ],
  "created_at": "2026-11-27T21:15:00Z"
}
```
# Releases 2 y 3

Especificación de endpoints para el **Release 2 (Motivar y administrar)** y el **Release 3 (Simular y explicar con IA)** del proyecto **FinLearn** (Ingeniería de Software 2 – Universidad Nacional de Colombia). Hereda las convenciones globales (`/api/v1`, JWT y estructura de errores) definidas en el catálogo del MVP.

---

## 1. Release 2: Motivar y Administrar (`18 HU`)

### Módulo A: Recuperación de Cuenta y Perfil (`HU 1.2 – HU 1.6`)

| Método | Endpoint | Descripción | Roles | Códigos HTTP | Reglas (BR) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/password-reset/request` | Genera token temporal de un solo uso y envía correo. **Siempre retorna `200`** con mensaje genérico sin revelar si el email existe. | Público | `200`, `400` | BR-04 |
| `POST` | `/auth/password-reset/confirm` | Valida token temporal, actualiza la contraseña hasheada e invalida el token. | Público | `200`, `400`, `404`, `409`, `422` | BR-04, BR-05 |
| `PATCH` | `/users/me` | Actualiza datos básicos del perfil (ej. nombre). | `LEARNER`, `ADMIN` | `200`, `400`, `401`, `422` | BR-03 |
| `PATCH` | `/users/me/password` | Cambia la contraseña actual validando la contraseña previa. | `LEARNER`, `ADMIN` | `200`, `400`, `401`, `422` | BR-05 |

### Módulo B: Gamificación – XP, Rachas e Insignias (`HU 3.7`, `HU 5.1 – HU 5.3`)

| Método | Endpoint | Descripción | Roles | Códigos HTTP | Reglas (BR) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/users/me/gamification` | Retorna XP total, nivel actual, progreso al siguiente nivel y racha diaria activa/máxima (`user_streaks`). | `LEARNER` | `200`, `401` | BR-13 |
| `GET` | `/users/me/badges` | Lista las insignias desbloqueadas (`user_badges`) y las disponibles por desbloquear. | `LEARNER` | `200`, `401` | BR-12 |

> **Nota de diseño:** El otorgamiento de XP, actualización de racha y asignación de insignias se ejecuta de forma interna y transaccional en el backend al completar lecciones, quizzes o simulaciones, evitando manipulación desde el cliente y previniendo duplicados (**BR-12**).

### Módulo C: Administración de Usuarios y Contenidos (`HU 2.1 – HU 2.9`)

> Todos los endpoints bajo `/admin` validan rol `ADMIN` en backend; cualquier petición de un `LEARNER` responde `403 Forbidden` (**BR-03**).

| Método | Endpoint | Descripción | Roles | Códigos HTTP | Reglas (BR / RF) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/admin/users` | Lista usuarios con filtros por rol y estado (sin exponer contraseñas). | `ADMIN` | `200`, `401`, `403` | BR-03, BR-05 |
| `PATCH` | `/admin/users/{userId}/role` | Cambia el rol de un usuario (`LEARNER` ↔ `ADMIN`). | `ADMIN` | `200`, `400`, `401`, `403`, `404`, `422` | BR-03 |
| `PATCH` | `/admin/users/{userId}/status` | Desactiva o reactiva lógicamente una cuenta sin borrar su historial. | `ADMIN` | `200`, `400`, `401`, `403`, `404` | BR-06 |
| `POST` / `PUT` | `/admin/lessons` / `/{id}` | Crea o edita microlecciones y prerrequisitos opcionales sin redespliegue. | `ADMIN` | `200`, `201`, `400`, `401`, `403`, `404`, `422` | BR-09, RNF |
| `PATCH` | `/admin/lessons/{id}/publish` | Cambia visibilidad de una lección (`DRAFT` ↔ `PUBLISHED`). | `ADMIN` | `200`, `401`, `403`, `404`, `422` | BR-15 |
| `POST` / `PUT` | `/admin/distribution-rules` / `/{id}` | Crea o edita reglas de distribución validando suma de porcentajes igual a `100%`. | `ADMIN` | `200`, `201`, `400`, `401`, `403`, `422` | BR-16, BR-33 |
| `DELETE` | `/admin/distribution-rules/{id}` | Elimina una regla de distribución. Retorna **`409 Conflict`** si está referenciada por presupuestos activos. | `ADMIN` | `204`, `401`, `403`, `404`, `409` | RF-17 |
| `POST` / `PUT` | `/admin/scenarios` / `/{id}` | Crea o edita escenarios de simulación, decisiones y sus impactos JSON. | `ADMIN` | `200`, `201`, `400`, `401`, `403`, `422` | BR-25, BR-33 |

---

## 2. Release 3: Simulación Financiera e IA Externa (`8 HU`)

### Módulo D: Simulación Financiera de 30 Días (`HU 4.1 – HU 4.6`)

| Método | Endpoint | Descripción | Roles | Códigos HTTP | Reglas (BR / HU) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/simulations/scenarios` | Lista los escenarios de simulación publicados disponibles para jugar. | `LEARNER`, `ADMIN` | `200`, `401` | BR-33 |
| `POST` | `/simulations` | Inicia una nueva partida (`user_simulations`) en día 1 y estado `IN_PROGRESS`. | `LEARNER` | `201`, `400`, `401`, `404` | BR-25, BR-29 |
| `GET` | `/simulations/{simulationId}` | Obtiene el estado actual de la simulación (día, saldo, deuda, ahorro, estado y opciones del día). | `LEARNER` | `200`, `401`, `403`, `404` | BR-29 |
| `POST` | `/simulations/{simulationId}/decisions` | Aplica la decisión elegida (impacto JSON), registra en `simulation_logs` y avanza el día. Retorna **`409 Conflict`** si está en `DISASTER` o `COMPLETED`. | `LEARNER` | `200`, `400`, `401`, `403`, `404`, `409`, `422` | BR-25, BR-28, BR-29, HU 4.3 |
| `GET` | `/simulations/{simulationId}/summary` | Devuelve el resumen final, puntaje obtenido y bitácora una vez finalizada (`COMPLETED` o `DISASTER`). | `LEARNER` | `200`, `401`, `403`, `404`, `409` | BR-28, BR-29 |

### Módulo E: Explicación de Presupuesto con IA Externa (`HU 5.4`, `HU 5.5`)

| Método | Endpoint | Descripción | Roles | Códigos HTTP | Reglas (BR) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/budgets/{budgetId}/ai-explanation` | Solicita explicación al servicio de IA externo enviando solo datos numéricos agregados (cero PII). Requiere consentimiento explícito. | `LEARNER` | `200`, `201`, `400`, `401`, `403`, `404`, `422`, `503`*, `504`* | BR-37, BR-40 |
| `GET` | `/budgets/{budgetId}/ai-explanation` | Recupera la última explicación persistida (`ai_budget_explanations`) sin volver a consultar la IA externa. | `LEARNER` | `200`, `401`, `403`, `404` | BR-40 |

---

## 3. Estrategia de `503` / `504` y Fallback de IA (`BR-40`)

| Escenario | Comportamiento en Backend | Respuesta al Frontend | Comportamiento en UI |
| :--- | :--- | :--- | :--- |
| **IA responde en $\le 10\text{ s}$** | Anonimiza datos (cero PII), recibe respuesta y la guarda en `ai_budget_explanations`. | `201 Created` (`source: "AI"`) | Muestra la explicación con la etiqueta visible **"Generado por IA"**. |
| **IA tarda $> 10\text{ s}$ o falla (`503`/`504` externo)** | Aborta la llamada a los `10 s`, captura el fallo y ejecuta `handleTimeoutFallback()`. | `200 OK` (`source: "FALLBACK"`) | Muestra explicación predeterminada local sin interrumpir al aprendiz (**BR-40**). |
| **Fallo interno crítico** | FinLearn no puede responder ni acceder a plantillas locales. | `503` / `504` | Muestra mensaje de mantenimiento temporal con opción de reintentar. |

---

## 4. Ejemplos de Payloads Clave (Release 3)

### Enviar Decisión en Simulación (`POST /simulations/{simulationId}/decisions`)

**Request:**
```json
{
  "day": 14,
  "decision_id": 305
}
```

**Response (`200 OK` – transición a `DISASTER`, BR-25 y BR-29):**
```json
{
  "simulation_id": 72,
  "day": 14,
  "status": "DISASTER",
  "impact_applied": {
    "cash_cop": -600000,
    "debt_cop": 450000,
    "wellbeing_score": -15
  },
  "current_metrics": {
    "cash_cop": -150000,
    "savings_cop": 0,
    "debt_cop": 1200000,
    "wellbeing_score": 40
  },
  "final_score": 32,
  "message": "Tu saldo cayó por debajo de cero sin ahorros disponibles. La simulación ha terminado en estado DISASTER."
}
```

### Solicitar Explicación con IA (`POST /budgets/{budgetId}/ai-explanation`)

**Request (valida consentimiento explícito – BR-37):**
```json
{
  "explicit_consent": true
}
```
> Si `explicit_consent` es `false` o se omite, el backend responde `422 Unprocessable Entity` (`BR-37_CONSENT_REQUIRED`).

**Response con Fallback por Timeout $> 10\text{ s}$ (`200 OK` – BR-40):**
```json
{
  "explanation_id": 19,
  "budget_id": 89,
  "source": "FALLBACK",
  "ai_generated": false,
  "display_label": "Explicación estándar del sistema",
  "fallback_reason": "EXTERNAL_AI_TIMEOUT",
  "content": "Tu presupuesto presenta un déficit de $100.000 COP en la categoría de Necesidades frente a la regla 50/30/20. Considera ajustar gastos variables o revisar tu meta de ahorro para equilibrar el mes.",
  "generated_at": "2026-11-27T21:20:10Z"
}
```
