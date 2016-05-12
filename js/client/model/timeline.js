import Backbone from "backbone";
import swal from "sweetalert";
import {Slide,Slides} from "model/slide.js";
import {Era} from "model/structs/time.js";

export const Timeline = Backbone.Model.extend({
    defaults() {
        return {
            title: new Slide(),
            events: new Slides(),
            eras: [],
            scale: "human"
        };
    },

    toJSON() {
        return {
            events: this.attributes.events.toJSON(),
            scale: this.attributes.scale,
            title: this.attributes.title.toJSON(),
            eras: this.attributes.eras.map(function (item) {
                return item.toJSON();
            })
        };
    },

    parse(json) {
        return {
            events: json.events ? new Slides(json.events, {parse: true})
                                : undefined,
            title: json.title ? new Slide(json.title, {parse: true})
                              : undefined,
            eras: (json.eras || []).map(
                era => new Era(era, {parse: true})
            ),
            scale: json.scale
        };
    },

    resetFromJson(data) {
        let json;
        try {
            json = JSON.parse(data);
        } catch (error) {
            swal({
                title: "Erreur json",
                text: "Le json est invalide : " + error.message,
                type: "error"
            });
            return;
        }

        // TODO: error detection
        const attrs = this.parse(json);
        this.set(attrs);
    }
});

window.Timeline = Timeline;
