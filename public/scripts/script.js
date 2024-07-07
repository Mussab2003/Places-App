$('.search-bar-button').mouseenter(function (){
    $('.search-bar-button').addClass('search-bar-button-hover');
});

$('.search-bar-button').mouseleave(function (){
    $('.search-bar-button').removeClass('search-bar-button-hover');
});

function on_click(){
    var input = $('.search-bar-input').val();
   $('.places-container').hide();
   $('#loading').show();
   console.log(input);
   $.post('/submit', { data: input })
   .done(function (response) {
        console.log('Response received:', response);
        window.location.href = '/search-result';
    })
    .fail(function (error) {
        console.error("Error:", error);
    })
    .always(function (){
        console.log('Request completed');
        setTimeout(()=>{
            $('.places-container').show();            
            $('#loading').hide();
        }, 10000);
    });
}

$('.search-bar-button').click(function (){
    on_click();

});

$('.search-box').keypress((event) => {
    if(event.which == 13){
        on_click();
    }
});

$('.details-page').click(function(event) {
    event.preventDefault();
    console.log("Hello World");
    var input = $(this).attr('data');
    console.log(input);
    $.post('/detail', { data: input })
    .done(function(response) {
        window.location.href = '/detail-page';
    })
    .fail(function(error) {
        console.error("Error:", error);
    });
});