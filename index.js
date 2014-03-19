/// <reference path="lib/jquery.d.ts" />
/// <reference path="lib/html-showcase.ts" />
$(document).ready(function () {
    var options = new Array();
    options.push({ url: "sample/sample1.html", reloadtime: 60, playtime: 2, previewtime: "* * * * *", priority: 100 });
    options.push({ url: "sample/sample2.html", reloadtime: 60, playtime: 2, previewtime: "* * * * *", priority: 100 });
    options.push({ url: "sample/sample3.html", reloadtime: 60, playtime: 2, previewtime: "* 21 * * *", priority: 100 });
    options.push({ url: "sample/sample4.html", reloadtime: 60, playtime: 2, previewtime: "* 22 * * *", priority: 10 });
    options.push({ url: "sample/sample5.html", reloadtime: 60, playtime: 2, previewtime: "* 10 * * *", priority: 10 });
    var test = new ShowCase($("#showcase"), options);
    test.run();
});