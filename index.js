/// <reference path="lib/jquery.d.ts" />
/// <reference path="lib/html-showcase.ts" />
$(document).ready(function () {
    var options = new Array();
    options.push({ url: "https://dl.dropboxusercontent.com/u/76767589/favorite_books/index.html", reloadtime: 60, playtime: 10, previewtime: "* * * * *", force: false });
    options.push({ url: "http://thenextbook.jp/award", reloadtime: 60, playtime: 10, previewtime: "* * * * *", force: false });
    var test = new ShowCase($("#showcase"), options);
    test.run();
});
