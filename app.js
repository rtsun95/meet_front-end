require.config({
	paths:{
	    bootstrap: '../js/libs/bootstrap.min',
	    datepicker:'../js/libs/bootstrap-datepicker',
	    jquery: '../js/libs/jquery-1.12.0.min',
    	underscore: '../js/libs/underscore-min',
    	Backbone: '../js/libs/backbone-min',
    	timesheet: '../js/libs/TimeSheet'
	    },

	    shim: {
	    	underscore:{
            	exports:"_"
       	 	},

       		Backbone:{
            	deps: ['underscore','jquery'],
            	exports: "Backbone"
       	 	},

	        bootstrap: {
	        	deps:['jquery'],
	        	exports:"bootstrap"

	        },

	        "datepicker" : {
	   			deps: ["bootstrap"],
	    		exports: "$.fn.datepicker"
			},

			timesheet : {
				deps: ["jquery"],
				exports: "$.fn.TimeSheet"
			}

	    }

});

require(['Backbone',
         'underscore',
         'jquery',
		 'libs/text!header.html', 
		 'libs/text!home.html', 
		 'libs/text!footer.html',
		 'libs/text!location.html',   
		 'datepicker',
         'bootstrap',
         'timesheet'
         ], function (Backbone,_,$,headerTpl, homeTpl, footerTpl, locationTpl, dp, bootstrap, timesheet) {
	
    var rootURL = 'http://xrav3nz.flowca.st';

	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			"location": "location"
		},
		initialize: function() {
			this.headerView = new HeaderView();
			this.headerView.render();
			this.footerView = new FooterView();
			this.footerView.render();
		},
		home: function() {
			this.homeView = new HomeView();
			this.homeView.render();
		},
		location: function() {
			this.locationView = new LocationView();
			this.locationView.render();
		}
	});

	HeaderView = Backbone.View.extend({
		el: "#header",
		templateFileName: "header.html",
		template: headerTpl,

		initialize: function() {
			$.get(this.templateFileName, function(data){
				this.template=data
			});		
		},
		render: function() {
			$(this.el).html(_.template(this.template));
		}
	});

	FooterView = Backbone.View.extend({
		el: "#footer",
		template: footerTpl,
		render: function() {
			this.$el.html(_.template(this.template));
		}
	});

	HomeView = Backbone.View.extend({
		el: "#content",
		template: "home.html",
		template: homeTpl,
		initialize: function() {

		},
		render: function() {
			$(this.el).html(_.template(this.template));
			$("#calender-container .calender").datepicker({
   				multidate: true
			});
		}
	});

	LocationView = Backbone.View.extend({
		el: "#content",
		template: locationTpl,
		initialize: function() {

		},
		render: function() {
			$(this.el).html(_.template(this.template));
		},
		events: {
			"click #submitLocation": "getRestaurants",
			"click .restaurantLabel": "toggleSelection",
			"click #submitResto": "submitResto"
		},
		getRestaurants: function() {
			if (lat === undefined || lng === undefined) {
				console.log("need lat, lng");
				return;
			}
			var url = rootURL + '/restaurants/' + lat + ',' + lng + '?count=10';
			console.log(url);
			jQuery.get(url, function (data) {
				$('#getInfo').hide();
				$('#showInfo').show();
				data.results.forEach(function (restaurant) {
					var name = restaurant.name;
					var url = restaurant.web_url;

					var label = "<label class='btn btn-primary restaurantLabel' data-name='" + name + "''>";
					label += name;
					label += "<br />";
					label += "<a href='" + url + "' target='_blank'>";
					label += 'See on TripAdvisor';
					label += "</a>";
					label += "</label>";

					$('#rList').append(label);
				});
			});
		},
		toggleSelection: function (e) {
		    if ($(e.currentTarget).hasClass('active')) {
		        $(e.currentTarget).removeClass('active');
		    } else {
		        $(e.currentTarget).addClass('active');
		    }
		},
		submitResto: function () {
			var restaurants = [];
			var url = rootURL + '/meetups';
			$('label.restaurantLabel.active').each(function (index) {
				var t = $(this);
				var name = t.data('name');
				var web_url = t.find('a').attr('href');
				restaurants.push({"web_url": web_url, "name": name});
			});

			// var postObj = {
			// 	"name":,
			// 	"organizer":,
			// 	"timeslots":,
   //  			"activities":,
   //  			"restaurants": restaurants
			// }

			// jQuery.post(url, postObj, function (data) {
			// 	id = data.id;
			// 	password = data.password;
			// });
		}
	});
	
	
	app = new ApplicationRouter();
	Backbone.history.start();	
});


