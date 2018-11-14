const renderData = function(data) {

    // Declare article titles array
    var titles = [];
    // For each one
    for (var i = 0; i < data.length; i++) {
        // log
        console.log('phew');
        // If it's not a duplicate
        if (!titles.includes(data[i].title)) {
            // Add the title to titles array
            titles.push(data[i].title);
            // Save properties to variables b/c having trouble with them
            var link = data[i].link;
            var img = data[i].img;
            var id = data[i]._id;
            var title = data[i].title;
            // Display the apropos information on the page
            $('.article-container').append(
            "<p style='background-color:pink; padding: 10px; font-size: 20px'><a href=" +
                link +
                " data-id='" +
                id +
                "'><img style='width: 50%; height: 50%; padding: 10px'src=" +
                img +
                '><br />' +
                title +
                '</a>' +
                "<br /><br /><button class='save btn btn-light'>Save Article</button></p>",
            );
        }
    }
};

$(document).ready(function() {
  $.get('/articles', renderData);
  $(document).on('click', '.scrape-new', function() {
    // Empty the article-container div
    $('.article-container').empty();
    // First scrape
      // Grab the articles as a json
      // If we get data, then hide alert div
      $('.alert-h4').text('Scraping may take 15-20 seconds');
    $.get('/scrape', function(data) {
      // log data
      // console.log(data);
      return data;
    }).then(renderData);
  })
})




// $.getJSON("/articles", function(data) {
//     // Declare article titles array
//     var titles = [];
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//         // log
//         console.log("phew")
//         // If it's not a duplicate
//         if (!titles.includes(data[i].title)) {
//             // Add the title to titles array
//             titles.push(data[i].title);
//             // Save properties to variables b/c having trouble with them
//             var link = data[i].link;
//             var img = data[i].img;
//             var id = data[i]._id;
//             var title = data[i].title;
//             // Display the apropos information on the page
//             $(".article-container").append("<p style='background-color:pink; padding: 10px; font-size: 20px'><a href="
//             + link + " data-id='" + id + "'><img style='width: 50%; height: 50%; padding: 10px'src=" + img + "><br />" + title + "</a>"
//             + "<br /><br /><button class='save btn btn-light'>Save Article</button></p>");
//         }
//     }
// });

// $(document).on("click", ".scrape-new", function() {
//     // Empty the article-container div
//     $(".article-container").empty();
//     // First scrape
//     $.get("/scrape", function (response) {
//         // log data
//         // console.log(data);
//     }).then(function() {
//         // Grab the articles as a json
//         $.getJSON("/articles", function(data) {
//             // If we get data, change the alert div
//             $(".alert-h4").text("Scraping may take 15-20 seconds");
//             // Declare article titles array
//             var titles = [];
//             // For each one
//             for (var i = 0; i < data.length; i++) {
//                 // log
//                 console.log("phew")
//                 // If it's not a duplicate
//                 if (!titles.includes(data[i].title)) {
//                     // Add the title to titles array
//                     titles.push(data[i].title);
//                     // Save properties to variables b/c having trouble with them
//                     var link = data[i].link;
//                     var img = data[i].img;
//                     var id = data[i]._id;
//                     var title = data[i].title;
//                     // Display the apropos information on the page
//                     $(".article-container").append("<p style='background-color:pink; padding: 10px; font-size: 20px'><a href="
//                     + link + " data-id='" + id + "'><img style='width: 50%; height: 50%; padding: 10px'src=" + img + "><br />" + title + "</a>"
//                     + "<br /><br /><button class='save btn btn-light'>Save Article</button></p>");
//                 }
//             }
//         });
//     });
// })
  