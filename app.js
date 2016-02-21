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
		 'libs/text!meetups.html',
		 'datepicker',
         'bootstrap',
         'timesheet'
         ], function (Backbone,_,$,headerTpl, homeTpl, footerTpl, locationTpl, dp, bootstrap, timesheet) {
	
    var rootURL = 'http://xrav3nz.flowca.st';

	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			"location": "location",
			"meetups/:id": "meetups"
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
		},
		meetups: function(id) {
			this.meetupsView = new MeetupsView();
			this.meetupsView.render(id);
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

	MeetupsView = Backbone.View.extend({
		el: "#content",
		template: meetupsTpl,
		initialize: function() {

		},
		mid: 0,
		render: function(id) {
			var self = this;
			this.mid = id;
	        $.ajax({
	            url: "http://xrav3nz.flowca.st/meetups/" + id,
	            success:function(result){
					$(self.el).html(_.template(self.template)({"result": result}));
	            },
	            error:function(result){
	            	alert(result.responseJSON.message);
	            }
	        });
		},
		events: {
			"submit": "vote"
		},
		vote: function(event) {
			event.preventDefault();
			var timeslot_ids = [];
			var activity_ids = [];
			var self = this;
			$(this.el).find('input:checked').each(function() {
				if($(this).attr('name') == "activities") {
					activity_ids.push($(this).val());
				} else {
					timeslot_ids.push($(this).val());
				}
			});
	        $.ajax({
	            url: "http://xrav3nz.flowca.st/meetups/" + self.mid,
	            method: "PUT",
	            contentType: "application/json",
	            data: JSON.stringify({
	            	"timeslot_ids": timeslot_ids,
	            	"activity_ids": activity_ids
	            }),
	            success:function(result){
					self.render(self.mid);
	            },
	            error:function(result){
	            	alert(result.responseJSON.message);
	            }
	        });
		}
	});


	app = new ApplicationRouter();
	Backbone.history.start();
});


