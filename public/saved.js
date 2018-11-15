var modal = `<div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Notes for Article <span id="article-id"></span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="card">
                        <ul class="list-group list-group-flush articles-available">
                        </ul>
                    </div>
                    <br/>
                    <div class="form-group">
                        <label for="note-input" class="sr-only">Enter Note Here</label>
                        <textarea class="form-control" id="note-input" rows="3" placeholder="New Note"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="save-comment">Save Comment</button>
                </div>
            </div>
        </div>`;

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
                "<br /><br /><a data-id='" + 
                id +
                "' style='margin-right:8px;'" +
                "class='comment btn btn-light'>Comment</a>" +
                "<button data-id='" + 
                id +
                "' class='delete-article btn btn-light'>Delete from saved</button></p>",
            );
        }
    }
};

$(document).ready(function() {
    // Get articles in db on page load
    $.get('/saved', renderData);

    // When click to delete article
    $(document).on("click", ".delete-article", function() {
        // Set id variable 
        var id = $(this).attr("data-id");
        // Change text and disable button
        $(this).text("Deleted");
        $(this).attr("disabled", "disabled");
        // Remove p
        $(this).parent().remove();
        // Update isSaved in db
        $.ajax(`/remove/${id}`, {
            type: "PUT"
        }).then(function(){
        })
    });

    // When click to comment on article
    $(document).on("click", ".comment", function(event) {
        event.preventDefault();
        $(this).parent().append(modal)
        // Set id variable 
        const id = $(this).attr("data-id");
        $('#article-id').text(id);
        $('#save-comment').attr('data-id', id);
        $.ajax(`/articles/${id}`, {
            type: "GET"
        }).then(function (data) {
            console.log(data)
            $('.articles-available').empty();
            if (data[0].comment.length > 0){
                data[0].comment.forEach(v => {
                    $('.articles-available').append($(`<li class='list-group-item'>${v.text}<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data='${v._id}'>X</button></li>`));
                })
            }
            else {
                $('.articles-available').append($(`<li class='list-group-item'>No notes for this article yet</li>`));
                console.log("Second ran!")
            }
        })
        // Remove modal on click
        $(document).on("click", ".close", function() {
            $(this).parent().parent().parent().remove();
        })
    });

    // $('.btn-deletenote').click(function (event) {})
    $(document).on('click', '.btn-deletenote', function (){
        event.preventDefault();
        console.log($(this).attr("data"))
        const id = $(this).attr("data");
        console.log(id);
        $.ajax(`/comment/${id}`, {
            type: "DELETE"
        }).then(function () {
        });
    });

    $(document).on("click", "#save-comment", function() {
        event.preventDefault();
        const id = $(this).attr('data-id');
        const noteText = $('#note-input').val().trim();
        $('#note-input').val('');
        $.ajax(`/comment/${id}`, {
            type: "POST",
            data: { text: noteText}
        }).then(function (data) {
            console.log(data)
        })
    });
})
