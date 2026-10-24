# Plan — Historia #1: Registro e inicio de sesión

## Story
Como **usuario**, quiero **registrarme e iniciar sesión**, para que **mi progreso quede guardado bajo mi identidad**.

## Acceptance criteria
- [ ] Given que estoy en la pantalla de registro, when ingrese un email nuevo, un apodo y una contraseña, then entro a la app ya autenticado y veo mi apodo en la pantalla principal.
- [ ] Given que tengo una cuenta y ya cerré la app, when inicie sesión con mi email y contraseña correctos, then entro a la app como yo y mi sesión se mantiene aunque cierre y vuelva a abrir la app.
- [ ] Given que intento registrarme con un email ya usado, o iniciar sesión con datos incorrectos, then veo un mensaje de error claro en la pantalla correspondiente y no quedo autenticado.

## Plan
- Crear en la base de datos el usuario: email único, apodo y contraseña guardada de forma segura (hasheada).
- En el backend, un endpoint de registro que valide y guarde, y uno de inicio de sesión que verifique las credenciales.
- En el frontend, formularios de registro y de login con mensajes de error en línea.
- Establecer la sesión al autenticarse y que el frontend la incluya en cada petición.
- Una pantalla principal mínima que solo muestre que ya estás autenticado (apodo del usuario) como punta del walking skeleton.

## Out of scope
- Rol admin y verificación de permisos (historia #8).
- Recuperación de contraseña (historia #12) — solo guardamos el email con vistas a eso.
- Ver avatar, nivel y EXP en el perfil (historia #3).
- Personalizar apodo/avatar y cerrar sesión (historia #11).
- Contenido real en la pantalla principal (lecciones, simulador).

## Suggestions (your call)
- Para mantener la sesión: cookie de sesión vs JWT en el cliente. Si no hay preferencia, la cookie suele ser menos propensa a errores.
- Desde esta historia conviene tener funcionando el proyecto completo (Vite + Express + PostgreSQL) — la infraestructura se corta aquí, no como historia aparte.
