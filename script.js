document.querySelectorAll('.href-target').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var linkUrl = this.getAttribute('href');
    var target = this.getAttribute('target');
    
    setTimeout(function() {
      window.open(linkUrl, target);
    }, 500);
  });
});