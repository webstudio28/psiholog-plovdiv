/**
 * Reads local_docs/*.docx, appends draft posts to blogs.json
 * Run: node scripts/import-blog-drafts.js
 */
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

const ROOT = path.join(__dirname, "..");
const BLOGS_PATH = path.join(ROOT, "src", "_data", "blogs.json");
const DOCS_DIR = path.join(ROOT, "local_docs");

/** Already on the site (same slug / source). */
const SKIP_FILES = new Set([
  "emovionalno pregarqne.docx",
  "kak da preodoleem razdqla.docx",
]);

const DRAFT_IMAGES = [
  "blog3.jpg",
  "kabinet.jpg",
  "blog1.jpg",
  "anxiety.png",
  "rosi3.jpg",
  "personal-growth.png",
  "relationship.png",
  "facts.jpg",
];

function parseMeta(raw) {
  const pick = (label) => {
    const re = new RegExp("^" + label + ":\\s*(.+)\\s*$", "im");
    const m = raw.match(re);
    return m ? m[1].trim() : "";
  };
  const tagsStr = pick("Tags");
  const tags = tagsStr
    ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  return {
    seoTitle: pick("SEO Title"),
    metaDescription: pick("Meta Description"),
    slug: pick("URL Slug"),
    alt: pick("Alt Text for Image"),
    tags,
    excerpt: pick("Meta Description"),
  };
}

function extractMainTitle(raw) {
  const parts = raw.split(/Tags:\s*[^\r\n]+/i);
  if (parts.length < 2) return "";
  const after = parts[1].replace(/^\s+/, "");
  const blocks = after.split(/\r?\n\s*\r?\n/);
  const first = blocks.find((b) => b.trim().length > 0);
  return first ? first.replace(/\r/g, "").trim() : "";
}

function stripSeoBlock(html) {
  const labelPattern =
    "(?:Focus Keyword|SEO Title|Meta Description|URL Slug|Alt Text for Image|Tags)";
  const re = new RegExp(
    `^(?:<p><strong>${labelPattern}:<\\/strong>[\\s\\S]*?<\\/p>\\s*)+`,
    "i"
  );
  return html.replace(re, "").trimStart();
}

function stripLeadingTitleParagraph(html, titlePlain) {
  if (!titlePlain) return html;
  const m = html.match(/^<p><strong>([\s\S]*?)<\/strong><\/p>\s*/);
  if (!m) return html;
  const innerText = m[1].replace(/<[^>]*>/g, "").trim();
  const norm = (s) =>
    s
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  const a = norm(innerText);
  const b = norm(titlePlain);
  if (a === b || a.startsWith(b.slice(0, Math.min(50, b.length)))) {
    return html.slice(m[0].length);
  }
  return html;
}

function estimateReadMinutes(html) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(4, Math.round(words / 190));
}

function categoryForSlug(slug) {
  if (slug.includes("deteto")) return "Детско развитие";
  if (slug.includes("samoocenk")) return "Личностно развитие";
  if (slug.includes("toksichna")) return "Взаимоотношения";
  return "Емоционално здраве";
}

async function docToPost(filename, imageFile, dateStr) {
  const fp = path.join(DOCS_DIR, filename);
  const rawResult = await mammoth.extractRawText({ path: fp });
  const raw = rawResult.value || "";
  const htmlResult = await mammoth.convertToHtml({ path: fp });
  let html = htmlResult.value || "";

  const meta = parseMeta(raw);
  const mainTitle = extractMainTitle(raw);

  let content = stripSeoBlock(html);
  content = stripLeadingTitleParagraph(content, mainTitle);

  const id = meta.slug;
  if (!id) throw new Error("Missing URL Slug in " + filename);

  const title = mainTitle.replace(/\s+/g, " ").trim();
  const seoTitle = meta.seoTitle || title;

  const post = {
    id,
    title,
    seoTitle,
    excerpt: meta.excerpt || meta.metaDescription,
    metaDescription: meta.metaDescription || meta.excerpt,
    content,
    image: imageFile,
    alt: meta.alt || title,
    date: dateStr,
    author: "Роси Йовчева",
    category: categoryForSlug(id),
    readTime: `${estimateReadMinutes(content)} мин`,
    publish: false,
  };
  if (meta.tags.length) post.tags = meta.tags;
  return post;
}

(async () => {
  const blogs = JSON.parse(fs.readFileSync(BLOGS_PATH, "utf8"));
  const existingIds = new Set(blogs.map((b) => b.id));

  const docFiles = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".docx"))
    .sort();

  let imgIndex = 0;
  let added = 0;

  for (const file of docFiles) {
    if (SKIP_FILES.has(file)) continue;

    const metaRaw = await mammoth.extractRawText({
      path: path.join(DOCS_DIR, file),
    });
    const slugMatch = metaRaw.value.match(/URL Slug:\s*(\S+)/i);
    const id = slugMatch ? slugMatch[1].trim() : null;
    if (!id) {
      console.warn("Skip (no slug):", file);
      continue;
    }
    if (existingIds.has(id)) {
      console.warn("Skip (id exists):", id, file);
      continue;
    }

    const image = DRAFT_IMAGES[imgIndex % DRAFT_IMAGES.length];
    imgIndex += 1;

    const post = await docToPost(file, image, "2026-05-20");
    blogs.push(post);
    existingIds.add(post.id);
    added += 1;
    console.log("Added draft:", post.id);
  }

  fs.writeFileSync(BLOGS_PATH, JSON.stringify(blogs, null, 2), "utf8");
  console.log("Done. Added", added, "posts. Total:", blogs.length);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
