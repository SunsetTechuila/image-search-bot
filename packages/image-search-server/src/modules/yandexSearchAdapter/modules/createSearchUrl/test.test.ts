import { test, expect } from "bun:test";

import createSearchUrl from ".";

test("can create search url", () => {
  const result = createSearchUrl("random search query");
  expect(result).toEqual(
    "https://yandex.com/images/search?format=json&request=%7B%22blocks%22%3A%5B%7B%22block%22%3A%7B%22block%22%3A%22i-react-ajax-adapter%3Aajax%22%7D%2C%22params%22%3A%7B%22type%22%3A%22ImagesApp%22%2C%22ajaxKey%22%3A%22serpList%2Ffetch%22%7D%2C%22version%22%3A2%7D%5D%7D&text=random%20search%20query&p=0",
  );
});
