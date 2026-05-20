const blogs = require("./blogs.json");

/** Posts where `publish === false` are excluded from the site build and listings. */
module.exports = blogs.filter((b) => b.publish !== false);
