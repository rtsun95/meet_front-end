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
		}
	});
	
	
	app = new ApplicationRouter();
	Backbone.history.start();	
});


