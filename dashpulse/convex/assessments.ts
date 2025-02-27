import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAssessment = mutation({
  args: {
    user_id: v.id("users"),
    model_version: v.string(),
    image_url: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    is_plant: v.boolean(),
    is_healthy: v.boolean(),
    health_probability: v.optional(v.number()),
    plant_probability: v.optional(v.number()),

    diseases: v.array(
      v.object({
        name: v.string(),
        probability: v.number(),
        description: v.optional(v.string()),
        classification: v.optional(v.array(v.string())),
        common_names: v.optional(v.array(v.string())),
        cause: v.optional(v.string()),
        treatment: v.object({
          biological: v.optional(v.array(v.string())),
          chemical: v.optional(v.array(v.string())),
          cultural: v.optional(v.array(v.string())),
          prevention: v.optional(v.array(v.string())),
        }),
        similar_images: v.array(
          v.object({
            id: v.string(),
            url: v.string(),
            url_small: v.optional(v.string()),
            license_name: v.optional(v.string()),
            license_url: v.optional(v.string()),
            citation: v.optional(v.string()),
            similarity: v.optional(v.number()),
          })
        ),
      })
    ),

    completed_at: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("assessments", {
      ...args,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  },
});

// export const getAssessmentsByUser = query({
//   args: { user_id: v.id('users') },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query('assessments')
//       .withIndex('by_user', (q) => q.eq('user_id', args.user_id))
//       .collect();
//   }
// });

// export const deleteAssessment = mutation({
//   args: { id: v.id('assessments') },
//   handler: async (ctx, args) => {
//     return await ctx.db.delete(args.id);
//   }
// });
