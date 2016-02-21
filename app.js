require.config({
	paths:{
	    bootstrap: '../js/libs/bootstrap.min',
	    datepicker:'../js/libs/bootstrap-datepicker',
	    jquery: '../js/libs/jquery-1.12.0.min',
    	underscore: '../js/libs/underscore-min',
    	Backbone: '../js/libs/backbone-min',
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
			}

	    }

});

require(['Backbone',
         'underscore',
         'jquery',
		 'libs/text!header.html', 
		 'libs/text!home.html', 
		 'libs/text!footer.html',  
		 'datepicker',
         'bootstrap'
         ], function (Backbone,_,$,headerTpl, homeTpl, footerTpl, dp, bootstrap) {
	
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			"*actions": "home"
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
		}
	});

	HeaderView = Backbone.View.extend({
		el: "#header",
		templateFileName: "header.html",
		template: headerTpl,

		initialize: function() {
			$.get(this.templateFileName, function(data){console.log(data);this.template=data});		
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
	})
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
	
	app = new ApplicationRouter();
	Backbone.history.start();	
});


