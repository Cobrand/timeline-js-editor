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
