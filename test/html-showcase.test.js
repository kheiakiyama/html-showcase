module("ShowCase");
test( "next_slide always", function() {
	var target = new ShowCase($("<div >"),
		[
			{ previewtime: "* * * * *" },
			{ previewtime: "* * * * *" }
		]
	);
	equal(0, w3c_slidy.slide_number);
	target.next_slide(new Date());
	equal(1, w3c_slidy.slide_number);
	target.next_slide(new Date());
	equal(0, w3c_slidy.slide_number);
});
test( "next_slide skip exclude", function() {
	var target = new ShowCase($("<div >"),
		[
			{ previewtime: "* * * * *" },
			{ previewtime: "* 12 * * *" },
			{ previewtime: "* 8 * * *" }
		]
	);
	equal(0, w3c_slidy.slide_number);
	target.next_slide(new Date(2014, 3, 20, 8, 0));
	equal(2, w3c_slidy.slide_number);
	target.next_slide(new Date(2014, 3, 20, 8, 0));
	equal(0, w3c_slidy.slide_number);
});
test( "next_slide priority", function() {
	var target = new ShowCase($("<div >"),
		[
			{ priority: 100, previewtime: "* * * * *" },
			{ priority: 1, previewtime: "* * * * *" },
			{ priority: 100, previewtime: "* * * * *" },
			{ priority: 1, previewtime: "* * * * *" }
		]
	);
	equal(0, w3c_slidy.slide_number);
	target.next_slide(new Date());
	equal(1, w3c_slidy.slide_number);
	target.next_slide(new Date());
	equal(3, w3c_slidy.slide_number);
	target.next_slide(new Date());
	equal(1, w3c_slidy.slide_number);
});

module("ShowCaseItem");
test( "in_time always", function() {
	var target = new ShowCaseItem({ previewtime: "* * * * *" });
	equal(true, target.in_time(new Date(2014, 3, 20, 0, 0, 0)));
	equal(true, target.in_time(new Date(2014, 3, 20, 23, 59, 59)));
});
test( "in_time month single", function() {
	var target = new ShowCaseItem({ previewtime: "* * * 5 *" });
	equal(true, target.in_time(new Date(2014, 4, 20)));
	equal(false, target.in_time(new Date(2014, 5, 20)));
});
test( "in_time month range", function() {
	var target = new ShowCaseItem({ previewtime: "* * * 6-9 *" });
	equal(false, target.in_time(new Date(2014, 4, 20)));
	equal(true, target.in_time(new Date(2014, 5, 20)));
	equal(true, target.in_time(new Date(2014, 8, 20)));
	equal(false, target.in_time(new Date(2014, 9, 20)));
});
test( "in_time month multi", function() {
	var target = new ShowCaseItem({ previewtime: "* * * 2,4 *" });
	equal(true, target.in_time(new Date(2014, 1, 20)));
	equal(false, target.in_time(new Date(2014, 2, 20)));
	equal(true, target.in_time(new Date(2014, 3, 20)));
	equal(false, target.in_time(new Date(2014, 4, 20)));
});