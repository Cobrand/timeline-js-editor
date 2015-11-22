import Backbone from "backbone";
import {Slide,Slides} from "model/slide.js";
import {Era} from "model/structs/time.js";

export const Timeline = Backbone.Model.extend({
    defaults: {
        events: new Slides(),
        eras: [],
        scale: "human"
    },

    toJSON() {
        console.log(this);
        const json = {
            events: this.attributes.events.toJSON(),
            scale: this.attributes.scale
        };
        if (this.attributes.title) {
            json.title = this.attributes.title.toJSON();
        }
        if (this.attributes.eras) {
            json.eras = this.attributes.eras.map(function (item) {
                return item.toJSON();
            });
        }

        return json;
    },

    parse(json) {
        return {
            events: new Slides(json.events, {parse: true}) ,
            title: json.title ? new Slide(json.title, {parse: true}) : null,
            eras: (json.eras ? json.eras : []).map(
                era => new Era(era, {parse: true})
            ),
            scale: json.scale
        };
    }
});
