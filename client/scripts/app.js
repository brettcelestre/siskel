var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    // your code here
    // Check to see if this.get('like') is currently true
    if ( this.get('like') === true ){
    // if so, set 'like' to false
      this.set('like', false);
    } else {
      // otherwise, set to true
      this.set('like', true);
    }
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // your code here
    //make listener for change to each movie
    this.on('change', function () {
      //pass the function to be called when a model changes
      this.sort();
    });
    // Trying to create a listener for sorting radio buttons
    $('input [name=sort_by]');  // .val() - stores the type of button. Then pass to sortByField
  },

  comparator: 'title',

  sortByField: function(field) {
    // your code here
    // Sets comparator value to whatever value is passed from initia
    this.comparator = field;
    //this sorts by new comparator
    this.sort();
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // your code here
    // Use on this.model to listen the attached model and bind render to this view
    this.model.on('change', this.render, this); 
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    // your code here
    // Apply .toggleLike to this.model during a click button event
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // your code here
    // Listen to this.collection and on a 'sort' we invoke this.render, and pass the views scope, 'this', to the callback
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
