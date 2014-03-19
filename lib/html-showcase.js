/// <reference path="jquery.d.ts" />

var ShowCase = (function () {
    function ShowCase(element, options) {
        this.$element = element;
        this.options = options;
        this.items = new Array();
        for (var i = 0; i < options.length; i++) {
            var item = new ShowCaseItem(options[i]);
            $("<div>").append(item.element).appendTo(this.$element).addClass("slide");
            this.items.push(item);
        }
    }
    ShowCase.prototype.run = function () {
        var _this = this;
        setTimeout(function () {
            return _this.move_slide_timer();
        }, 2000);
        w3c_slidy.init();
    };

    ShowCase.prototype.most_priority = function (date) {
        var min = 999;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].in_time(date) && min > this.items[i].priority()) {
                min = this.items[i].priority();
            }
        }
        return min;
    };

    ShowCase.prototype.move_slide_timer = function () {
        var _this = this;
        var date = new Date();
        var newIndex = w3c_slidy.slide_number;
        var most_priority = this.most_priority(date);
        var found = true;
        do {
            newIndex = (newIndex + 1) % w3c_slidy.slides.length;
            found = this.items[newIndex].in_time(date) && most_priority === this.items[newIndex].priority();
        } while(!found);
        if (newIndex !== w3c_slidy.slide_number) {
            w3c_slidy.goto_slide(newIndex);
            w3c_slidy.set_location();
        }
        var one_slide_time = 5;
        if (this.items[newIndex].option.playtime) {
            one_slide_time = this.items[newIndex].option.playtime;
        }
        setTimeout(function () {
            return _this.move_slide_timer();
        }, one_slide_time * 1000);
    };
    return ShowCase;
})();

var ShowCaseItem = (function () {
    function ShowCaseItem(option) {
        this.default = {
            reloadtime: 3600,
            previewtime: "* * * * *",
            priority: 100,
            playtime: 60
        };
        this.option = $.extend(this.default, option);
        this.element = $("<object />").addClass("slide_fw").attr("type", "text/php").attr("data", this.option.url);
        this.reload_hook();
    }
    ShowCaseItem.prototype.reload_hook = function () {
        var _this = this;
        setTimeout(function () {
            _this.element.attr("data", _this.element.attr("data"));
            _this.reload_hook();
        }, this.option.reloadtime * 1000);
    };

    ShowCaseItem.prototype.priority = function () {
        return this.option.priority;
    };

    ShowCaseItem.prototype.in_time = function (date) {
        var test = [date.getMinutes(), date.getHours(), date.getDate(), date.getMonth() + 1, date.getDay()];
        var option_date = this.option.previewtime.split(" ");
        for (var index in option_date) {
            if (option_date[index]) {
                var nums = option_date[index].split(",");
                var match = false;
                for (var i in nums) {
                    if (nums[i] == "*")
                        match = true;
                    else if (nums[i].indexOf("-") > -1) {
                        var range = nums[i].split("-");
                        match |= (range[0] <= test[index] && range[1] >= test[index]);
                    } else {
                        match |= (nums[i] == test[index]);
                    }
                }
                if (!match)
                    return false;
            }
        }
        return true;
        ;
    };
    return ShowCaseItem;
})();