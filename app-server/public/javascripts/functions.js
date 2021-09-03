$(document).ready(function(){
  $('.toast').toast('show');

  // request when clicking on the button
  $('#btn-analyse').click(function() {
    var input = $("#message").val();
    api_call(input);
    input = "";

  
});
  
});

//$('input[name=date]').val("2021-06-12");
//$('#datepicker').val(new Date().toISOString().slice(0, 10));

$('#trendsTable').tooltip({ boundary: 'window' })

//$('#trendsTable').DataTable();

var now = new Date();
var month = (now.getMonth() + 1);               
var day = now.getDate();
if (month < 10) 
    month = "0" + month;
if (day < 10) 
    day = "0" + day;
var today = now.getFullYear() + '-' + month + '-' + day;
console.log("today " + today)
$('#datepicker').click(function(){
  $('#datepicker').attr('max', today);
});


$("#filterBtn").click(function(){
    $("#filterModal").toogle();
});

$('#uploadSection').click(function () {
    $('#uploadFiles').show();
});

$('#ratingSubmit').click(function() {
    if($('input:radio:checked').length < 1) {
      $('#alertRadio').show();
    }
    else {
      alert('Success!');
    }
    return false;
  });

  $(function () {
    $('.custom-control-input').click(function(e) {
      $('.custom-control-input').not(this).prop('checked', false);
    });
  });



  /*
  //prevent enter to be submit
  $(document).on("keydown", "form", function(event) { 
    return event.key != "Enter";
});*/

// Validate Bootstrap form fields
(function () {
  "use strict";
  window.addEventListener(
      "load",
      function () {
          // Fetch all the forms we want to apply custom Bootstrap validation styles to
          var forms = document.getElementsByClassName("needs-validation");
          // Loop over them and prevent submission
          var validation = Array.prototype.filter.call(forms, function (form) {
              form.addEventListener(
                  "submit",
                  function (event) {
                      if (form.checkValidity() === false) {
                          event.preventDefault();
                          event.stopPropagation();
                      }
                      form.classList.add("was-validated");
                  },
                  false,
              );
          });
      },
      false,
  );
})();

function api_call(input) {
  $.ajax({
      url: "http://193.137.11.49:10203/analyse",
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(input),
      success: function( data, textStatus, jQxhr ){
          $('#api_output').html( data.output );
          $("#message").val("");
      },
      error: function( jqXhr, textStatus, errorThrown ){
          $('#api_output').html( "There was an error" + errorThrown);
          console.log( errorThrown );
      },
      timeout: 7000
  }); 
}

