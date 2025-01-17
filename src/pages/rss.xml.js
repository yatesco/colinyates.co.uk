import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection("blog");

  const feed = blog.map((post) => {
    return {
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      link: `/posts/${post.id}`,
      ...post.data,
    };
  });
  return rss({
    title: "Colin Yates | Blog",
    description: "Random thoughts from a random guy",
    site: context.site,
    items: feed,
    stylesheet: "/pretty-feed-v3.xsl",
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: [
      "<language>en-us</language>",
      `<atom:link href="${new URL("rss.xml", context.site)}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    trailingSlash: false,
    items: feed,
    customData: `<language>en-gb</language>`,
  });
}
