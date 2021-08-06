window.addEventListener("load", function() {
    if(document.getElementById("support_server") != null){
        document.getElementById("support_server").addEventListener("click", support_server_join);
    }
})

function support_server_join() {
    window.open("https://panel.easyrelaxed.de/support.php?request_call_bad=1")
}

