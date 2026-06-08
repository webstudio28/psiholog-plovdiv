const blogs = require("./blogs.json");

/** Posts where `publish === false` are excluded; sorted newest first by date. */
module.exports = blogs
  .filter((b) => b.publish !== false)
  .sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    // Same date: later entries in blogs.json win (most recently published)
    return blogs.indexOf(b) - blogs.indexOf(a);
  });
