import Backbone from "backbone";
import {Slide,Slides} from "model/slide.js";
import {Era} from "model/structs/time.js";

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
            events: json.events ? new Slides(json.events, {parse: true}) : null,
            title: json.title ? new Slide(json.title, {parse: true}) : null,
            eras: (json.eras ? json.eras : []).map(
                era => new Era(era, {parse: true})
            ),
            scale: json.scale
        };
    }
});
