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
		 'libs/text!meetups.html',
		 'datepicker',
         'bootstrap',
         'timesheet'
         ], function (Backbone,_,$,headerTpl, homeTpl, footerTpl, meetupsTpl, dp, bootstrap, timesheet) {
	
    var rootURL = 'http://xrav3nz.flowca.st/';

	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "home",
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
		},
		events: {
			"click #submitLocation": "getRestaurants",
			"click .restaurantLabel": "toggleSelection",
			"click .attractionLabel": "toggleSelection",
			"click #submitData": "submitData"
		},
		getRestaurants: function() {
			if (lat === undefined || lng === undefined) {
				console.log("need lat, lng");
				return;
			}
			var url = rootURL + 'restaurants/' + lat + ',' + lng + '?count=15';
			console.log(url);
			jQuery.get(url, function (data) {
				$('#getInfo').hide();
				$('#showInfo').show();
				data.results.forEach(function (restaurant) {
					var name = restaurant.name;
					var url = restaurant.web_url;

					var label = "<li>"
					label += "<label class='btn btn-info restaurantLabel' data-name='" + name + "''>";
					label += name;
					label += "</label>";
					label += "<a href='" + url + "' target='_blank'>";
					label += 'See on TripAdvisor';
					label += "</a>";
					label += "</li>"

					$('#lList').append(label);
				});
			});

			var url = rootURL + 'attractions/' + lat + ',' + lng + '?count=15';
			console.log(url);
			jQuery.get(url, function (data) {
				$('#getInfo').hide();
				$('#showInfo').show();
				data.results.forEach(function (attraction) {
					var name = attraction.name;
					var url = attraction.web_url;

					var label = "<li>"
					label += "<label class='btn btn-success attractionLabel' data-name='" + name + "''>";
					label += name;
					label += "</label>";
					label += "<a href='" + url + "' target='_blank'>";
					label += 'See on TripAdvisor';
					label += "</a>";
					label += "</li>"

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
		submitData: function () {
			var restaurants = [];
			var attractions = [];
			var url = rootURL + 'meetups';
			$('label.restaurantLabel.active').each(function (index) {
				var t = $(this);
				var name = t.data('name');
				var web_url = t.parent().find('a').attr('href');
				restaurants.push({"web_url": web_url, "name": name});
			});

			$('label.attractionLabel.active').each(function (index) {
				var t = $(this);
				var name = t.data('name');
				var web_url = t.parent().find('a').attr('href');
				attractions.push({"web_url": web_url, "name": name});
			});

			if (restaurants.length === 0 && attractions.length === 0) {
				alert('Please choose at least one restaurant or activity');
				return;
			}

			var postObj = {
				"name": meetup.name,
				"organizer": meetup.organizer,
				"timeslots": meetup.timeslots,
    			"activities": attractions,
    			"restaurants": restaurants
			}

			$.ajax({
	            url: url,
	            method: "POST",
	            contentType: "application/json",
	            data: JSON.stringify(postObj),
	            success:function(data){
					var id = data.id;
					var password = data.password;
					console.log(id, password)
					var route = '#/meetups/' + id;
					window.location.assign(route);
	            },
	            error:function(result){
	            	alert(result.responseJSON.message);
	            }
	        });
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


