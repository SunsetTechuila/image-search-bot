const baseUrl = "https://yandex.com/images/search";

export default function createSearchUrl(searchQuery: string, page = 0): string {
  const queryParameters = {
    format: "json",
    request: requestBlock,
    text: searchQuery.replaceAll(" ", "+"),
    p: page,
  };

  const encodedQuery = Object.keys(queryParameters)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key as keyof typeof queryParameters])}`,
    )
    .join("&");

  return `${baseUrl}?${encodedQuery}`;
}

const requestBlock = JSON.stringify({
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
