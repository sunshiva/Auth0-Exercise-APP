function addUser(){
            
    window.location.href = '/customers/add';
}
function cancelAdd(){
    
    window.location.href = '/customers';
}

$('#check-session').on('click', function(e) {
    e.preventDefault();
    window.location = "http://localhost:3000/api/session";
  });

  setInterval(function() {
    // periodically check for SSO status
    checkSession();
  }, 120000);

  $(document).on("click", "#get-profile", function(e){
    e.preventDefault();
    $.ajax({
      url: "http://localhost:3000/api/userinfo",
      method: "GET",
      success: function (data) {
        $('#results pre').text(JSON.stringify(data, null, 2))
      }
    });
  });

  $('#get-appointments').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: "http://localhost:3000/api/appointments",
      method: "GET",
      success: function (data) {
        $('#results pre').text(JSON.stringify(data, null, 2))
      }
    });
  });

  $('#get-contacts').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: "http://localhost:3000/api/contacts",
      method: "GET",
      success: function (data) {
        $('#results pre').text(JSON.stringify(data, null, 2))
      }
    });
  });