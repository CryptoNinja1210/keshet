export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    isSubscribed: boolean;
    provider: string | null;
  }