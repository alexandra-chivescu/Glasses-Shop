$(".reflection-container").hover(
    function() {
        $(this).find(".reflection-text-inverse").addClass("animated");
    },
    function() {
        $(this).find(".reflection-text-inverse").removeClass("animated");
    }
);