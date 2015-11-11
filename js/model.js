/**
 * Models for the application.
 *
 * Matches https://timeline.knightlab.com/docs/json-format.html
 */

import {Backbone} from "js/main.js";

/**
 * Helper function to auto-handle from[key] == null.
 */
function set_if(from, to, key) {
    if (from[key]) {
        to[key] = from[key];
    }
}

export class Text {
    constructor() {
        this.headline = null;
        this.text = null;
    }

    static from_json(json) {
        if (!json) {
            return null;
        }

        let text = new Text();

        set_if(json, text, "headline");
        set_if(json, text, "text");

        return text;
    }

    to_json() {
        let json = {};

        set_if(this, json, "headline");
        set_if(this, json, "text");

        return json;
    }
}

export class Media {
    constructor(url) {
        this.url = url;
        this.caption = null;
        this.credit = null;
        this.thumbnail = null;
    }

    static from_json(json) {
        if (!json) {
            return null;
        }

        let media = new Media(json.url);

        set_if(json, media, "caption");
        set_if(json, media, "credit");
        set_if(json, media, "thumbnail");

        return media;
    }

    to_json() {
        let json = {};

        set_if(this, json, "url");
        set_if(this, json, "caption");
        set_if(this, json, "credit");
        set_if(this, json, "thumbnail");

        return json;
    }
}

export class Era {
    constructor(start_date, end_date) {
        this.start_date = start_date;
        this.end_date = end_date;
        this.text = null;
    }

    static from_json(json) {
        if (!json) {
            return null;
        }

        let era = new Era(MDate.from_json(json.start_date),
                          MDate.from_json(json.end_date));

        set_if(json, era, "text");

        return era;
    }

    to_json() {
        let json = {
            start_date: this.start_date.to_json(),
            end_date: this.end_date.to_json()
        };

        set_if(this, json, "text");

        return json;
    }
}

// TODO: not sure if day is 1-7 or 0-6
export class MDate {
    constructor(date, display_date) {
        this.date = date;
        this.display_date = display_date;
    }

    static from_json(json) {
        if (!json) {
            return null;
        }

        return new MDate(
                new Date(Date.UTC(json.year,
                                  json.month - 1,
                                  json.day,
                                  json.hour,
                                  json.minute,
                                  json.second,
                                  json.millisecond)),
                json.display_date ? json.display_date : null);
    }

    to_json() {
        let d = this.date;
        return {
            year: d.getUTCFullYear(),
            month: d.getUTCMonth() + 1,
            day: d.getUTCDay(),
            hour: d.getUTCHours(),
            minute: d.getUTCMinutes(),
            second: d.getUTCSeconds(),
            millisecond: d.getUTCMilliseconds(),
            display_date: this.display_date
        };
    }
}

export const Slide = Backbone.Model.extend({
    defaults: {
        start_date: null,
        end_date: null,
        text: null,
        media: null,
        group: null,
        display_date: null,
        background: null,
        autolink: null,
        unique_id: null
    },

    to_json: function() {
        let json = {};

        if (this.start_date) {
            json.start_date = this.start_date.to_json();
        }
        if (this.end_date) {
            json.end_date = this.end_date.to_json();
        }
        if (this.text) {
            json.text = this.text.to_json();
        }
        if (this.media) {
            json.media = this.media.to_json();
        }
        set_if(this, json, "group");
        set_if(this, json, "display_date");
        set_if(this, json, "background");
        set_if(this, json, "autolink");
        set_if(this, json, "unique_id");

        return json;
    }
}, {
    from_json: function(json) {
        if (!json) {
            return null;
        }

        let slide = new Slide();

        slide.start_date = MDate.from_json(json.start_date);
        slide.end_date = MDate.from_json(json.end_date);
        slide.text = Text.from_json(json.text);
        slide.media = Media.from_json(json.media);
        set_if(json, slide, "group");
        set_if(json, slide, "display_date");
        set_if(json, slide, "background");
        set_if(json, slide, "autolink");
        set_if(json, slide, "unique_id");

        return slide;
    }
});

export const Slides = Backbone.Collection.extend({
    model: Slide,

    to_json: function() {
        return this.map(function (slide) {
            return slide.to_json();
        });
    }
}, {
    from_json: function(json) {
        if (!json) {
            return null;
        }

        let slides = new Slides();

        slides.add(json.map(Slide.from_json));

        return slides;
    }
});

export const Timeline = Backbone.Model.extend({
    defaults: {
        events: new Slides(),
        title: null,
        eras: [],
        scale: "human"
    },

    to_json_str: function() {
        let json = {
            events: this.events.to_json()
        };
        if (this.title) {
            json.title = this.title.to_json();
        }
        if (this.eras) {
            json.eras = this.eras.map(function (item) {
                return item.to_json();
            });
        }
        set_if(this, json, "scale");

        return JSON.stringify(json);
    }
}, {
    from_json_string: function(json_str) {
        let json = JSON.parse(json_str);
        let timeline = new Timeline();

        timeline.events = Slides.from_json(json.events);
        timeline.title = Slide.from_json(json.title);
        timeline.eras = (json.eras ? json.eras : []).map(Era.from_json);
        set_if(json, timeline, "scale");

        return timeline;
    }
});
