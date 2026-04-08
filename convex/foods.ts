import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserOrThrow } from "./lib/auth";

export const list = query({
  args: {
    filter: v.optional(
      v.union(v.literal("favorites"), v.literal("recent")),
    ),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);

    if (args.filter === "favorites") {
      return await ctx.db
        .query("foods")
        .withIndex("by_userId_and_isFavorite", (q) =>
          q.eq("userId", userId).eq("isFavorite", true),
        )
        .take(100);
    }

    if (args.filter === "recent") {
      return await ctx.db
        .query("foods")
        .withIndex("by_userId_and_lastUsedAt", (q) =>
          q.eq("userId", userId),
        )
        .order("desc")
        .take(50);
    }

    return await ctx.db
      .query("foods")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(200);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db
      .query("foods")
      .withSearchIndex("search_name", (q) =>
        q.search("name", args.query).eq("userId", userId),
      )
      .take(50);
  },
});

export const getById = query({
  args: { id: v.id("foods") },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const food = await ctx.db.get(args.id);
    if (!food || food.userId !== userId) return null;
    return food;
  },
});

export const getByBarcode = query({
  args: { barcode: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db
      .query("foods")
      .withIndex("by_userId_and_barcode", (q) =>
        q.eq("userId", userId).eq("barcode", args.barcode),
      )
      .unique();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    brand: v.optional(v.string()),
    kcal: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    defaultServingSize: v.number(),
    servingUnit: v.string(),
    barcode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db.insert("foods", {
      ...args,
      userId,
      isFavorite: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("foods"),
    name: v.string(),
    brand: v.optional(v.string()),
    kcal: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    defaultServingSize: v.number(),
    servingUnit: v.string(),
    barcode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const food = await ctx.db.get(args.id);
    if (!food || food.userId !== userId) {
      throw new Error("Food not found");
    }
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("foods") },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const food = await ctx.db.get(args.id);
    if (!food || food.userId !== userId) {
      throw new Error("Food not found");
    }
    await ctx.db.delete(args.id);
  },
});

export const toggleFavorite = mutation({
  args: { id: v.id("foods") },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const food = await ctx.db.get(args.id);
    if (!food || food.userId !== userId) {
      throw new Error("Food not found");
    }
    await ctx.db.patch(args.id, { isFavorite: !food.isFavorite });
  },
});

export const markUsed = mutation({
  args: { id: v.id("foods") },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const food = await ctx.db.get(args.id);
    if (!food || food.userId !== userId) {
      throw new Error("Food not found");
    }
    await ctx.db.patch(args.id, { lastUsedAt: Date.now() });
  },
});
