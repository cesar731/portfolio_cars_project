# 🧠 Personal Software Process (PSP)

> *“If you can’t measure it, you can’t improve it.”* — **Watts Humphrey**

## 📘 Acerca de este repositorio

Este repositorio documenta mi aplicación práctica del **Personal Software Process (PSP)** durante el desarrollo de software. Contiene:

- Soluciones a ejercicios y asignaciones del PSP.
- Registros de métricas (tamaño, esfuerzo, defectos).
- Análisis de desempeño personal.
- Planes de mejora continua.
- Evidencia del uso de herramientas digitales (Clockify, GitHub Issues, Google Sheets, etc.).

El objetivo es transformar mi proceso de desarrollo en uno **medible, predecible y orientado a la calidad**, mediante la disciplina del PSP.

---

## 📚 Fundamentos del PSP

El **Personal Software Process (PSP)** es un marco estructurado desarrollado por **Watts Humphrey** en el **Software Engineering Institute (SEI)** para aplicar los principios del *Capability Maturity Model (CMM)* al trabajo individual del ingeniero de software.

### 🎯 Objetivos del PSP

El PSP capacita a los desarrolladores para:

- **Mejorar la precisión en estimaciones** de tamaño y esfuerzo.
- **Cumplir compromisos** de entrega con mayor confiabilidad.
- **Gestionar la calidad** desde las primeras fases del desarrollo.
- **Reducir defectos** mediante revisiones personales sistemáticas.
- **Evaluar y mejorar continuamente** su propio proceso con base en datos.

---

## 🧱 Niveles de madurez del PSP

El aprendizaje del PSP sigue una progresión evolutiva:

| Nivel       | Enfoque principal                | Prácticas clave |
|-------------|----------------------------------|-----------------|
| **PSP0 / PSP0.1** | Disciplina y medición básica     | Registro de tiempo, tamaño (LOC), defectos; estándar de codificación; Plan de Mejora Personal (PPIP). |
| **PSP1 / PSP1.1** | Estimación y planificación       | Uso de datos históricos; método **PROBE**; planificación de tareas y cronogramas. |
| **PSP2 / PSP2.1** | Gestión de calidad y diseño       | Revisiones de **diseño** y **código**; listas de verificación personalizadas; análisis estadístico de defectos y productividad. |

---

## 📊 Pilares del PSP: Datos, Medición y Mejora

El PSP se basa en cuatro elementos esenciales:

- **Scripts**: guían las actividades del proceso.
- **Medidas**: tamaño (LOC), esfuerzo (minutos/horas), calidad (defectos), cronograma.
- **Estándares**: aseguran consistencia en el código y los datos.
- **Formularios**: registran información de manera estructurada.

### Métricas clave derivadas:

- Productividad (LOC/hora)  
- Densidad de defectos (defectos/KLOC)  
- Precisión de estimaciones (% de error)  
- Distribución del tiempo por fase  
- *Process Yield* (porcentaje de defectos eliminados antes de la prueba)

### Métodos cuantitativos:

- **PROBE** (*Proxy-Based Estimating*): mejora la estimación mediante analogía con proyectos pasados.
- **Valor Ganado (Earned Value)**: monitorea el progreso real vs. planificado.
- **Análisis estadístico**: regresión lineal, correlación y desviación estándar para predecir desempeño.

---

## 🧠 Calidad: El corazón del PSP

La calidad en el PSP se logra **detectando y eliminando defectos lo más cerca posible de donde se introducen**. Para ello, se implementan:

- **Revisión de diseño**: antes de codificar.
- **Revisión de código**: antes de probar.
- **Checklists personalizadas**: basadas en defectos históricos propios (ej.: validación de contraseñas >72 bytes en bcrypt, correos inválidos sin `email-validator`).

Esto reduce drásticamente el tiempo y costo de corrección en fases tardías.

---

## 🛠 Herramientas digitales integradas (Actividad 4)

Como parte de la implementación del PSP con apoyo tecnológico, utilizo:

| Propósito              | Herramienta            | Uso en este repositorio |
|------------------------|------------------------|--------------------------|
| **Time Tracking**      | Clockify               | Registro de esfuerzo por fase (planificación, codificación, pruebas, etc.) |
| **Defect Tracking**    | GitHub Issues          | Cada defecto registrado con: fase de introducción, tipo, gravedad y estado |
| **Análisis de datos**  | Google Sheets + Python | Cálculo de métricas y generación de gráficos (productividad, densidad de defectos, desviación en estimaciones) |

> 📸 Las capturas de pantalla y evidencias están disponibles en la carpeta [`/docs/psp_evidence`](./docs/psp_evidence/).

---

## 🧭 Aplicación personal en *portfolio_cars_project*

En este ciclo del PSP, he aplicado los principios anteriores al desarrollo de mi proyecto **portfolio_cars_project** (aplicación web para gestión de autos con autenticación, simulación de pagos y facturación por email). 

He aprendido que:
- Subestimé el esfuerzo por no considerar límites técnicos de librerías (ej.: `bcrypt` con contraseñas largas).
- Los defectos más comunes surgieron en validación de entradas.
- La falta de checklist de revisión aumentó el retrabajo.

Gracias al PSP, ahora planifico con PROBE, mido con rigor y mejoro con intención.

---

## 📚 Referencias

- Humphrey, W. S. (2005). *PSP: A Self-Improvement Process for Software Engineers*. Addison-Wesley.  
- SEI. (2009). *The Personal Software Process Body of Knowledge, Version 2.0*.  
- SEI. *Self-Study PSP Material*.  
- [Process Dashboard (Open Source PSP Tool)](https://processdash.sourceforge.net/)

---

### ✍️ Autor

**José Correa - Cesar Jimenez**  
Estudiante de Ingeniería de Software  
Repositorio académico — Aplicación del PSP en el desarrollo personal de software.