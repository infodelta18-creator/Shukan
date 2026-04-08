import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserOrThrow } from "./lib/auth";
import { mealSlotValidator } from "./schema";

export const listByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db
      .query("quickAdds")
      .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .take(100);
  },
});

export const add = mutation({
  args: {
    date: v.string(),
    mealSlot: mealSlotValidator,
    kcal: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db.insert("quickAdds", {
      userId,
      ...args,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("quickAdds") },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== userId) {
      throw new Error("Entry not found");
    }
    await ctx.db.delete(args.id);
  },
});
