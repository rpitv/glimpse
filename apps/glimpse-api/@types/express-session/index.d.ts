declare module 'express-session' {
  interface SessionData {
    loginMethod: 'discord' | 'local';
  }
}
export {};
