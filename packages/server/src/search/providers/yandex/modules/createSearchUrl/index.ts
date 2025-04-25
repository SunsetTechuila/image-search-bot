const BASE_URL = "https://yandex.com/images/search";

export function createSearchUrl(searchQuery: string, page = 0): string {
  const queryParameters = {
    format: "json",
    request: REQUEST_BLOCK,
    text: searchQuery,
    p: page,
  };

  const encodedQuery = Object.keys(queryParameters)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key as keyof typeof queryParameters])}`,
    )
    .join("&");

  return `${BASE_URL}?${encodedQuery}`;
}

const REQUEST_BLOCK = JSON.stringify({
  blocks: [
    {
      block: {
        block: "i-react-ajax-adapter:ajax",
      },
      params: {
        type: "ImagesApp",
        ajaxKey: "serpList/fetch",
      },
      version: 2,
    },
  ],
});
