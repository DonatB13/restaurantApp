function handleLoginBtn(){
    $("#loginBtn").on("click", function(event) {
        event.preventDefault();
        let email = $("#login-email").val();
        let password = $("#login-password").val();

        $.ajax({
            url: `${window.location.origin}/login`,
            method: "POST",
            data: {email: email, password: password},
            success: function(data) {
                window.location.href = "/";
            },
            error: function(err) {
                console.log(err);
                document.querySelector("#login-error").classList.add('active');
            }
        })
    });
}

$(document).ready(function() {
    handleLoginBtn();
});

