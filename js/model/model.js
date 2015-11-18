/**
 * Models for the application.
 *
 * Matches https://timeline.knightlab.com/docs/json-format.html
 */

import Backbone from "backbone";
import moment from "moment";
moment.locale('fr');

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

        toJSON() {
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

        toJSON() {
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

        toJSON() {
            const json = {
                start_date: this.start_date.toJSON(),
                end_date: this.end_date.toJSON()
            };

            set_if(this, json, "text");

            return json;
        }
    };
}

const units = [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
];

export const MDate = {
    from_object(json_false_month) {
        if (!json_false_month) {
            return null;
        }

        let json = Object.assign({}, json_false_month);
        json["month"] -= 1;

        let precision = "millisecond";
        for (let unit of units) {
            if (json[unit] === undefined) {
                break;
            }
            precision = unit;
        }

        return make_MDate(moment(json),
                          precision,
                          json.display_date);
    }
}

const date_formats = {
    "year": "YYYY",
    "month": "YYYY MMMM",
    "day": "LL",
    "hour": "LLL",
    "minute": "LLL",
    "second": "LL LTS",
    "millisecond": "LL HH:mm:ss.SSS"
};

export function make_MDate(date, precision, display_date=null) {
    return {
        __proto__: MDate.prototype,

        date,
        precision,
        display_date,

        toString() {
            return display_date || date.format(date_formats[precision]);
        },

        toJSON() {
            let obj = {"display_date": display_date};

            for (let unit in units) {
                obj[unit] = date.get(unit);
                if (json[unit] === precision) {
                    break;
                }
            }
            obj["month"] += 1;

            return obj;
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

    toJSON() {
        const json = {};

        if (this.start_date) {
            json.start_date = this.start_date.toJSON();
        }
        if (this.end_date) {
            json.end_date = this.end_date.toJSON();
        }
        if (this.text) {
            json.text = this.text.toJSON();
        }
        if (this.media) {
            json.media = this.media.toJSON();
        }
        set_if(this, json, "group");
        set_if(this, json, "display_date");
        set_if(this, json, "background");
        set_if(this, json, "autolink");
        json.unique_id = this.unique_id;

        return json;
    },

    parse(json) {
        if (!json) {
            return null;
        }

        return {
            start_date: MDate.from_object(json.start_date),
            end_date: MDate.from_object(json.end_date),
            text: Text.from_object(json.text),
            media: Media.from_object(json.media),
            group: json.group,
            display_date: json.display_date,
            background: json.background,
            autolink: json.autolink,
            unique_id: json.unique_id || utils.uuid4(),
        };
    }
});

export const Slides = Backbone.Collection.extend({
    model: Slide,
});

export const Timeline = Backbone.Model.extend({
    defaults() {
        return {
            events: new Slides(),
            eras: [],
            scale: "human"
        };
    },

    toJSON() {
        const json = {
            events: this.events.toJSON(),
            scale: this.scale
        };
        if (this.title) {
            json.title = this.title.toJSON();
        }
        if (this.eras) {
            json.eras = this.eras.map(function (item) {
                return item.toJSON();
            });
        }

        return json;
    },

    parse(json) {
        return {
            events: new Slides(json.events, {parse: true}),
            title: new Slide(json.title, {parse: true}),
            eras: (json.eras ? json.eras : []).map(
                era => new Era(era, {parse: true})
            ),
            scale: json.scale
        };
    }
});
