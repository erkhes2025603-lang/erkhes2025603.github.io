document.addEventListener("DOMContentLoaded", () => {

    // SMOOTH SCROLLING (EVENT LISTENERS)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // ACTIVE NAV LINK HIGHLIGHT
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.style.color = "#ff4d4d";
            link.style.fontWeight = "bold";
        }
    });

    // ANIMATED STATS COUNTER
    const stats = document.querySelectorAll(".stat strong");

    const animateStats = () => {
        stats.forEach(stat => {
            let target = stat.getAttribute("data-target");
            if (!target) return;

            target = parseInt(target);

            let startTime = null;
            let duration = 1500;

            function update(currentTime) {
                if (!startTime) startTime = currentTime;

                let progress = currentTime - startTime;
                let percent = Math.min(progress / duration, 1);

                let value = Math.floor(percent * target);
                stat.innerText = value + "+";

                if (percent < 1) {
                    requestAnimationFrame(update);
                } else {
                    stat.innerText = target + "+";
                }
            }

            requestAnimationFrame(update);
        });
    };

    const statsSection = document.querySelector(".welcome-stats");

    if (statsSection) {
        const statsObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateStats();
                statsObserver.disconnect();
            }
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // SCROLL REVEAL
    const revealElements = document.querySelectorAll(
        ".welcome-content, .stat, .plan-money, .why article"
    );

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();

            if (rect.top < window.innerHeight - 100) {
                el.classList.add("show");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    // PAGE TRANSITION
    const links = document.querySelectorAll("a[href]");

    links.forEach(link => {
        if (link.hostname === window.location.hostname && !link.href.includes("#")) {
            link.addEventListener("click", function(e) {
                e.preventDefault();

                const url = this.href;

                document.body.classList.add("fade-out");

                setTimeout(() => {
                    window.location.href = url;
                }, 250);
            });
        }
    });

    // BACK TO TOP BUTTON
    const backToTop = document.createElement("button");

    backToTop.innerText = "↑";
    backToTop.style.position = "fixed";
    backToTop.style.bottom = "20px";
    backToTop.style.right = "20px";
    backToTop.style.padding = "10px 15px";
    backToTop.style.fontSize = "18px";
    backToTop.style.display = "none";
    backToTop.style.cursor = "pointer";
    backToTop.style.border = "none";
    backToTop.style.borderRadius = "8px";
    backToTop.style.background = "#ff4d4d";
    backToTop.style.color = "white";

    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // LIGHT / DARK MODE
    const themeBtn = document.createElement("button");

    themeBtn.innerText = "☀️";
    themeBtn.style.position = "fixed";
    themeBtn.style.top = "150px";
    themeBtn.style.right = "20px";
    themeBtn.style.padding = "10px";
    themeBtn.style.border = "none";
    themeBtn.style.borderRadius = "8px";
    themeBtn.style.cursor = "pointer";

    document.body.appendChild(themeBtn);

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        themeBtn.innerText = "🌙";
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
            themeBtn.innerText = "🌙";
        } else {
            localStorage.setItem("theme", "dark");
            themeBtn.innerText = "☀️";
        }
    });

    // FORM HANDLING 
    const regForm = document.getElementById("registrationForm");

    if (regForm) {

        // SUBMIT EVENT LISTENER
        regForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // EXTRACT VALUES (DOM API)
            const name = document.getElementById("name").value.trim();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const age = document.getElementById("age").value.trim();
            const weight = document.getElementById("weight").value.trim();
            const notes = document.getElementById("notes").value.trim();

            const planElement = document.querySelector('input[name="plan"]:checked');
            const genderElement = document.querySelector('input[name="gender"]:checked');

            const plan = planElement ? planElement.value : null;
            const gender = genderElement ? genderElement.value : null;

            // CHECKBOX LOOP
            const goals = [];
            const goalCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');

            for (let i = 0; i < goalCheckboxes.length; i++) {
                goals.push(goalCheckboxes[i].value);
            }

            // VALIDATION (CONDITIONALS)
            if (name === "" || username === "" || email === "") {
                alert("Please fill all text fields");
                return;
            }

            if (!age || !weight) {
                alert("Enter age and weight");
                return;
            }

            if (!plan) {
                alert("Select a plan");
                return;
            }

            if (!gender) {
                alert("Select a gender");
                return;
            }

            if (goals.length === 0) {
                goals.push("None");
            }

            // STORE DATA OBJECT
            const userData = {
                Name: name,
                Username: username,
                Email: email,
                Age: age,
                Weight: weight + " kg",
                Gender: gender,
                Goals: goals.join(", "),
                Plan: plan,
                Notes: notes === "" ? "None" : notes
            };

            // SAVE DATA
            localStorage.setItem("gymData", JSON.stringify(userData));

            // REDIRECT TO TABLE PAGE
            window.location.href = "result.html";
        });

        // EXTRA EVENT LISTENER 
        regForm.addEventListener("reset", () => {
            console.log("Form reset");
        });
    }

// RESULT PAGE TABLE GENERATION
const table = document.getElementById("dataTable");

if (table) {

    // Get stored data
    const data = JSON.parse(localStorage.getItem("gymData"));

    // CONDITIONAL 
    if (!data) {
        table.innerHTML = "<tr><td>No data found</td></tr>";
        return;
    }

    // CREATE HEADER (2 COLUMNS)
    const headerRow = document.createElement("tr");

    const th1 = document.createElement("th");
    th1.textContent = "Field";

    const th2 = document.createElement("th");
    th2.textContent = "Value";

    headerRow.appendChild(th1);
    headerRow.appendChild(th2);
    table.appendChild(headerRow);

    // LOOP THROUGH DATA
    for (let key in data) {

        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        const cell2 = document.createElement("td");

        cell1.textContent = key;
        cell2.textContent = data[key];

        row.appendChild(cell1);
        row.appendChild(cell2);

        table.appendChild(row);
    }
}
});
function toggleDetails(card) {
    card.classList.toggle("active");
}
