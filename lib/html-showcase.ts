/// <reference path="jquery.d.ts" />

declare var w3c_slidy: any;

interface ShowCaseOption {
	reloadtime: number;
	url: string;
	previewtime: string;
	playtime: number;
	force: boolean;
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
	        $("<div>").append(item.element).appendTo(this.$element)
	        .addClass("slide");
            this.items.push(item);
        }
	}

	run() {
        setTimeout(() => this.move_slide_timer(), 2000);
        w3c_slidy.init();
	}

   exists_force_time(date: Date) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].in_time(date) &&
                this.items[i].is_force())
                return true;
        }
        return false;
    }

    move_slide_timer() {
        var date = new Date();
        var newIndex = w3c_slidy.slide_number;
        var exists = this.exists_force_time(date);
        var found = true;
        if (exists) {
            do {
                newIndex = (newIndex + 1) % w3c_slidy.slides.length;
                found = this.items[newIndex].in_time(date) &&
                        this.items[newIndex].is_force();
            } while (!found);
        } else {
            do {
                newIndex = (newIndex + 1) % w3c_slidy.slides.length;
                found = this.items[newIndex].in_time(date) ||
                        !this.items[newIndex].has_time();
            } while (!found);
        }
        if (newIndex !== w3c_slidy.slide_number) {
            w3c_slidy.goto_slide(newIndex);
            w3c_slidy.set_location();
        }
        var one_slide_time = 5;
        if (this.items[newIndex].option.playtime) {
            one_slide_time = this.items[newIndex].option.playtime;
        }
		setTimeout(() => this.move_slide_timer(), one_slide_time * 1000);
    }

}

class ShowCaseItem {
	option: ShowCaseOption;
	default: any = {
        reloadtime: 3600,
        previewtime: undefined,
        force: false,
        playtime: 60
    };
    element: JQuery;

	constructor(option: ShowCaseOption) {
		this.option = $.extend(this.default, option);
		this.element = $("<object />")
                .addClass("slide_fw")
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

    has_time() {
        return this.option.previewtime !== undefined;
    }

    is_force() {
        return this.option.force;
    }

    in_time(date: Date) {
        if (this.has_time()) {
            var test = <any>[date.getMinutes(), date.getHours(), date.getDate(), date.getMonth() + 1, date.getDay()];
            var option_date = this.option.previewtime.split(" ");
            for (var index in option_date) {
                if (option_date[index]) {
                    var nums = option_date[index].split(",");
                    var match = <any>false;
                    for (var i in nums) {
                        if (nums[i] == "*")
                            match = true;
                        else if (nums[i].indexOf("-") > -1) {
                            var range = nums[i].split("-");
                            match |= <any>(range[0] <= test[index] && range[1] >= test[index]);
                        } else {
                            match |= <any>(nums[i] == test[index]);
                        }
                    }
                    if (!match)
                        return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
}