# Atma audio files

Put real audio here; the meditation player picks it up automatically from `manifest.json`.
If a file is missing, the player falls back to the sounds it generates itself.

## Music tracks (`music/`)
Loop-friendly MP3s, ideally 3+ minutes, licensed for use in apps (e.g. Pixabay Content License).

```json
"music": [
  { "id": "flute", "name": "Bansuri flute", "name_te": "వేణువు", "file": "music/flute.mp3",
    "credit": "Artist name, Pixabay" }
]
```

## Recorded guided meditations (`guided/`)
One MP3 per meditation and language: the whole guided session, read slowly with pauses.
The key is the meditation id from `meditations.js`.

```json
"guided": {
  "anapanasati": {
    "te": { "file": "guided/anapanasati-te.mp3", "credit": "Voice: Anudeep" },
    "en": { "file": "guided/anapanasati-en.mp3", "credit": "Voice: Anudeep" }
  }
}
```
