/* Contact details shown on the page. Leave a value empty to hide it. */
var CONTACT = { phone: "07933 005029", email: "hello@thoughtfulconstruction.co.uk", instagram: "@thoughtfulconstruction" };

/* Web3Forms access key. Enquiries are emailed to the address the key was made for.
   Leave empty and the form falls back to writing the message for the visitor to send. */
var FORM_KEY = "15971d74-013d-495a-9956-acf8b0bc31f1";

(function(){
  var form = document.getElementById("enq"), out = document.getElementById("f-out"),
      res = document.getElementById("result"), err = document.getElementById("f-err"),
      send = document.getElementById("f-send"), copied = document.getElementById("f-copied");
  function val(id){ return document.getElementById(id).value.trim(); }
  if (form.getAttribute("data-type")) document.getElementById("f-type").value = form.getAttribute("data-type");

  form.addEventListener("submit", function(e){
    e.preventDefault();
    if (!val("f-name") || !val("f-reach") || !val("f-job")) {
      err.textContent = "Add your name, a way to reach you and a line about the job.";
      err.hidden = false; return;
    }
    err.hidden = true;
    var lines = [
      "Hello,", "",
      "I'd like to talk about some work.", "",
      "Name: " + val("f-name"),
      "Reach me on: " + val("f-reach"),
      "The job: " + val("f-job")
    ];
    function opt(label, id){ if (val(id)) lines.push(label + ": " + val(id)); }
    opt("Property", "f-place"); opt("Kind of work", "f-type"); opt("Rough budget", "f-budget"); opt("Timing", "f-when");
    opt("Listed or let", "f-status"); opt("Nearby during the work", "f-local"); opt("Heard about you from", "f-source");
    out.value = lines.join("\n");
    if (FORM_KEY) { if (!sending) sendDirect(); return; }
    showDraft();
  });

  var sending = false, go = document.getElementById("f-go"), done = document.getElementById("f-done");
  if (!FORM_KEY && go) go.textContent = "Write my message";
  function sendDirect(){
    sending = true; go.disabled = true; go.textContent = "Sending…";
    var data = { access_key: FORM_KEY, subject: "Website enquiry from " + val("f-name"),
      from_name: "Thoughtful website", name: val("f-name"), message: out.value,
      botcheck: form.querySelector('[name="botcheck"]').checked };
    if (/@/.test(val("f-reach"))) data.replyto = val("f-reach");
    fetch("https://api.web3forms.com/submit", { method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(function(r){ return r.json(); })
      .then(function(j){ if (!j.success) throw 0; form.hidden = true; done.hidden = false; done.scrollIntoView({block: "nearest"}); })
      .catch(function(){ sending = false; go.disabled = false; go.textContent = "Send enquiry";
        err.textContent = "That didn't send. Your message is below to email or text instead."; err.hidden = false; showDraft(); });
  }

  function showDraft(){
    document.getElementById("f-mail").href = "mailto:" + CONTACT.email + "?subject=" +
      encodeURIComponent("Project enquiry from " + val("f-name")) + "&body=" + encodeURIComponent(out.value);
    document.getElementById("f-wa").href = "https://wa.me/447933005029?text=" + encodeURIComponent(out.value);
    send.textContent = "Or copy it and send it to " + CONTACT.phone + ". We reply the same day.";
    copied.textContent = "";
    res.hidden = false;
    res.scrollIntoView({block: "nearest"});
  }

  Array.prototype.forEach.call(document.querySelectorAll("a[data-type]"), function(a){
    a.addEventListener("click", function(){ document.getElementById("f-type").value = a.getAttribute("data-type"); });
  });

  document.getElementById("f-copy").addEventListener("click", function(){
    function fallback(){ out.focus(); out.select(); copied.textContent = "Selected. Press copy on your keyboard."; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out.value).then(function(){ copied.textContent = "Copied"; }, fallback);
    } else { fallback(); }
  });
})();
