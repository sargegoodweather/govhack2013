$(function() {

  var updater = function(item) {
    this.$element.nextAll("input:first").focus();
    return item;
  };

  var modelSource = function(query, process) {
    var brand = $("input[data-field='brand']");
    return _.has(brandmap, brand.val()) ? brandmap[brand.val()] : _.values(brandmap);
  }

  $("input[data-field='brand']").typeahead({source: _.keys(brandmap), updater: updater});
  $("input[data-field='model']").typeahead({source: modelSource, updater: updater});

});
