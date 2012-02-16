$(document).ready(function() {
  
  if (!site) throw new Error('Configuration not found');

  //activate carousel
  $('.item').first().addClass("active");

  //carousel
  $("#myCarousel").carousel();

  //show github watch instructions
  $('.watch').mouseover(function() {
	  $('.watch-docs').show()
  });

  $('.watch').mouseleave(function() {
	  $('.watch-docs').hide()
  });

  //highlight selected navigation 
  if (location.pathname != "/") {
		$('.nav li').removeAttr("class").children("a").filter("[href='" + location.pathname + "']").parent().addClass("active");
  
	  if(location.pathname.match(/event/)) { 
	   	$('[href="/events.html"]').parent().addClass("active");
	  }
  }

 


  //jobs show/hide details
	$(".content-block").hide();

	  $("#down").live("click", function() {
	    $($(this).parent().find(".content-block")[0]).slideToggle("fast");
	    $(this).attr("id", "up");
	    $($(this).children()[0]).html("&#8593;")
	  });

	  $("#up").live("click", function() {
	    $($(this).parent().find(".content-block")[0]).slideToggle("fast");
	    $($(this).children()[0]).html("&#8595;")
	    $(this).attr("id", "down");
	  });

});

