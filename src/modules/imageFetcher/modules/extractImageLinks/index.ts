import { z } from "zod";

export type SearchResult = z.infer<typeof SearchResultSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type Entity = z.infer<typeof EntitySchema>;

export default function extractImageLinks(searchResult: unknown): string[] {
  const { blocks } = SearchResultSchema.parse(searchResult);
  return blocks.flatMap((block) => {
    const { entities } = block.params.adapterData.serpList.items;
    return Object.values(entities).map((entity) => entity.origUrl);
  });
}

const EntitySchema = z.object({
  alt: z.string(),
  origWidth: z.number(),
  origHeight: z.number(),
  origUrl: z.string(),
});

const BlockSchema = z.object({
  params: z.object({
    ok: z.boolean(),
    adapterData: z.object({
      serpList: z.object({
        items: z.object({
          entities: z.record(EntitySchema),
        }),
      }),
    }),
  }),
});

const SearchResultSchema = z.object({
  blocks: z.array(BlockSchema),
});
