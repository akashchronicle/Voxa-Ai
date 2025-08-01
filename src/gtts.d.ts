// src/gtts.d.ts or just gtts.d.ts

declare module 'gtts' {
  export default class gTTS {
    constructor(text: string, lang?: string, slow?: boolean);
    save(filepath: string, callback: (err?: Error) => void): void;
  }
}
