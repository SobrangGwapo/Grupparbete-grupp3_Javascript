document.getElementById("events-btn").addEventListener("click", (e) => {
    e.preventDefault();
    loadPage('./pages/events/events.html', './scripts/events.js', '#events');
    document.getElementById("events").classList.remove("hidden");
});

function loadPage(htmlFile, jsFile, targetSelector = '#content') {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  fetch(htmlFile)
    .then(res => res.text())
    .then(data => {
      target.innerHTML = data;

      if (jsFile) {
        // Kolla om script redan finns
        if (!document.querySelector(`script[src="${jsFile}"]`)) {
          const script = document.createElement("script");
          script.src = jsFile;
          document.body.appendChild(script);
        }
      }
    });
}