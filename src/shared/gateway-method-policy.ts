<<<<<<< HEAD
export const RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES = [
=======
// Gateway method policy helpers classify reserved and operator-only gateway methods.
const RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES = [
>>>>>>> upstream/main
  "exec.approvals.",
  "config.",
  "wizard.",
  "update.",
] as const;

<<<<<<< HEAD
export const RESERVED_ADMIN_GATEWAY_METHOD_SCOPE = "operator.admin" as const;

export function isReservedAdminGatewayMethod(method: string): boolean {
  return RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES.some((prefix) => method.startsWith(prefix));
}

=======
const RESERVED_ADMIN_GATEWAY_METHOD_SCOPE = "operator.admin" as const;

/** Return whether a gateway method is reserved for operator admin calls. */
function isReservedAdminGatewayMethod(method: string): boolean {
  return RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES.some((prefix) => method.startsWith(prefix));
}

/** Resolve the mandatory scope for reserved gateway methods. */
>>>>>>> upstream/main
export function resolveReservedGatewayMethodScope(
  method: string,
): typeof RESERVED_ADMIN_GATEWAY_METHOD_SCOPE | undefined {
  if (!isReservedAdminGatewayMethod(method)) {
    return undefined;
  }
  return RESERVED_ADMIN_GATEWAY_METHOD_SCOPE;
}

<<<<<<< HEAD
=======
/** Coerce plugin-declared scopes away from unsafe reserved gateway method scopes. */
>>>>>>> upstream/main
export function normalizePluginGatewayMethodScope<TScope extends string>(
  method: string,
  scope: TScope | undefined,
): {
  scope: TScope | typeof RESERVED_ADMIN_GATEWAY_METHOD_SCOPE | undefined;
  coercedToReservedAdmin: boolean;
} {
  const reservedScope = resolveReservedGatewayMethodScope(method);
  if (!reservedScope || !scope || scope === reservedScope) {
    return {
      scope,
      coercedToReservedAdmin: false,
    };
  }
  return {
    scope: reservedScope,
    coercedToReservedAdmin: true,
  };
}
