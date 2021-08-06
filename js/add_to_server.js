window.addEventListener("load", function() { 
    if(document.getElementById("add_to_server") != null){
        document.getElementById("add_to_server").addEventListener("click", add_to_server);
    }
});

function add_to_server() {
    window.open('https://discord.com/oauth2/authorize?client_id=826864111294873671&scope=bot&permissions=8');
}

$(function() {
    // Store references to all rows for future use
    var rows = $(".Row"),
        content = rows.filter(".Expand");

    // Test first to see if `display: table;` is being used
    if (rows.css("display") === "block") {
        function reflow() {
            var height = rows.parent().height();
            // Subtract height of fixed rows
            rows.not(content).each(function() {
                height -= $(this).height();
            });
            content.height(height);
        }
        // Run immediately on DOM ready…
        reflow();
        // And again on page load and resize events
        $(window).bind("load resize", reflow);
    }
});

function cookieOk() {
    var now = new Date(); // Variable für aktuelles Datum
    var lifetime = now.getTime(); // Variable für Millisekunden seit 1970 bis aktuelles Datum
    var deleteCookie = lifetime + 2592000000; // Macht den Cookie 30 Tage gültig.
       
    now.setTime(deleteCookie);
    var enddate = now.toUTCString();
       
    document.cookie = "setCookieHinweis = set; path=/; secure; expires=" + enddate;
    document.getElementById("cookie-popup").classList.add("hidden");
}