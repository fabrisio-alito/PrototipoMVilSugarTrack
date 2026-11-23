# SugarTrack 🍬

**Tu dulce guía saludable**

SugarTrack es una aplicación móvil de **salud preventiva** que te ayuda a conocer y controlar cuánta azúcar consumes cada día. Calcula un límite diario personalizado, te muestra con un semáforo cómo vas y te acompaña con una mascota, **Dulci**, que analiza tu semana y te da recomendaciones.

> ⚠️ **Este repositorio contiene un prototipo funcional (demo) para fines académicos y de validación de idea.** No es un producto médico, no hace diagnósticos y no reemplaza la consulta con un médico o nutricionista.

---

## ✨ ¿Qué hace?

| Módulo | Descripción |
|---|---|
| **Registro y perfil** | Crear cuenta, datos corporales (edad, sexo, peso, talla, cintura, antecedentes familiares, actividad) y objetivo. |
| **Indicadores y límite diario** | IMC, relación cintura-talla y un **límite diario de azúcar** personalizado, con el cálculo explicado paso a paso. |
| **Cuestionario de hábitos** | 6 preguntas (qué dulces consumes, bebidas al día, cuándo se te antoja, ritmo de cambio…) para personalizar tu enfoque y tu reto diario. |
| **Inicio** | Círculo dinámico con el azúcar del día, semáforo (bajo control / cerca del límite / excedido), racha de días y reto diario. |
| **Registrar alimentos** | Catálogo con búsqueda y categorías, **escaneo de código de barras** (demo), **foto del plato** (demo) y **registro manual** para comida casera. |
| **Detalle del alimento** | Azúcar por porción, equivalencia en cucharaditas, comparación con tu límite y alternativas. |
| **Alerta de exceso** | Aviso cuando te pasas del límite, con opción de deshacer o elegir una alternativa. |
| **Progreso** | Promedio diario, azúcar por día, mapa del mes, tendencia de 4 semanas, día de la semana con más consumo y origen del azúcar. |
| **Historial** | Registro de los últimos días con total y nivel de cada uno. |
| **Dulci (asistente)** | Mascota que saluda, analiza tu semana, explica por qué te pasaste y recomienda qué reducir. Puedes **escribirle** o **hablarle con el micrófono**; el plan Gratis incluye 3 preguntas al día. |
| **Premium (demo)** | Alertas tempranas, gráficos de todo el año, planes personalizados y Dulci sin límite. Se gestiona en *Mi suscripción*. |
| **Configuración** | Recordatorios, idioma (inglés y modo oscuro: próximamente), suscripción, términos, privacidad, aviso médico y borrar mis datos. |

### 🎭 Modos de demo

- **Iniciar sesión** carga una cuenta de ejemplo (semana completa, hábitos respondidos y racha).
- **Crear cuenta** empieza desde cero: 0 g registrados y estados vacíos con Dulci.
- El botón **"Cargar datos de ejemplo"** (Inicio, Progreso y Perfil) llena la app para mostrarla.

---

## 🧱 Tecnologías

- **React** + **TypeScript**
- **Vite**
- **Tailwind CSS** (con estilos propios en `index.css`)
- Prototipo creado y publicado con **Figma Make**
- Ilustraciones de alimentos y mascota en **SVG** hechas en código (sin imágenes externas)

**Identidad visual:** azul marino `#14284B` · naranja `#F26A1B` · tipografía **Inter**.

## 📁 Estructura

```
src/
├── App.tsx      # Pantallas, estado y lógica de la app
├── Logo.tsx     # Logo de SugarTrack
├── index.css    # Estilos de todas las pantallas y animaciones
└── main.tsx     # Punto de entrada
```

La navegación se maneja con un estado `Screen` dentro de `App.tsx`. El estado compartido (alimentos registrados, límite, hábitos, modo demo) vive en el componente `App`, de modo que Inicio, Registrar, Progreso e Historial muestran siempre los mismos totales.

---

## 🚀 Cómo ejecutarlo

Requisitos: **Node.js 18 o superior**.

```bash
# 1. Clonar el repositorio
git clone https://github.com/<tu-usuario>/<tu-repositorio>.git
cd <tu-repositorio>

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Luego abre la dirección que muestre la terminal (normalmente `http://localhost:5173`). La interfaz está pensada para verse como un **teléfono de 390 × 844 px**.

---

## 🧮 ¿Cómo se calcula el límite diario?

1. **Energía diaria** según edad, sexo, peso, talla y actividad física (fórmula de Mifflin-St Jeor).
2. **Parte para azúcar libre:** la OMS recomienda menos del 10 % de la energía diaria, e idealmente menos del 5 %. Si hay factores de riesgo en los datos, la app usa un porcentaje menor.
3. **Límite:** calorías para azúcar ÷ 4 kcal por gramo, redondeado a múltiplos de 5.

---

## ⚠️ Alcance y limitaciones (leer antes de usar)

Este es un **prototipo**. Para ser transparentes:

- **Escáner de código de barras y foto del plato:** son **simulaciones**. Los productos, platos y valores de azúcar son datos de ejemplo.
- **Voz de Dulci:** usa el reconocimiento de voz del navegador cuando existe; si no, simula una pregunta de ejemplo. Los textos legales son de ejemplo y requieren revisión de un abogado.
- **Dulci (asistente):** no es una IA real. Son **reglas** que leen los registros y arman las frases. En una versión real se conectaría a un modelo de lenguaje, con límites claros para que no dé diagnósticos.
- **Datos de progreso, historial y fecha:** son de ejemplo (la fecha del prototipo está fija en el martes 14 de mayo).
- **Reglas propias del equipo:** los umbrales del semáforo, la racha, el reto diario, la reducción de límite por factores de riesgo y las recomendaciones de Dulci son **propuestas del equipo** y **no han sido validadas por un profesional de la salud**.
- **Octógono "Alto en azúcar":** los umbrales usados son referenciales y deben verificarse con la normativa peruana de advertencias publicitarias vigente.
- **Premium y precio:** el plan Premium (referencial S/ 12.90 al mes) y sus funciones son ilustrativos.
- **Privacidad:** el cuestionario recoge datos de salud. Una versión real necesitaría consentimiento informado y una política de privacidad. En este prototipo nada se guarda ni se envía: los datos viven solo en memoria.

---

## 🗺️ Próximos pasos

- [ ] Validar límites, semáforo y recomendaciones con un nutricionista
- [ ] Escaneo real de códigos de barras con base de datos de productos
- [ ] Reporte en PDF para compartir con el médico
- [ ] Asistente conectado a un modelo de lenguaje, con salvaguardas
- [ ] Reconocimiento de platos por foto (exploratorio)
- [ ] Alertas tempranas y recordatorios reales (notificaciones)
- [ ] Guardado de datos y cuentas reales
- [ ] Pruebas con usuarios

---

## 👥 Equipo

Proyecto desarrollado por **Jorge, Fabricio, Piero, Jean y Jesús**.

<!-- Puedes agregar aquí el curso, la universidad y el nombre del profesor -->

## 📄 Licencia

<!-- Elige una licencia (por ejemplo MIT) o indica "Todos los derechos reservados". -->

---

<p align="center"><strong>SugarTrack</strong> · Disfruta lo dulce, sin perder el equilibrio 🍬</p>
