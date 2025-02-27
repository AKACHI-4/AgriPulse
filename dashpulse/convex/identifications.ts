import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createIdentification = mutation({
  args: {
    user_id: v.id("users"),
    model_version: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    image_url: v.string(),
    is_plant: v.boolean(),
    plant_name: v.string(),
    probability: v.float64(),
    details: v.object({
      taxonomy: v.object({
        kingdom: v.string(),
        phylum: v.string(),
        class: v.string(),
        order: v.string(),
        family: v.string(),
        genus: v.string(),
      }),
      common_names: v.array(v.string()),
      synonyms: v.array(v.string()),
      rank: v.string(),
      description: v.object({
        value: v.string(),
        citation: v.string()
      }),
      external_links: v.object({
        wikipedia: v.string(),
        gbif_id: v.number(),
        inaturalist_id: v.number(),
      }),
      image: v.object({
        value: v.string(),
        citation: v.string(),
      }),
    }),
    similar_images: v.array(
      v.object({
        url: v.string(),
        similarity: v.float64(),
        citation: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("identifications", {
      ...args,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  },
});

// export const getIdentificationsByUser = query({
//   args: { user_id: v.id('users') },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query('identifications')
//       .withIndex('by_user', (q) => q.eq('user_id', args.user_id))
//       .collect();
//   }
// });

// export const deleteIdentification = mutation({
//   args: { id: v.id('identifications') },
//   handler: async (ctx, args) => {
//     return await ctx.db.delete(args.id);
//   }
// });
