export default function getSearchUrl(searchQuery: string, offset = 0): string {
  const baseUrl = "https://yandex.com/images/search";
  const queryParameters = {
    format: "json",
    request: JSON.stringify({
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
    }),
    text: searchQuery.replaceAll(" ", "+"),
    p: offset,
  };
  const encodedQuery = Object.keys(queryParameters)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key as keyof typeof queryParameters])}`,
    )
    .join("&");

  return `${baseUrl}?${encodedQuery}`;
}
