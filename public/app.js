const renderData = function(data) {
    // Declare array for article titles
    var titles = [];
    // For each one
    for (var i = 0; i < data.length; i++) {
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
                "<br /><br /><button data-id='" + 
                id +
                "' class='save btn btn-light'>Save Article</button></p>",
            );
        }
    }
};

$(document).ready(function() {
    // Get articles in db on page load
    $.get('/articles', renderData);
    // When user clicks "Scrape new articles"
    $(document).on('click', '.scrape-new', function() {
        // Empty the article-container div
        $('.article-container').empty();
        // Let user know scraping make take some time
        $('.alert').append("<h4 class='alert-h4'>Scraping may take about ten seconds.</h4>");
        // Scrape
        $.get('/scrape', function(data) {
        return data;
        // renderData function is passed data
        }).then(renderData);
        // Reload page
        location.reload();
    })
});

$(document).on("click", ".save", function() {
    // Set id variable 
    var id = $(this).attr("data-id");
    // Change text and disable button
    $(this).text("Saved");
    $(this).attr("disabled", "disabled");
    // Hide p
    $(this).parent().remove();
    // Save the article
    $.ajax(`/save/${id}`, {
        type: "PUT"
    }).then(function() {
        const alert = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
        Your note has been saved!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>`
        $(".article-container").prepend(alert);
        }
    );
})

$(document).on("click", ".clear", function() {
    // Clear article-container div
    $(".article-container").empty();
})




