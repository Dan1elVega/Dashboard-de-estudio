# 📘 Dashboard de Estudio · Proyecto Integrador de Ingeniería de Software

Dashboard web (HTML, CSS y JavaScript puros, sin dependencias ni compilación) para organizar el estudio y la entrega de la **Evaluación Parcial I: Proyecto Integrador de Ingeniería de Software**.

- **Modalidad:** Individual
- **Entrega:** PDF
- **Alcance del proyecto:** 36 semanas
- **Plazo:** 12 al 19 de octubre · 24 horas de presupuesto (3 h/día)

## ✨ Funciones

| Sección | Qué hace |
|---|---|
| **Hero** | Título, etiquetas y objetivo general colapsable, con un anillo de avance y el siguiente entregable pendiente. |
| **Panel de prioridades y tiempo** | Inicio, entrega, presupuesto, alcance y estado del plazo en vivo ("Día X de 8"). Seis prioridades con anillo de porcentaje y horas estimadas. |
| **Metodología de estudio** | Flujo 50 → 10 → 50 → 10 → 50 → 10 min y **temporizador** que avanza solo por las fases, con aviso sonoro. |
| **Calendario** | Línea de tiempo de 8 días; cada día se expande para ver sus 3 bloques y su entregable. Abre automáticamente el día de hoy. |
| **Control de avance** | Lista de 8 entregables con casillas funcionales; actualiza la barra superior (0/8), el anillo y el calendario. Filtros: todos, pendientes y completados. |
| **Extras** | Modo claro/oscuro (respeta el del sistema), progreso guardado en `localStorage`, diseño responsivo y accesible. |

## 📁 Estructura

```
.
├── index.html   # Estructura de la página
├── style.css    # Estilos, modo oscuro y responsive
├── script.js    # Lógica: datos, calendario, progreso y temporizador
└── README.md
```

## ▶️ Cómo usarlo en local

Abre `index.html` en tu navegador (doble clic). No necesita instalar nada.

## 🚀 Subirlo a GitHub y publicarlo (GitHub Pages)

1. Crea un repositorio vacío en GitHub (por ejemplo `dashboard-proyecto-integrador`).
2. En la carpeta con los 4 archivos, ejecuta:

   ```bash
   git init
   git add .
   git commit -m "Dashboard de estudio - Proyecto Integrador"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/dashboard-proyecto-integrador.git
   git push -u origin main
   ```

3. En GitHub ve a **Settings → Pages**. En *Build and deployment* elige **Deploy from a branch**, rama **main** y carpeta **/ (root)**, y pulsa **Save**.
4. En uno o dos minutos tu dashboard estará en:
   `https://TU_USUARIO.github.io/dashboard-proyecto-integrador/`

## 🛠️ Personalización

Todo el contenido está al inicio de `script.js`, en la sección **DATOS**:

- `DAYS`: días, bloques y entregables del calendario.
- `PRIORITIES`: prioridades, porcentajes y entregables clave.
- `PHASES`: fases y duración de la sesión de estudio.
- `START` y `BUDGET_HOURS`: fecha de inicio y horas totales.

## 📄 Licencia

Proyecto académico de uso libre.
