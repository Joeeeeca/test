// Declare popupOverlay and emailSection globally
var popupOverlay;
var emailSection;

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

document.addEventListener("DOMContentLoaded", function () {

  // Retrieve popup overlay and email subscription section elements
  popupOverlay = document.getElementById("popup-overlay");
  emailSection = document.querySelector(".email-subscription-section");
  embeddedForm = document.getElementById("subscribe-form1")

  // Function to check if the popup should be shown
  function shouldShowPopup() {
    // Retrieve the value of the 'subscribed' cookie
    var subscribedCookie = getCookie("subscribed");

    // Log the value of the retrieved cookie to the console
    console.log("Value of 'subscribed' cookie:", subscribedCookie);

    // Check if the value of the 'subscribed' cookie is not 'true'
    var showPopup = subscribedCookie !== "true";

    // Log whether the popup should be shown based on the cookie value
    console.log("Show Popup:", showPopup);

    // Return the result indicating whether the popup should be shown
    return showPopup;
  }

 // Check if the popup should be shown and show it
if (shouldShowPopup()) {
    // Show the popup when the page loads
    if (popupOverlay) {
      popupOverlay.style.display = "block";
    }
  } else {
    // Hide the popup if the cookie is set
    if (popupOverlay) {
      popupOverlay.style.display = "none";
    }
  }

  // Subscribe button click event listener
  document.getElementById("subscribe-form").addEventListener("submit", function () {
    // Hide the signup form
    var signupForm = document.querySelector(".signup-form");
    signupForm.style.display = "none";

    // Set a cookie when the user submits the popup subscription form
    setCookie("subscribed", "true", 365); // Set the cookie to remember that the user has subscribed for 365 days

    // Hide the popup after successful signup
    if (popupOverlay) {
      popupOverlay.style.display = "none";
    } else {
        popupOverlay.style.display = "block";
    }

    // Show the email subscription section
    if (emailSection) {
      emailSection.style.display = "block";
    }

    // Log the value of the 'subscribed' cookie
    console.log("Value of 'subscribed' cookie:", getCookie("subscribed"));
  });

  // Add event listener to the popup subscription form
  document.getElementById("subscribe-form1").addEventListener("submit", function () {
    // Set a cookie when the user submits the popup subscription form
    setCookie("subscribed", "true", 365); // Set the cookie to remember that the user has subscribed for 365 days

    // Hide the signup form
    var signupForm = document.querySelector(".signup-form");
    signupForm.style.display = "none";

    // Hide the popup after successful signup
    if (popupOverlay) {
      popupOverlay.style.display = "none";
    } 
    else {
        popupOverlay.style.display = "block";
    }

    // Show the email subscription section
    if (emailSection) {
      embeddedForm.style.display = "none";
    }
  });

  // Get reference to the close button
  var closeButton = document.getElementById('close-popup');

  // Add event listener to the close button
  closeButton.addEventListener('click', function() {
    // Hide the popup overlay
    if (popupOverlay) {
      popupOverlay.style.display = 'none';
    }

    // Show the email subscription section
    if (emailSection) {
      emailSection.style.display = 'block';
    }
  });
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
                  // Center the "Thank you!" message
                  $resultElement.css({
                      "color": "white",
                      "display": "flex",
                      "justify-content": "center"
                  }).html("Thank you!<br>You must confirm the subscription in your inbox.");
          
                  // Hide the form fields of the email-subscription-section
                  $(".email-subscription-section input, .email-subscription-section textarea").css("display", "none");
              }
          }
        });
    }
});
$(document).ready(function(){
    ajaxMailChimpForm($("#subscribe-form1"), $("#subscribe-result1"));

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
                    $resultElement.css("color", "white",
                  "justify-content", "center");
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
