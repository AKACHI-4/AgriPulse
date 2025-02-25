import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    address: v.string(),
    latitude: v.number(),
    longitude: v.number()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db.insert("users", {
      clerk_id: identity.subject,
      name: String(identity.firstName ?? ""),
      email: identity.email ?? "",
      phone: identity.phoneNumber ?? "",
      ...args,
      created_at: Date.now(),
      updated_at: Date.now()
    });
  }
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log(identity);

    if (!identity) throw new Error("Not authenticated");

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
      .unique();
  }
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { ...args, updated_at: Date.now() });
  }
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
