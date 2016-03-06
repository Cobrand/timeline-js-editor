import Backbone from "backbone";
export const SignUp = Backbone.Model.extend({
    defaults() {
        return {
            login: "",
            password: "",
            confirm_password: "",
            email: ""
        };
    }
});
