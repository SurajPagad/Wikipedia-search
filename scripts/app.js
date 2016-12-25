$(document).ready(function() {
  var myData = {};
  $("input").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrlimit=10&prop=pageimages|extracts&piprop=thumbnail&exintro=true&exlimit=10&gsrinterwiki=true&gsrsearch=",
        dataType: "jsonp",
        beforeSend: function() {
          $('.glyphicon-remove').hide();
          $('.loader').show();
        },

        complete: function() {
          $('.loader').hide();
          $('.glyphicon-remove').show();
          //$('.ui-menu').append('<div style="color:#252839;font-weight:bold"><p>Press enter to search</p></div>');
        },

        data: {
          gsrsearch: request.term
        },

        success: function(data) {
          myData = data;
          var pages = data.query.pages;
          var keys = Object.keys(pages);
          var res = [];
          keys.forEach(function(id) {
            res.push(pages[id].title);
          });
          response(res);
        }
      });
    },

    select: function(event, ui) {
      var val = ui.item.value;
      if ($('.clearable').val() !== '' && (event.keyCode == 13 || event.which == 1)) {
        $(".wrapper").empty();
        var pages = myData.query.pages;
        var keys = Object.keys(pages);
        keys.forEach(function(id) {
          if (pages[id].title === val) {
            $(".wrapper").show();
            var img = "";
            if (pages[id].hasOwnProperty('thumbnail')) {
              img = "<img src=" + pages[id].thumbnail.source + "><img>";
            }
            $(".wrapper").append("<h1>" + pages[id].title + "</h1><hr>" + img + "" + pages[id].extract.slice(0,-12) + "<span><a target='_blank'  title='Read full article'   href='https://en.wikipedia.org/?curid=" + id + "'> wikipedia</a></span>");
          }
        });
      }
    },
    minLength: 3
  });

  $('input').on('input', function() {
    $('.glyphicon-remove').show();
    if (!this.value) {
      $('.glyphicon-remove').hide();
      $(".wrapper").hide();
    }
  });
  $('.glyphicon-remove').on('click', function() {
    $(this).hide();
    $('input').val('').change();
    $(".wrapper").hide();
  });
});