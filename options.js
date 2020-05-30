
document.getElementById("save").addEventListener("click", function() {
  const savePort = document.getElementById("port").value
  chrome.storage.sync.set({"port": savePort}, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Saved!';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  })
});

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.sync.get("port", function(items) {
    document.getElementById("port").value = items.port;
  });
});
