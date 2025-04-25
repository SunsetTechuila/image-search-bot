import { z } from "zod";

import type { SearchResult } from "../../../../../interfaces";

export function transformSearchResult(searchResult: string): SearchResult[] {
  const { blocks } = SearchResultSchema.parse(JSON.parse(searchResult));

  return blocks.flatMap((block) => {
    const { entities } = block.params.adapterData.serpList.items;
    return Object.values(entities);
  });
}

const ImageSchema = z
  .object({
    url: z.string(),
    fileSizeInBytes: z.number(),
    w: z.number(),
    h: z.number(),
  })
  .transform((item) => ({
    url: item.url,
    sizeInBytes: item.fileSizeInBytes,
    width: item.w,
    height: item.h,
  }));

const ViewerDataSchema = z.object({
  preview: z.array(ImageSchema),
  dups: z.array(ImageSchema),
});

const EntitySchema = z
  .object({
    alt: z.string(),
    origWidth: z.number(),
    origHeight: z.number(),
    origUrl: z.string(),
    viewerData: ViewerDataSchema,
  })
  .transform((entity) => ({
    caption: entity.alt,
    url: entity.origUrl,
    width: entity.origWidth,
    height: entity.origHeight,
    sizeInBytes: entity.viewerData.preview.find((item) => item.url === entity.origUrl)?.sizeInBytes,
    duplicates: entity.viewerData.dups,
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
