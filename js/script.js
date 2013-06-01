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
    $("#appliance-list").append(applianceListTemplate({
      brand: brand(),
      model: model(),
      stars: stars(5, 0)
    }));
    $("form")[0].reset();
    allowAdd();
    $("form input:first").focus();
  }

  $("form").submit(function(e) {
    e.preventDefault();
    if (allowAdd()) {
      addAppliance();
    }
    return false;
  });

  var stars = function(number, outOf) {
    return _(number).times(function() {
      return '<i class="icon-star"></i>';
    }).join("");
  };

  disableSubmission($("form button[type='submit']"));
  $("form input:first").focus();
});
