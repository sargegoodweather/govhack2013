$(function() {

  applianceListTemplate = _.template($("#appliance-list-template").html());

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

  var updater = function(item) {
    this.$element.nextAll("input:first").focus();
    allowAdd();
    return item;
  };

  var brandSource = function(query, process) {
    return _.keys(brandmap);
  };

  var modelSource = function(query, process) {
    var brand = $("input[data-field='brand']");
    return _.has(brandmap, brand.val()) ? brandmap[brand.val()] : _.values(brandmap);
  };

  var brand = function() {
    return $("input[data-field='brand']").val();
  };

  var model = function() {
    return $("input[data-field='model']").val();
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
});
