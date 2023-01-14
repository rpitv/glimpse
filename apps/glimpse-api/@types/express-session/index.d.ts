declare module 'express-session' {
  interface SessionData {
    loginMethod?: 'discord' | 'local';
    discordAccessToken?: string;
    discordRefreshToken?: string;
  }
}
export {};
