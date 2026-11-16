# Puente de Idiomas

Una app web sencilla para traducir y aprender frases básicas desde el español.

**Abrir:** https://allyor.github.io/puente-de-idiomas/

## Qué hace

- **Traducir** entre español, inglés, ruso, alemán, francés, italiano y ucraniano.
- **Aprender** desde el español hacia el idioma que elijas, con 40 frases y palabras
  sencillas en seis temas: saludos, cortesía, conversar, preguntas, palabras y números.
  - *Frases:* cada una con su escritura original (cirílico en ruso y ucraniano) y la
    pronunciación escrita como se leería en español, con la sílaba fuerte resaltada.
  - *Práctica:* tarjetas para repasar; el avance se guarda en el navegador.
  - *Alfabeto:* las 33 letras cirílicas con su sonido en español. En los demás idiomas,
    las claves de los sonidos que no existen en español.
- **Modo claro y oscuro**, con un botón que recuerda tu elección.
- Funciona en el móvil y en el escritorio.

## Cómo traduce

- Las 40 frases del cuaderno se traducen al instante y sin conexión.
- Cualquier otro texto se envía al servicio gratuito [MyMemory](https://mymemory.translated.net/)
  (sin clave, con un cupo diario). No escribas datos personales.
- En las traducciones automáticas al ruso y al ucraniano, la pronunciación es una
  lectura aproximada letra por letra y no marca la sílaba fuerte.
- El botón del altavoz usa la voz del propio navegador; solo suena si el dispositivo
  tiene una voz instalada para ese idioma.

## Cómo está hecha

Todo vive en `index.html`: HTML, CSS y JavaScript sin dependencias ni paso de compilación.
Las tipografías se cargan de Google Fonts.

Para probarla en local:

```bash
python3 -m http.server 8000
```

y abre http://localhost:8000.

Las frases están en el objeto `BOOK` de `index.html`, una lista por idioma en el mismo
orden que la lista `ES`. Para añadir una frase, agrégala en `ES` y en cada idioma, y
ajusta los rangos de `CATS`.
