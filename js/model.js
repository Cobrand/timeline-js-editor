/**
 * Models for the application.
 *
 * Matches https://timeline.knightlab.com/docs/json-format.html
 */

import Backbone from "backbone";
import "utils.js";


export function Text(headline = "Sample headline",text = "Sample text") {

    function toObject() {
        return {
            headline:headline,
            text:text
        }
    }
    return {
        toObject:toObject
    }
}

export function Media(url,caption=null,credit=null,thumbnail=null) {

    function toObject() {
        return {
            url:url,
            caption:caption,
            credit:credit,
            thumbnail:thumbnail
        }
    }
    return { // public object
        toObject:toObject
    }
}

export function Era(start_date,end_date,text=null) {
    function toObject() {
        return {
            start_date:start_date,
            end_date:end_date,
            text:text
        }
    }
    return {
        toObject:toObject
    }
}

// TODO: not sure if day is 1-7 or 0-6
export function MDate(date,display_date=null) {
    if (!(date instanceof Date)){
        if (typeof date === "object" ){
            date = Date.UTC(json.year,
                            json.month - 1,
                            json.day,
                            json.hour,
                            json.minute,
                            json.second,
                            json.millisecond)
            // in case we don't have a Date object,
            // convert it from a json object
        }else if(!date instanceof Date){
            throw new TypeError("expected Date, got "+typeof date);
        }
    }

    function toObject() {
        return {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDay(),
            hour: date.getUTCHours(),
            minute: date.getUTCMinutes(),
            second: date.getUTCSeconds(),
            millisecond: date.getUTCMilliseconds(),
            display_date: display_date
        };
    }

    return {
        toObject : toObject
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

    toObject: function() {
        const json = {};

        if (this.start_date) {
            json.start_date = this.start_date.toObject();
        }
        if (this.end_date) {
            json.end_date = this.end_date.toObject();
        }
        if (this.text) {
            json.text = this.text.toObject();
        }
        if (this.media) {
            json.media = this.media.toObject();
        }
        set_if(this, json, "group");
        set_if(this, json, "display_date");
        set_if(this, json, "background");
        set_if(this, json, "autolink");
        set_if(this, json, "unique_id");

        return json;
    }
}, {
    from_object: function(json) {
        if (!json) {
            return null;
        }

        let slide = new Slide();

        slide.start_date = MDate(json.start_date);
        slide.end_date = MDate(json.end_date);
        slide.text = new Text(json.text);
        slide.media = new Media(json.media);
        override_object(shallow_copy(json,
                                     ["group",
                                      "display_date",
                                      "background",
                                      "autolink",
                                      "unique_id"]),
                        slide);

        return slide;
    }
});

export const Slides = Backbone.Collection.extend({
    model: Slide,

    toObject: function() {
        return this.map(function (slide) {
            return slide.toObject();
        });
    }
}, {
    from_object: function(json) {
        if (!json) {
            return null;
        }

        const slides = new Slides();

        slides.add(json.map(Slide.from_object));

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

    toObject_str: function() {
        const json = {
            events: this.events.toObject()
        };
        if (this.title) {
            json.title = this.title.toObject();
        }
        if (this.eras) {
            json.eras = this.eras.map(function (item) {
                return item.toObject();
            });
        }
        set_if(this, json, "scale");

        return JSON.stringify(json);
    }
}, {
    from_object_string: function(json_str) {
        const json = JSON.parse(json_str);
        const timeline = new Timeline();

        timeline.events = Slides.from_object(json.events);
        timeline.title = Slide.from_object(json.title);
        timeline.eras = (json.eras ? json.eras : []).map(Era.from_object);
        set_if(json, timeline, "scale");

        return timeline;
    }
});
