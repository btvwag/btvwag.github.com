(function(context) {

if (!site) throw new Error('Configuration not found');

var longneck = {};

longneck.githubWatcherProject = function(resp) {
    var watcherProject = $('.follower-project');
    var i = 0;
    var max = 4; // Make a maximum of five requests before giving up.
    var shuffled = _(resp.data).shuffle();

    var getProjects = function(u) {
        var languages = site.github_language.split(',')
        $.ajax({
            url: 'https://api.github.com/users/' + u.login + '/repos',
            dataType: 'jsonp',
            success: function(resp) {
                if (!resp.data.length) return getProjects(shuffled[++i]);
                var repo = _(resp.data)
                    .chain()
                    .shuffle()
                    .detect(function(r) {
                        return r.language === languages[Math.floor(Math.random()*languages.length + 1)];
                    })
                    .value();

                if (!repo) {
                    getProjects(shuffled[++i]);
                } else {
                    var template =
                        "<h4>A member's <%=language%> project</h4>"
                        + ""
                        + "<a target='_blank' href='http://github.com/<%=owner.login%>'><%=owner.login%></a>"
                        + " / "
                        + "<a target='_blank' href='<%=html_url%>'>"
                        + "<span class='title'><strong><%=name%></strong></span>"
                        + "</a>"
                        + "<span class='title'> <%=description%></span>"
                        + "";
                    var t = _(template).template(repo);
                    watcherProject.append(t).addClass('loaded');
                }

            }
        });
    };
    getProjects(shuffled[i]);
};

longneck.githubWatchers = function() {
    var watchers = $('.github-followers');
    $.ajax({
        // TODO: this endpoint only returns maximum 30 users. Implement random
        // pagination so we see different groups of people.
        url: 'https://api.github.com/repos/' +
            site.github_login + '/' +
            site.github_repo + '/watchers',
        dataType: 'jsonp',
        success: function(resp) {
            if (!resp.data.length) return;
            longneck.githubWatcherProject(resp);
            var template =
                "<a class='github-user' target='_blank' href='http://github.com/<%=login%>'>" +
                "<span style='background-image:url(<%=avatar_url%>)' class='thumb' /></span>" +
                "<span class='popup'>" +
                "<span class='title'><%=login%></span>" +
                "</span>" +
                "</a>";
            var t = _(resp.data)
                .map(function(i) { return _(template).template(i); })
                .join('');
            watchers.append(t);
        }
    });
};
$(longneck.githubWatchers);

longneck.twitterFollowers = function() {
    var tweets = $('.twitter-followers');

    $.ajax({
        url: 'https://api.twitter.com/1/followers/ids.json?cursor=-1&screen_name=btvwag',
        dataType: 'jsonp',
        success: function(resp) {
          renderFollowers(resp["ids"]);
        }
    });

    function renderFollowers(ids) {
      $.ajax({
        url: 'http://api.twitter.com/1/users/lookup.json?user_id=' + ids.slice(0,100).join(","),
        dataType: 'jsonp',
        success: function(resp) {
          if (!resp.length) return;
          var template =
              "<a target='_blank' href='http://twitter.com/<%=screen_name%>' class='tweet'>"
              + "<span class='thumb' style='background-image:url(<%=profile_image_url%>)'></span>"
              + "<span class='popup'>"
              + "<span class='title'>@<%=screen_name%></span>"
              + "</span>"
              + "</a>";
          var t = _(resp)
              .map(function(i) { return _(template).template(i); })
              .join('');
          tweets.append(t).addClass('loaded');
        }
      });
    }
};
$(longneck.twitterFollowers);

longneck.tweets = function() {
    var tweets = $('.tweets');

    $.ajax({
        url: 'http://search.twitter.com/search.json',
        data: { q: site.twitter_search, rpp:100 },
        dataType: 'jsonp',
        success: function(resp) {
            if (!resp.results.length) return;
            var template =
                "<a target='_blank' href='http://twitter.com/<%=from_user%>/status/<%=id_str%>' class='tweet'>"
                + "<span class='thumb' style='background-image:url(<%=profile_image_url%>)'></span>"
                + "<span class='popup'>"
                + "<span class='title'>@<%=from_user%></span>"
                + "<small><%=text%></small>"
                + "</span>"
                + "</a>";
            var t = _(resp.results.slice(0,30))
                .map(function(i) { return _(template).template(i); })
                .join('');
            tweets.append(t).addClass('loaded');
        }
    });
};
$(longneck.tweets);

context.longneck = longneck;
})(window);
