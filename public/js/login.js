function handleLoginBtn() {
    $("#loginBtn").on("click", function (event) {
        event.preventDefault();
        var email = $("#login-email").val();
        var password = $("#login-password").val();
        $.ajax({
            url: "".concat(window.location.origin, "/login"),
            method: "POST",
            data: { email: email, password: password },
            success: function (data) {
                window.location.href = "/";
            },
            error: function (err) {
                console.log(err);
                document.querySelector("#login-error").classList.add('active');
            }
        });
    });
}
$(document).ready(function () {
    handleLoginBtn();
});
