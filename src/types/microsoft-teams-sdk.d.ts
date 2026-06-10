/** Minimal ambient types for Microsoft Teams SDK packages used by the Teams plugin. */
declare module "@microsoft/teams.apps" {
  /** Teams app auth helper used to fetch bot and Graph tokens. */
  export class App {
    constructor(options: { clientId: string; clientSecret: string; tenantId?: string });

    getBotToken(): Promise<{ toString(): string } | null>;
    getAppGraphToken(): Promise<{ toString(): string } | null>;
  }
}

declare module "@microsoft/teams.api" {
  /** Teams API client subset used for conversation activity sends. */
  export class Client {
    constructor(
      serviceUrl: string,
      options?: {
        token?: (() => Promise<string | undefined>) | undefined;
        headers?: Record<string, string> | undefined;
      },
    );

    conversations: {
      activities: (conversationId: string) => {
        create: (activity: Record<string, unknown>) => Promise<unknown>;
      };
    };
  }
}
<<<<<<< HEAD

declare module "@microsoft/teams.apps/dist/middleware/auth/jwt-validator.js" {
  export type JwtValidationOptions = {
    clientId: string;
    tenantId?: string;
    jwksUriOptions: { type: "uri"; uri: string } | { type: "tenantId" };
    validateIssuer?: { allowedIssuer: string } | { allowedTenantIds?: string[] };
    validateServiceUrl?: { expectedServiceUrl: string };
  };

  export class JwtValidator {
    constructor(options: JwtValidationOptions, logger?: unknown);
    validateAccessToken(
      token: string,
      options?: {
        validateServiceUrl?: { expectedServiceUrl: string } | undefined;
      },
    ): Promise<object | null>;
  }

  export function createServiceTokenValidator(
    appId: string,
    tenantId?: string,
  ): {
    validateAccessToken(
      token: string,
      options?: {
        validateServiceUrl?: { expectedServiceUrl: string } | undefined;
      },
    ): Promise<unknown>;
  };
}
=======
>>>>>>> upstream/main
