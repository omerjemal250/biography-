$(document).ready(function(){

  // INIT EMAILJS
  (function(){
    emailjs.init("YOUR_PUBLIC_KEY");
  })();

  // THEME SYSTEM
  function setTheme(theme){
    if(theme === "dark"){
      $("body").addClass("dark");
      $("#themeToggle").text("☀️");
    } else {
      $("body").removeClass("dark");
      $("#themeToggle").text("🌙");
    }
  }

  let savedTheme = localStorage.getItem("theme");

  if(savedTheme){
    setTheme(savedTheme);
  } else {
    let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  $("#themeToggle").click(function(){
    let newTheme = $("body").hasClass("dark") ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // LOAD PROJECTS
  function loadProjects(){
    $.getJSON("projects.json", function(data){
      let html = "";

      data.forEach(project => {
        html += `
          <div class="col-md-4 mb-4">
            <div class="card project-card">
              <img src="${project.image}" class="card-img-top auto-img">
              <div class="card-body">
                <h5>${project.title}</h5>
                <p>${project.description}</p>
              </div>
            </div>
          </div>
        `;
      });

      $("#project-container").html(html);

      // Detect icons
      $(".auto-img").each(function(){
        let src = $(this).attr("src");
        if(src.includes("icon") || src.includes("logo")){
          $(this).addClass("icon");
        }
      });
    });
  }

  loadProjects();

  // CONTACT FORM WITH AUTO REPLY
  $("#contactForm").submit(function(e){
    e.preventDefault();

    let form = this;

    emailjs.sendForm("YOUR_SERVICE_ID", "template_admin", form)
    .then(function(){
      return emailjs.sendForm("YOUR_SERVICE_ID", "template_reply", form);
    })
    .then(function(){
      $("#responseMsg").html(
        "<span class='text-success'>Message sent! Check your email 📩</span>"
      );
      form.reset();
    })
    .catch(function(error){
      $("#responseMsg").html(
        "<span class='text-danger'>Failed to send</span>"
      );
      console.error(error);
    });
  });

});