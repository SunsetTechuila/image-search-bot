import type { Image } from "shared/types";
import { z } from "zod";

export default function parseSearchResult(searchResult: string): Image[] {
  const { blocks } = SearchResultSchema.parse(JSON.parse(searchResult));

  return blocks.flatMap((block) => {
    const { entities } = block.params.adapterData.serpList.items;
    return Object.values(entities);
  });
}

const EntitySchema = z
  .object({
    alt: z.string(),
    origWidth: z.number(),
    origHeight: z.number(),
    origUrl: z.string(),
  })
  .transform((entity) => ({
    alt: entity.alt,
    width: entity.origWidth,
    height: entity.origHeight,
    url: entity.origUrl,
  }));

const BlockSchema = z.object({
  params: z.object({
    ok: z.boolean(),
    adapterData: z.object({
      serpList: z.object({
        items: z.object({
          entities: z.record(EntitySchema),
        }),
        loadNextState: z.string(),
        pending: z.boolean(),
      }),
    }),
  }),
});

const SearchResultSchema = z.object({
  blocks: z.array(BlockSchema),
});
