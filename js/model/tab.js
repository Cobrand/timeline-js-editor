export const Tab = Backbone.Model.extend({
    defaults: {
        slide: null,
    }
});

export const Tabs = Backbone.Collection.extend({
    model: Tab,
});
