import * as handlers from "./handlers/routeHandlers.js";
import PATHS from "./paths.js";

(() => {

    function setup(){

        this.use('Handlebars', 'hbs');

        Handlebars.registerHelper('_id', function (obj) {

            return obj.data.key;
        });
    }


    var app = Sammy('#main', function() {

        setup.call(this);

        this.get(PATHS.INITIAL, handlers.homeViewHandler);
        this.get(PATHS.HOME, handlers.homeViewHandler);
        this.post(PATHS.HOME, () => false);
        this.get(PATHS.ABOUT, handlers.aboutViewHandler);
        this.get(PATHS.LOGIN, handlers.loginViewHandler);
        this.post(PATHS.LOGIN, () => false);
        this.get(PATHS.REGISTER, handlers.registerViewHandler);
        this.post(PATHS.REGISTER, () => false);
        this.get(PATHS.LOGOUT, handlers.logoutHandler);
        this.get(PATHS.CREATE, handlers.createViewHandler);
        this.post(PATHS.CREATE, () => false);
        this.get(PATHS.CERTAIN_IDEA_PATH, handlers.ideaDetailsViewHandler);
        this.get(PATHS.EDIT_TREK_PATH, handlers.editIdeaHandler);
        this.get(PATHS.DELETE_IDEA_PATH, handlers.deleteTrekHandler);
        this.get(PATHS.LIKE_IDEA_PATH, handlers.likeIdeaHandler);
        this.get(PATHS.PROFILE, handlers.profileViewHandler);
        this.get(PATHS.COMMENT_IDEA_PATH, handlers.commentIdeaHandler);
        this.post(PATHS.COMMENT_IDEA_PATH, () => false);
    });

    app.run(PATHS.INITIAL);

})();