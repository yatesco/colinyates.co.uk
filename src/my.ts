import MarkdownIt from "markdown-it";
const DATE_REG_EXP = /\d{4}\ \d{2}\ \d{2}\ /i;
export const stripDateFromTitle = (title: string): string => {
  return title.replace(DATE_REG_EXP, "");
};

// inspired by https://www.paulie.dev/posts/2023/09/how-to-create-excerpts-with-astro/
const parser = new MarkdownIt();
export const extractPreview = (body: string, n: number): string => {
  const result = parser
    .render(body.substring(0, n))
    .split("\n")
    .slice(0, 6)
    .map((str) => {
      return str.replace(/<\/?[^>]+(>|$)/g, "").split("\n");
    })
    .flat()
    .join(" ");
  if (n < body.length) {
    return `${result}...`;
  } else {
    return result;
  }
};
