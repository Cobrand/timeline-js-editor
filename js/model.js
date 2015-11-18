/**
 * Models for the application.
 *
 * Matches https://timeline.knightlab.com/docs/json-format.html
 */

import Backbone from "backbone";
import * as utils from "utils.js";

/**
 * Helper function to auto-handle from[key] == null.
 */
function set_if(from, to, key) {
    if (from[key] !== undefined && from[key] !== null) {
        to[key] = from[key];
    }
}

export const Text = {
    from_object(json) {
        if (!json) {
            return null;
        }

        return make_Text(json.headline, json.text);
    }
};

export function make_Text(headline=null, text=null) {
    return {
        __proto__: Text.prototype,

        headline,
        text,

        to_object() {
            const json = {};

            set_if(this, json, "headline");
            set_if(this, json, "text");

            return json;
        }
    };
}

export const Media = {
    from_object(json) {
        if (!json) {
            return null;
        }

        return make_Media(json.url, json.caption, json.credit, json.thumbnail);
    }
}

export function make_Media(url, caption=null, credit=null, thumbnail=null) {
    return {
        __proto__: Media.prototype,

        url,
        caption,
        credit,
        thumbnail,

        to_object() {
            const json = {};

            set_if(this, json, "url");
            set_if(this, json, "caption");
            set_if(this, json, "credit");
            set_if(this, json, "thumbnail");

            return json;
        }
    };
}

export const Era = {
    from_object(json) {
        if (!json) {
            return null;
        }

        return make_Era(MDate.from_object(json.start_date),
                        MDate.from_object(json.end_date),
                        json.text);
    }
};

export function make_Era(start_date, end_date, text=null) {
    return {
        __proto__: Era.prototype,

        start_date,
        end_date,
        text,

        to_object() {
            const json = {
                start_date: this.start_date.to_object(),
                end_date: this.end_date.to_object()
            };

            set_if(this, json, "text");

            return json;
        }
    };
}

export const MDate = {
    from_object(json) {
        if (!json) {
            return null;
        }

        return make_MDate(
                new Date(json.year,
                         json.month - 1 || 0,
                         json.day || 1,
                         json.hour || 0,
                         json.minute || 0,
                         json.second || 0,
                         json.millisecond || 0),
                json.display_date);
    }
}

// TODO: not sure if day is 1-7 or 0-6
export function make_MDate(date, display_date=null) {
    return {
        __proto__: MDate.prototype,

        date,
        display_date,

        toString() {
            return display_date || date.toString();
        },

        to_object() {
            const d = this.date;
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
    };
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

    to_object: function() {
        const json = {};

        if (this.start_date) {
            json.start_date = this.start_date.to_object();
        }
        if (this.end_date) {
            json.end_date = this.end_date.to_object();
        }
        if (this.text) {
            json.text = this.text.to_object();
        }
        if (this.media) {
            json.media = this.media.to_object();
        }
        set_if(this, json, "group");
        set_if(this, json, "display_date");
        set_if(this, json, "background");
        set_if(this, json, "autolink");
        json.unique_id = this.unique_id;

        return json;
    }
}, {
    from_object: function(json) {
        if (!json) {
            return null;
        }

        const slide = new Slide();

        slide.start_date = MDate.from_object(json.start_date);
        slide.end_date = MDate.from_object(json.end_date);
        slide.text = Text.from_object(json.text);
        slide.media = Media.from_object(json.media);
        set_if(json, slide, "group");
        set_if(json, slide, "display_date");
        set_if(json, slide, "background");
        set_if(json, slide, "autolink");
        slide.unique_id = json.unique_id || utils.uuid4();

        return slide;
    }
});

export const Slides = Backbone.Collection.extend({
    model: Slide,

    to_object: function() {
        return this.map(function (slide) {
            return slide.to_object();
        });
    }
}, {
    from_object: function(json) {
        if (!json) {
            return null;
        }

        const slides = new Slides();

        json.map(Slide.from_object)
            .map(slide => slides.add(slide));

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

    to_json: function() {
        const json = {
            events: this.events.to_object(),
            scale: this.scale
        };
        if (this.title) {
            json.title = this.title.to_object();
        }
        if (this.eras) {
            json.eras = this.eras.map(function (item) {
                return item.to_object();
            });
        }

        return JSON.stringify(json);
    }
}, {
    from_json: function(json_str) {
        const json = JSON.parse(json_str);
        const timeline = new Timeline();

        timeline.events = Slides.from_object(json.events);
        timeline.title = Slide.from_object(json.title);
        timeline.eras = (json.eras ? json.eras : []).map(Era.from_object);
        set_if(json, timeline, "scale");

        return timeline;
    }
});
