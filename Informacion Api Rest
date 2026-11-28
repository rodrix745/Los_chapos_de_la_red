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
