/**
 * Models for the application.
 *
 * Matches https://timeline.knightlab.com/docs/json-format.html
 */

class Text {
    constructor() {
        this.headline = null;
        this.text = null;
    }
}

class Media {
    constructor(url) {
        this.url = url;
        this.caption = null;
        this.credit = null;
        this.thumbnail = null;
    }
}

class Era {
    constructor(start_date, end_date) {
        this.start_date = start_date;
        this.end_date = end_date;
        this.text = null;
    }
}

// TODO: not sure if day is 1-7 or 0-6
class MDate {
    constructor(date, display_date) {
        this.date = date;
        this.display_date = display_date;
    }
}

var Slide = Backbone.Model.extend({
    defaults: {
        start_date: null,
        end_date: null,
        text: null,
        media: null,
        group: null,
        display_date: null,
        background: null,
        autolink: true,
        unique_id: null
    }
});

var Slides = Backbone.Collection.extend({
    model: Slide
});

var Timeline = Backbone.Model.extend({
    defaults: {
        events: new Slides(),
        title: null,
        eras: [],
        scale: "human"
    }
});
