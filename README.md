# Control de parámetros CSS por voz

Prueba de concepto de un script que controla parámetros CSS a partir de análisis de voz por micrófono mediante palabras clave en español.
Script desarrollado con Claude AI.

## Requisitos

- Python 3 instalado.
- Google Chrome recomendado, ya que el script utiliza la API `SpeechRecognition` / `webkitSpeechRecognition`.
- Un micrófono disponible y permiso para que el navegador lo utilice.

## Estructura

Guarda el código HTML y demás archivos en tu equipo, por ejemplo:

```text
proyecto/
├── index.html
├── src/
└── README.md
```

## Lanzar el servidor HTTP con Python

No es recomendable abrir el archivo `index.html` directamente con `file://`, especialmente cuando se trabaja con APIs del navegador que requieren un contexto servido por HTTP.

### 1. Abrir una terminal

Abre una terminal y sitúate en la carpeta donde está `index.html`.

En Windows:

```powershell
cd C:\ruta\a\proyecto
```

En macOS o Linux:

```bash
cd /ruta/a/proyecto
```

### 2. Comprobar que Python está instalado

Ejecuta:

```bash
python --version
```

Si ese comando no funciona, prueba:

```bash
python3 --version
```

Deberías obtener una versión de Python 3, por ejemplo:

```text
Python 3.x.x
```

### 3. Iniciar el servidor HTTP

Con Python 3:

```bash
python -m http.server 8000
```

En macOS/Linux, si utilizas `python3`:

```bash
python3 -m http.server 8000
```

El servidor quedará escuchando en el puerto `8000`.

### 4. Abrir la página

En Google Chrome, accede a:

```text
http://localhost:8000
```

Si el archivo se llama `index.html`, Python lo mostrará automáticamente.

También puedes acceder directamente a:

```text
http://localhost:8000/index.html
```

## Uso

1. Abre la página en Google Chrome.
2. Pulsa **🎤 Activar micrófono**.
3. Concede permiso para utilizar el micrófono cuando el navegador lo solicite.
4. Pronuncia las palabras de control:

| Palabra | Acción |
|---|---|
| `hogar` | Enciende la caja azul |
| `puerta` | Apaga la caja azul |
| `banca` | Enciende la caja verde |
| `reloj` | Apaga la caja verde |

El texto reconocido aparecerá en la sección de transcripción.

## Detener el servidor

Vuelve a la terminal donde está ejecutándose Python y pulsa:

```text
Ctrl + C
```

## Cambiar el puerto

Si el puerto `8000` está ocupado, puedes utilizar otro, por ejemplo:

```bash
python -m http.server 8080
```

En ese caso, abre:

```text
http://localhost:8080
```

## Notas

- El reconocimiento de voz depende del soporte del navegador y de la disponibilidad de la API `SpeechRecognition`.
- El script configura el idioma como `es-ES`.
- Se recomienda utilizar Google Chrome para este ejemplo.
- El servidor HTTP de Python solo sirve los archivos; el reconocimiento de voz se ejecuta en el navegador.
