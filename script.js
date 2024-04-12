document.addEventListener("DOMContentLoaded", function () {
    // Change background color of the body
    document.body.style.backgroundColor = "red";

    var popupOverlay = document.getElementById("popup-overlay");
    var closePopupButton = document.getElementById("close-popup");
    var emailSubscriptionSection = document.querySelector(".email-subscription-section");
    var signupForm = document.querySelector(".signup-form");

    console.log("Popup overlay:", popupOverlay);
    console.log("Close popup button:", closePopupButton);
    console.log("Email subscription section:", emailSubscriptionSection);
    console.log("Signup form:", signupForm);

    // Function to set a cookie
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Function to get a cookie value
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Close the popup when the close button is clicked
    closePopupButton.addEventListener("click", function () {
        popupOverlay.style.display = "none";
        // Show the email subscription section
        emailSubscriptionSection.style.display = "block";
    });

   // Add event listener to the popup subscription form
document.getElementById("popup-form").addEventListener("submit", function () {
    signupForm.style.display = "none";
    // Set a cookie when the user submits the popup subscription form
    setCookie("subscribed", "true", 365); // Set the cookie to remember that the user has subscribed for 365 days
    console.log("Cookie set:", getCookie("subscribed")); // Log the value of the subscribed cookie
    // Close the popup after setting the cookie
    popupOverlay.style.display = "none";
});

    // Function to check if the popup should be shown
    function shouldShowPopup() {
        // Retrieve the value of the 'subscribed' cookie
        var subscribedCookie = getCookie("subscribed");
        // Check if the value of the 'subscribed' cookie is not 'true'
        var showPopup = subscribedCookie !== "true";
        // Return the result indicating whether the popup should be shown
        return showPopup;
    }

    // Check if the popup should be shown and show it
    if (shouldShowPopup()) {
        // Show the popup when the page loads
        popupOverlay.style.display = "block";
    } else {
        // If the user is already subscribed, show the thank you section instead of the popup
        emailSubscriptionSection.style.display = "block";
    }

    console.log("Cookie on page load:", getCookie("subscribed"));
});


$(document).ready(function(){
    ajaxMailChimpForm($("#subscribe-form"), $("#subscribe-result"));

    // Turn the given MailChimp form into an ajax version of it.
    // If resultElement is given, the subscribe result is set as html to
    // that element.
    function ajaxMailChimpForm($form, $resultElement){

        // Hijack the submission. We'll submit the form manually.
        $form.submit(function(e) {
            e.preventDefault();

            if (!isValidEmail($form)) {
                var error =  "A valid email address must be provided.";
                $resultElement.html(error);
                $resultElement.css("color", "red");
            } else {
                $resultElement.css("color", "black");
                $resultElement.html("Subscribing...");
                submitSubscribeForm($form, $resultElement);
            }
        });
    }

    // Validate the email address in the form
    function isValidEmail($form) {
        // If email is empty, show error message.
        // contains just one @
        var email = $form.find("input[type='email']").val();
        if (!email || !email.length) {
            return false;
        } else if (email.indexOf("@") == -1) {
            return false;
        }

        return true;
    }

    // Submit the form with an ajax/jsonp request.
    // Based on http://stackoverflow.com/a/15120409/215821
    function submitSubscribeForm($form, $resultElement) {
        $.ajax({
            type: "GET",
            url: $form.attr("action"),
            data: $form.serialize(),
            cache: false,
            dataType: "jsonp",
            jsonp: "c", // trigger MailChimp to return a JSONP response
            contentType: "application/json; charset=utf-8",

            error: function(error){
                // According to jquery docs, this is never called for cross-domain JSONP requests
            },

            success: function(data){
                if (data.result != "success") {
                    var message = data.msg || "Sorry. Unable to subscribe. Please try again later.";
                    $resultElement.css("color", "red");

                    if (data.msg && data.msg.indexOf("already subscribed") >= 0) {
                        message = "You're already subscribed. Thank you.";
                        $resultElement.css("color", "black");
                    }

                    $resultElement.html(message);

                } else {
                    $resultElement.css("color", "black");
                    $resultElement.html("Thank you!<br>You must confirm the subscription in your inbox.");
                }
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelector('.carousel-slides');
    const slides2 = document.querySelector('.carousel-slides2');

    let slideIndex = 0;
    const slideWidth = carousel.offsetWidth; // Width of each slide

    // Function to move the slides
    function moveSlides() {
        slides.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
        console.log('Slide index:', slideIndex);
        console.log('Slide position:', slides.style.transform);
    }

    function moveSlides2() {
        const slideWidth2 = slides2.children[0].offsetWidth; // Width of the first slide in the second set
        const slideIndex2 = slideIndex * (window.innerWidth > 1024 ? 3 : 3.2); // Adjust based on screen width
        slides2.style.transform = `translateX(-${slideIndex2 * slideWidth2}px)`; // Update position
        console.log("Second carousel slide position:", slides2.style.transform);
    }

    // Event listener for the next button
    nextButton.addEventListener('click', function() {
        slideIndex++;
        if (slideIndex >= slides.children.length) {
            slideIndex = 0; // Reset index if it exceeds the number of slides
        }
        moveSlides();
        moveSlides2();
    });

    // Event listener for the previous button
    prevButton.addEventListener('click', function() {
        slideIndex--;
        if (slideIndex < 0) {
            slideIndex = slides.children.length - 1; // Set index to the last slide if it goes below 0
        }
        moveSlides();
        moveSlides2();
    });
});
