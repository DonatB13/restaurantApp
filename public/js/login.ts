function handleLoginBtn(){
    $("#login-btn").on
	("click", function(event) 
	{
        event.preventDefault();
        let email: string = $("#login-email").val() as string;
        let password: string = $("#login-password").val() as string;

        $.ajax
		({
            url: `${window.location.origin}/login`,
            method: "POST",
            data: {email, password},
            success: function(data) 
			{
                window.location.href = "/";
            },
            error: function(err) 
			{
                console.log(err);
                document.querySelector("#login-error").classList.add('active');
            }
        })
    });
}

$(document).ready(function() 
{
    handleLoginBtn();
});