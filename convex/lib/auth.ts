import type { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";

export async function getUserOrThrow(
  ctx: QueryCtx | MutationCtx | ActionCtx,
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return { userId: identity.tokenIdentifier };
}
