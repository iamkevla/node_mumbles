
	$("#loginUser").live('pageshow', function (event) {
		$("#submitLogin").click(function(){
			//$.post(  "http://localhost:8500/mumbles/api/index.cfm/users",
			$.post(  "/authenticate",
					{  username: $("#username").val(), password: $("#password").val() } ,
					function(data){
						window.location = "/mumbles/";	
					}
				).error(function() { alert('Failed Verification'); });
			return false;
		}); 
	});

	$("#viewMumbles").live('pageshow', function (event) {
		$.getJSON( "http://localhost:8500/mumbles/api/index.cfm/mumbles", function(data) { 						   
		    var template = $('#mumblesTpl').html();
		    var html = Mustache.to_html(template, data);
		    $('#content').empty().html(html);
			$('#content ul').listview();
		});  
	});		
		
	$("#view").live('pageshow', function (event) {

		//get mumbleID from url query string
		mumbleID  = window.location.href.substr(1).split('?')[1].split('=')[1]; 

		var url = "http://localhost:8500/mumbles/api/index.cfm/mumble/" + mumbleID;								  
		$.getJSON( url, function(data) { 
			var template = $('#viewTpl').html();
		    var html = Mustache.to_html(template, data);
			$('#viewContent').empty().html(html);
			$('#view').page();
		});  	
	});		

	$("#edit").live('pageshow', function (event) {

		var url = "http://localhost:8500/mumbles/api/index.cfm/mumble/" + mumbleID.toString();								  
		$.getJSON( url, function(data) { 
			$('#editcategory').val(data.CATEGORY);
			$('#editmumble').val(data.MUMBLE);
			$('#editcategory').selectmenu('refresh', true);
		});  

		$("#editSubmit").click(function(){
			$.ajax({	url:  "http://localhost:8500/mumbles/api/index.cfm/mumble/" + mumbleID.toString(),
					type: 'PUT',
					data: {	mumble: $("#editmumble").val(), 
				   			category: $("#editcategory").val() }
			}).success(function(){$.mobile.changePage("/mumbles/",{transition:"pop", reloadPage: true, changeHash: true });});
		}); 	
	});		
	
	$("#phonelist").live('pageshow', function (event) {
		$.getJSON( "http://localhost:8500/mumbles/api/index.cfm/phonelist", function(data) { 						   
			var template = $('#phonelistTpl').html();
		    var html = Mustache.to_html(template, data);
			$('#phonelistContent').empty().html(html);
			$('#phonelistContent ul').listview();
		});  
	});	

	$("#searchUsers").live('pageshow', function (event) {
		$.getJSON( "http://localhost:8500/mumbles/api/index.cfm/users", function(data) { 			   
			var template = $('#searchUsersTpl').html();
		    var html = Mustache.to_html(template, data);
		    $('#SearchUsersContent').empty().html(html);
			$('#SearchUsersContent ul').listview();
		});  
	});	

	$("#viewUser").live('pageshow', function (event) {
		//get user from url query string
		var user  = window.location.href.substr(1).split('?')[1].split('=')[1]; 
		$('#hdrUser').empty().append(user);

		var url = "http://localhost:8500/mumbles/api/index.cfm/categories/" + user;								  
		$.getJSON( url, function(data) { 
			if (data.CATEGORY != null ) {
  				for (i=0; i < data.CATEGORY.split(',').length;i++){
  					$("#"+data.CATEGORY.split(',')[i].toUpperCase()).attr("checked",true).checkboxradio("refresh");
  				}
  			}
		});  

		$("#followSubmit").click(function(){
			//take checkbox and convert into list
			var categoryList = ($("#GENERAL").attr('checked')) ? "GENERAL" : "";
			categoryList += ($("#RELEASE").attr('checked')) ? ",RELEASE" : ""; 
			categoryList += ($("#CHECKIN").attr('checked')) ? ",CHECKIN" : "";

			//exec webservice to followUser
			$.post( "http://localhost:8500/mumbles/api/index.cfm/followers", { 
				followUser: user, 
				categoryList: categoryList },
				   function(data){
						$.mobile.changePage("/mumbles/", {transition:"pop", reloadPage: true, changeHash: true });	
				   }
			);
		}); 
	});		
	

	$("#reply").live('pageshow', function (event) {
		$("#replySubmit").click(function(){
			$.post(  "http://localhost:8500/mumbles/api/index.cfm/mumble/" + mumbleID.toString(),
					{  mumble: $("#replymumble").val() },
				   function(data){
						$.mobile.changePage("/mumbles/", {transition:"pop", reloadPage: true, changeHash: true });	
				   }				   
			);
		}); 
	});

	
	$('#compose').live('pageshow', function (event, ui) {
		$("textarea").text = '';									 
		$("textarea").focus();
		navigator.geolocation.getCurrentPosition(
			function(pos) {
				$("#lat_field").val(pos.coords.latitude);
				$("#long_field").val(pos.coords.longitude);
			}
		);
		
		$("#composeSubmit").click(function(){
			$.post(  "http://localhost:8500/mumbles/api/index.cfm/mumbles",
					{  mumble: $("#txtmumble").val(), 
					   category: $("#category").val(), 
					   latitude: $("#lat_field").val(),
					   longitude: $("#long_field").val() },
					   function(data) {
							$.mobile.changePage("/mumbles/",{transition:"pop", reloadPage: true, changeHash: true });	
					   } //function				   
			); //post
		}); 
	});
	
	$('#viewProfile').live('pagebeforecreate', function (event, ui) {
		var url = '';										 
		url = "http://localhost:8500/mumbles/api/index.cfm/followers"; // + $("#username").val();		
		$.getJSON( url, function(data) { 	
			var template = $('#allFollowersTpl').html();
		    var html = Mustache.to_html(template, data);
		    $('#allFollowers').empty().html(html);
			$('#allFollowers ul').listview();
		});  		
		
		url = "http://localhost:8500/mumbles/api/index.cfm/followed";	
		$.getJSON( url, function(data) { 	
			var template = $('#allFollowedTpl').html();
		    var html = Mustache.to_html(template, data);
		    $('#allFollowed').empty().html(html);
			$('#allFollowed ul').listview();							   
		});  	

		$('#viewProfile').live('swipeleft' ,function(event){
			$.mobile.changePage("#viewProfile1",{transition:"slide", reloadPage: false, changeHash: true });
			event.preventDefault();
		});

	});

	$('#viewProfile1').live('pagebeforecreate', function (event, ui) {
		$('#viewProfile1').live('swiperight' ,function(event){
			$.mobile.changePage("#viewProfile",{transition:"slide", reloadPage: false, changeHash: true });
			event.preventDefault();
		});
	});
