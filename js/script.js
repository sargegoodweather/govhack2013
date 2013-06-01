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
    return filledStars + halfStar + emptyStars;
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

  allowOk();
  disableSubmission($("form button[type='submit']"));
  $("form input:first").focus();
});
