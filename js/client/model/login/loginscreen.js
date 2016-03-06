import Backbone from "backbone";
export const Login = Backbone.Model.extend({
    defaults() {
        return {
            login: "",
            password: "",
            hashed_password: "",
            keep_me_connected: true
        };
    }
});
