/// <reference path="jquery.d.ts" />

declare var w3c_slidy: any;

interface ShowCaseOption {
	reloadtime: number;
	url: string;
	previewtime: string;
	playtime: number;
	priority: number;
}

class ShowCase {
	$element: JQuery;
	options: ShowCaseOption[];
	items: ShowCaseItem[];

	constructor(element: JQuery, options: ShowCaseOption[]) {
		this.$element = element;
		this.options = options;
		this.items = new Array<ShowCaseItem>();
		for (var i: number = 0; i < options.length; i++) {
			var item = new ShowCaseItem(options[i]);
	        $("<div>").append(item.element)
               .appendTo(this.$element)
	           .addClass("slide");
            this.items.push(item);
        }
        w3c_slidy.init();
	}

	run() {
        setTimeout(() => this.move_slide_timer(), 2000);
	}

   most_priority(date: Date) {
        var min = 999;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].in_time(date) &&
                min > this.items[i].priority()) {
                min = this.items[i].priority();
            }
        }
        return min;
    }

    move_slide_timer() {
        var date = new Date();
        var newIndex = this.next_slide(date);
        var one_slide_time = 5;
        if (this.items[newIndex].option.playtime) {
            one_slide_time = this.items[newIndex].option.playtime;
        }
		setTimeout(() => this.move_slide_timer(), one_slide_time * 1000);
    }

    next_slide(date: Date) {
        var newIndex = w3c_slidy.slide_number;
        var most_priority = this.most_priority(date);
        var found = true;
        do {
            newIndex = (newIndex + 1) % this.items.length;
            found = this.items[newIndex].in_time(date) &&
                    most_priority === this.items[newIndex].priority();
        } while (!found);
        if (newIndex !== w3c_slidy.slide_number) {
            w3c_slidy.goto_slide(newIndex);
            w3c_slidy.set_location();
        }
        return newIndex;
    }
}

class ShowCaseItem {
	option: ShowCaseOption;
	default: any = {
        reloadtime: 3600,
        previewtime: "* * * * *",
        priority: 100,
        playtime: 60
    };
    element: JQuery;

	constructor(option: ShowCaseOption) {
		this.option = $.extend(this.default, option);
		this.element = $("<object />")
                .addClass("showcaseitem")
                .attr("type", "text/php")
                .attr("data", this.option.url);
        this.reload_hook();
	}

	reload_hook() {
        setTimeout(() => {
            this.element.attr("data", this.element.attr("data"));
            this.reload_hook();
        }, this.option.reloadtime * 1000);
    }

    priority() {
        return this.option.priority;
    }

    in_time(date: Date) {
        var testparams = <any>[date.getMinutes(), date.getHours(), date.getDate(), date.getMonth() + 1, date.getDay()];
        var option_date = this.option.previewtime.split(" ");
        for (var index in option_date) {
            if (!this.in_one_time_param(testparams[index], option_date[index])) {
                return false;
            }
        }
        return true;;
    }

    in_one_time_param(testparam: number, param: string) {
        if (param == "*")
            return true;
        var nums = param.split(",");
        for (var i in nums) {
            if (nums[i].indexOf("-") > -1) {
                var range = <string[]>nums[i].split("-");
                if ((+range[0] <= testparam) && (+range[1] >= testparam))
                    return true;
            } else if (+nums[i] === testparam){
                return true;
            }
        }
        return false;
    }
}