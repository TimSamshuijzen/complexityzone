(function( $ ) {
  $.fn.spawn = function() {
    parent.Model.spawnFuture($("body").html());
    return this;
  };
}( jQuery ));