var username;

var message;

var makeMessage = function(percent) {
  return percent < 50 ? randomInsult(username) : randomCompliment(username);
};

var makePostInformation = function(percent) {
	return {
    capt: username + ' took the Green Screen challenge and got ' + percent + '%!',
	desc: message + '\nCan you beat their score?'
  };
};


$(function() {
  var modelmap = {};
  _.each(brandmap, function(models, brand) {
    _.each(models, function(model) {
      modelmap[model] = brand;
    });
  });

  var applianceListTemplate = _.template($("#appliance-list-template").html());

  var disableSubmission = function($sub) {
    $sub.addClass("disabled");
    $sub[0].disabled = true;
    return false;
  };

  var enableSubmission = function($sub) {
    $sub.removeClass("disabled")
    $sub[0].disabled = false;
    return true;
  }

  var allowAdd = function() {
    $sub = $("form button[type='submit']");
    if (_.has(brandmap, brand())) {
      if (_.has(brandmap[brand()]), model()) {
        return enableSubmission($sub);
      }
    }
    return disableSubmission($sub);
  };

  var fillInBrand = function(item) {
    if (_.isEmpty(brand())) {
      if (!_.isEmpty(item) && _.has(modelmap, item)) {
        brand(modelmap[item]);
      } else {
        var $brand = $("form input[data-field='brand']");
        $brand.focus();
      }
    }
  };

  var updater = function(item) {
    this.$element.nextAll("input:first").focus();
    if (this.$element[0] === $("form input[data-field='model']")[0]) {
      fillInBrand(item);
    }
    allowAdd();
    return item;
  };

  var brandSource = function(query, process) {
    return _.keys(brandmap);
  };

  var modelSource = function(query, process) {
    return _.has(brandmap, brand()) ? brandmap[brand()] : _.flatten(_.values(brandmap));
  };

  var brand = function(val) {
    var $brand = $("input[data-field='brand']");
    if (val) {
      $brand.val(val);
    }
    return $brand.val();
  };

  var model = function(val) {
    var $model = $("input[data-field='model']");
    if (val) {
      $model.val(val);
    }
    return $model.val();
  };

  $("input[data-field='brand']").typeahead({source: brandSource, updater: updater});
  $("input[data-field='model']").typeahead({source: modelSource, updater: updater});

  var addAppliance = function(e) {
    $appliance = $(applianceListTemplate({
      brand: brand(),
      model: model(),
    }));
    $appliance.appendTo("#appliance-list");
    $appliance.find(".remove-appliance").on("click", function(e) {
      removeAppliance(this);
    });
    get(brand(), model(), $appliance[0]);
    $("form")[0].reset();
    allowAdd();
    allowOk();
    $("form input:first").focus();
  }

  $("form").submit(function(e) {
    e.preventDefault();
    if (allowAdd()) {
      addAppliance();
    }
    return false;
  });

  var removeAppliance = function(element) {
    $(element).closest("li").remove();
    allowOk();
  };

  var addEnergyInformation = function(element) {
    return function(energyInformation) {
		$(element).data("Star",energyInformation.result.records[0]);
      $(element).find("a").append(stars(parseFloat(energyInformation.result.records[0].Star), 10));
    };
  };

  var stars = function(number, outOf) {
    var filledStars = _(Math.floor(number)).times(function() {
      return '<i class="icon-star"></i>';
    }).join("");
    var halfStar = number - Math.floor(number) > 0.0 ? '<i class="icon-half-star"></i><i class="icon-half-star-empty"></i>' : "";
    var emptyStars = _(Math.floor(outOf - number)).times(function() {
      return '<i class="icon-star-empty"></i>';
    }).join("");
    return '<span class="stars">' + filledStars + halfStar + emptyStars + '</span>';
  };

  var get = function(brand, model, element) {
    var url = "http://opendata.linkdigital.com.au/api/action/datastore_search_sql?sql=SELECT%20*%20FROM%20%2293a615e5-935e-4713-a4b0-379e3f6dedc9%22%20WHERE%20TRIM(%22Brand_Reg%22)=TRIM('" + brand + "')%20AND%20TRIM(%22Model_No%22)=TRIM('" + model + "')";
    $.ajax(url, {success: addEnergyInformation(element)});
  };

  var disableOk = function($ok) {
    $ok.addClass("disabled");
    $ok[0].disabled = true;
    return false;
  };

  var enableOk = function($ok) {
    $ok.removeClass("disabled");
    $ok[0].disabled = false;
    return true;
  };

  var allowOk = function() {
    var $ok = $("#ok");
    if ($("#appliance-list li").length > 0) {
      return enableOk($ok);
    }
    return disableOk($ok);
  };

  var getRecommendationsFor = function(brand, model) {
    var url = "http://opendata.linkdigital.com.au/api/action/datastore_search_sql?sql=SELECT%20DISTINCT%20q.%22Brand_Reg%22,q.%22Model_No%22,q.%22Star%22%20FROM%20%2293a615e5-935e-4713-a4b0-379e3f6dedc9%22%20q%20WHERE%20q.%22CEC%22%20IN%20(SELECT%20t.%22min_cec%22%20FROM%20(SELECT%20DISTINCT%20%22Star%22,MIN(%22CEC%22)%20AS%20%22min_cec%22%20FROM%20%2293a615e5-935e-4713-a4b0-379e3f6dedc9%22%20WHERE%20%22Star%22%20%3E%20COALESCE((SELECT%20MIN(%22Star%22)%20FROM%20%2293a615e5-935e-4713-a4b0-379e3f6dedc9%22%20WHERE%20%22Brand_Reg%22='" + brand + "'%20AND%20%22Model_No%22='" + model + "'),0)%20GROUP%20BY%20%22Star%22)%20t)";
    $.get(url, {
      success: function(data) {
      }
    });
  }

  var showSummary = function() {
	  var star = averageStar("#appliance-list");
    var avg = Math.round(star * 10);
    message = makeMessage(avg);
    $("#summary h1").text("You scored " + avg + "%");
    $("#summary p").text(message);
    $("#enter-appliances").hide();
    $("#summary").show();
  };

  var showEnterAppliances = function() {
    $("#enter-appliances").show();
    $("#summary").hide();
  };

  $("#ok").click(function() {
    if (allowOk()) {
      showSummary();
    }
  });

  var averageStar = function(list) {
    var appliances = $(list).find("li");
    var total = 0;
    appliances.each(function(i, el) {
      total = total + $(el).data("Star").Star;
    });
    return total / appliances.length;
  };

  $("#share").click(function() {
    var ret = makePostInformation();
    FB.ui({
      method: 'feed',
      link: 'stormy-beyond-1782.herokuapp.com/',
      picture: 'stormy-beyond-1782.herokuapp.com/img/greenscreen.png',
      name: 'How Green is your Screen?',
      caption: ret.capt,
	  description: ret.desc
    });
  });

  var resetForm = function() {
    $("#appliance-list li").remove();
    $("form")[0].reset();
    allowAdd()
    allowOk();
  }

  $("#start-over").click(function() {
    resetForm();
    showEnterAppliances();
  });

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '258550604284955', // App ID
      channelUrl : '//stormy-beyond-1782.herokuapp.com/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });
  };
  // Load the SDK Asynchronously
  var loadFB = function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
  };
  loadFB(document, 'script', 'facebook-jssdk');

  showEnterAppliances();
  allowOk();
  disableSubmission($("form button[type='submit']"));
  $("form input:first").focus();

  var setName = function() {
    FB.api('/me', function(response) {
      username = response.name;
    });
  };

  var showConnect = function() {
    $("#connect").show();
    $("#share").hide();
  };

  var hideConnect = function() {
    $("#connect").hide();
    $("#share").show();
  };

  var showShare = function() {
    $("#connect").hide();
    $("#share").show();
  };

  var hideShare = function() {
    $("#connect").show();
    $("#share").hide();
  };

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      var uid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
      setName();
      hideConnect();
    } else if (response.status === 'not_authorized') {
      showConnect();
    } else {
      showConnect();
    }
  });

  var connect = function() {
	  FB.login(function(response) {
      if (response.authResponse) {
        setName();
      }
    });
  };

  $("#connect").click(connect);
});



  // FB.api('/me/feed', 'post', { message: body }, function(response) {
  // 		  if (!response || response.error) {
  // 			  alert('Error occured');
  // 		  } else {
  // 			  alert('Post ID: ' + response.id);
  // 		  }
  // 	  });
