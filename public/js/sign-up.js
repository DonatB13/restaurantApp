//Sets error message under the input that was not correctly filled out
function setInputError(inputElement, message) {
    var errorSign = inputElement.parentElement.querySelector("#check-failed");
    var passedSign = inputElement.parentElement.querySelector("#check-passed");
    var errorText = inputElement.parentElement.getElementsByTagName("small")[0];
    errorSign.classList.add("active");
    passedSign.classList.remove("active");
    inputElement.classList.add("error");
    errorText.textContent = message;
    errorText.classList.add("active");
}
//Clears error message under the input
function clearInputError(inputElement) {
    var errorSign = inputElement.parentElement.querySelector("#check-failed");
    var passedSign = inputElement.parentElement.querySelector("#check-passed");
    var errorText = inputElement.parentElement.getElementsByTagName("small")[0];
    errorSign.classList.remove("active");
    passedSign.classList.remove("active");
    inputElement.classList.remove("error");
    errorText.textContent = "";
    errorText.classList.remove("active");
}
//Indicates that input was correctly filled out
function setInputSuccess(inputElement) {
    var errorSign = inputElement.parentElement.querySelector("#check-failed");
    var passedSign = inputElement.parentElement.querySelector("#check-passed");
    errorSign.classList.remove("active");
    passedSign.classList.add("active");
    inputElement.classList.remove("error");
}
document.addEventListener("DOMContentLoaded", function () {
    //Forms
    var loginForm = document.querySelector("#login-form");
    var createAccountForm = document.querySelector("#register-form");
    //Input fields
    var signUpEmail = document.querySelector("#signupEmail");
    var firstName = document.querySelector("#firstName");
    var lastName = document.querySelector("#lastName");
    var address = document.querySelector("#address");
    var phoneNumber = document.querySelector("#phoneNumber");
    signUpEmail.addEventListener("blur", function (e) {
        if (!validEmail(e)) {
            setInputError(signUpEmail, "Invalid email address.");
        }
        if (e.target.value.length <= 0 || e.target.value.length >= 40) {
            setInputError(signUpEmail, "Email address length is invalid.");
        }
    });
    signUpEmail.addEventListener("input", function (e) {
        clearInputError(signUpEmail);
    });
    firstName.addEventListener("blur", function (e) {
        if (e.target.value.length <= 0 || e.target.value.length >= 20) {
            setInputError(firstName, "Invalid First Name.");
        }
    });
    firstName.addEventListener("input", function (e) {
        clearInputError(firstName);
    });
    lastName.addEventListener("blur", function (e) {
        if (e.target.value.length <= 0 || e.target.value.length >= 20) {
            setInputError(lastName, "Invalid Last Name.");
        }
    });
    lastName.addEventListener("input", function (e) {
        clearInputError(lastName);
    });
    address.addEventListener("blur", function (e) {
        if (e.target.value.length <= 10 || e.target.value.length >= 100) {
            setInputError(address, "Invalid address length.");
        }
    });
    address.addEventListener("input", function (e) {
        clearInputError(address);
    });
    phoneNumber.addEventListener("blur", function (e) {
        if (e.target.value.length <= 0 || e.target.value.length < 10 || e.target.value.length >= 12) {
            setInputError(phoneNumber, "Invalid phone number length.");
        }
    });
    phoneNumber.addEventListener("input", function (e) {
        clearInputError(phoneNumber);
    });
    document.querySelector("#linkCreateAccount").addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector('#login-form').classList.remove('active');
        document.querySelector('#register-form').classList.toggle('active');
    });
    document.querySelector("#forgotPassword").addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector('#login-form').classList.remove('active');
        document.querySelector('#forgotPassword-form').classList.toggle('active');
    });
    document.querySelector("#close-register").addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector('#register-form').classList.toggle('active');
    });
});
function validEmail(email) {
    var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(email.target.value)) {
        return false;
    }
    return true;
}
