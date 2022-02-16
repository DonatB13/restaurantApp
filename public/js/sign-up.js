//Sets error message under the input that was not correctly filled out
function setInputError(inputElement, message) {
    var errorSign = inputElement.parentElement.querySelector("#check-failed");
    var passedSign = inputElement.parentElement.querySelector("#check-passed");
    var errorText = inputElement.parentElement.parentElement.getElementsByTagName("small")[0];
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
    var errorText = inputElement.parentElement.parentElement.getElementsByTagName("small")[0];
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
    var regPassword = document.querySelector("#password");
    //Input fields
    var signUpEmail = document.querySelector("#sign-up-email");
    var firstName = document.querySelector("#first-name");
    var lastName = document.querySelector("#last-name");
    var address = document.querySelector("#address");
    var phoneNumber = document.querySelector("#phone-number");
    signUpEmail.addEventListener("blur", function (e) {
        if (!validateEmail(e)) {
            setInputError(signUpEmail, "Invalid email address.");
            return;
        }
        if (e.target.value.length <= 0 || e.target.value.length >= 40) {
            setInputError(signUpEmail, "Email address length is invalid.");
            return;
        }
        setInputSuccess(signUpEmail);
    });
    signUpEmail.addEventListener("input", function (e) {
        clearInputError(signUpEmail);
    });
    regPassword.addEventListener("blur", function (e) {
        if (!validatePassword(regPassword)) {
            return;
        }
    });
    regPassword.addEventListener("input", function (e) {
        clearInputError(regPassword);
    });
    firstName.addEventListener("blur", function (e) {
        if (e.target.value.length <= 0 || e.target.value.length >= 20) {
            setInputError(firstName, "Invalid First Name.");
        }
        else
            setInputSuccess(firstName);
    });
    firstName.addEventListener("input", function (e) {
        clearInputError(firstName);
    });
    lastName.addEventListener("blur", function (e) {
        if (e.target.value.length <= 0 || e.target.value.length >= 20) {
            setInputError(lastName, "Invalid Last Name.");
        }
        else
            setInputSuccess(lastName);
    });
    lastName.addEventListener("input", function (e) {
        clearInputError(lastName);
    });
    address.addEventListener("blur", function (e) {
        if (e.target.value.length <= 10 || e.target.value.length >= 100) {
            setInputError(address, "Invalid address length.");
        }
        else
            setInputSuccess(address);
    });
    address.addEventListener("input", function (e) {
        clearInputError(address);
    });
    phoneNumber.addEventListener("blur", function (e) {
        if (e.target.value.length <= 0 || e.target.value.length < 10 || e.target.value.length >= 12) {
            setInputError(phoneNumber, "Invalid phone number length.");
        }
        else
            setInputSuccess(phoneNumber);
    });
    phoneNumber.addEventListener("input", function (e) {
        clearInputError(phoneNumber);
    });
    document.querySelector("#link-create-account").addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector('#login-form').classList.remove('active');
        document.querySelector('#register-form').classList.toggle('active');
    });
    document.querySelector("#forgot-password").addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector('#login-form').classList.remove('active');
        document.querySelector('#forgot-password-form').classList.toggle('active');
    });
    document.querySelector("#close-register").addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector('#register-form').classList.toggle('active');
    });
});
function validateEmail(email) {
    var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(email.target.value)) {
        return false;
    }
    return true;
}
function validatePassword(password) {
    if (password.value.length == 0) {
        setInputError(password, "Password cannot be empty.");
        return;
    }
    if (password.value.length < 6) {
        setInputError(password, "Password is too short.");
        return;
    }
    if (password.value.length > 20) {
        setInputError(password, "Password is too long.");
        return;
    }
    if (password.value.search(/[a-z]/) < 0) {
        setInputError(password, "Your password must contain at least one lower case letter.");
        return;
    }
    if (password.value.search(/[A-Z]/) < 0) {
        setInputError(password, "Your password must contain at least one upper case letter.");
        return;
    }
    if (password.value.search(/[0-9]/) < 0) {
        setInputError(password, "Your password must contain at least one digit.");
        return;
    }
    if (password.value.search(/[!@#\$%\^&\*_]/) < 0) {
        setInputError(password, "Your password must contain a special character.");
        return;
    }
    setInputSuccess(password);
    return true;
}
