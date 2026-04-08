import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserOrThrow } from "./lib/auth";
import { mealSlotValidator } from "./schema";

export const listByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db
      .query("mealEntries")
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
    foodId: v.id("foods"),
    servings: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const food = await ctx.db.get(args.foodId);
    if (!food || food.userId !== userId) {
      throw new Error("Food not found");
    }

    return await ctx.db.insert("mealEntries", {
      userId,
      date: args.date,
      mealSlot: args.mealSlot,
      foodId: args.foodId,
      foodName: food.name,
      servings: args.servings,
      kcal: Math.round(food.kcal * args.servings),
      protein: Math.round(food.protein * args.servings * 10) / 10,
      carbs: Math.round(food.carbs * args.servings * 10) / 10,
      fat: Math.round(food.fat * args.servings * 10) / 10,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("mealEntries"),
    servings: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== userId) {
      throw new Error("Entry not found");
    }
    const food = await ctx.db.get(entry.foodId);
    if (!food) {
      throw new Error("Food not found");
    }

    await ctx.db.patch(args.id, {
      servings: args.servings,
      kcal: Math.round(food.kcal * args.servings),
      protein: Math.round(food.protein * args.servings * 10) / 10,
      carbs: Math.round(food.carbs * args.servings * 10) / 10,
      fat: Math.round(food.fat * args.servings * 10) / 10,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("mealEntries") },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== userId) {
      throw new Error("Entry not found");
    }
    await ctx.db.delete(args.id);
  },
});

export const copyMeal = mutation({
  args: {
    sourceDate: v.string(),
    sourceMealSlot: mealSlotValidator,
    targetDate: v.string(),
    targetMealSlot: mealSlotValidator,
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const entries = await ctx.db
      .query("mealEntries")
      .withIndex("by_userId_and_date_and_mealSlot", (q) =>
        q
          .eq("userId", userId)
          .eq("date", args.sourceDate)
          .eq("mealSlot", args.sourceMealSlot),
      )
      .take(50);

    for (const entry of entries) {
      await ctx.db.insert("mealEntries", {
        userId,
        date: args.targetDate,
        mealSlot: args.targetMealSlot,
        foodId: entry.foodId,
        foodName: entry.foodName,
        servings: entry.servings,
        kcal: entry.kcal,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
      });
    }
  },
});
