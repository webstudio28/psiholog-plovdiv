const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
    // Copy assets directly to output
    eleventyConfig.addPassthroughCopy("src/assets");
    // eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("favicon.png");
    eleventyConfig.addPassthroughCopy("src/robots.txt");
    eleventyConfig.addPassthroughCopy("src/sitemap.xml");
    eleventyConfig.addPassthroughCopy("CNAME");

    // Add limit filter
    eleventyConfig.addFilter("limit", function(array, limit) {
        return array.slice(0, limit);
    });

    eleventyConfig.addFilter("date", function(dateObj, format = "yyyy") {
        if (!dateObj) return "";
        const jsDate = new Date(dateObj);
        if (isNaN(jsDate)) return "";
        return DateTime.fromJSDate(jsDate).toFormat(format);
    });

    // Create blog collection from blogs.json data
    eleventyConfig.addCollection("blogPosts", function(collectionApi) {
        const blogsData = require('./src/_data/blogs.json');
        return blogsData;
    });

    // Add data transformation to create blog pages
    eleventyConfig.addGlobalData("blogPages", function() {
        const blogsData = require('./src/_data/blogs.json');
        return blogsData.map(blog => ({
            ...blog,
            layout: "blog-post.njk",
            permalink: `/${blog.id}.html`,
            content: blog.content
        }));
    });




    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            layouts: "_layouts"
        },
        templateFormats: ["html", "njk", "md"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        pathPrefix: "/psiholog-plovdiv/",
    };
}; 