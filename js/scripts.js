document.addEventListener("DOMContentLoaded", () => {

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });


    // Highlight Active Nav Link
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.style.color = "#ff4d4d";
            link.style.fontWeight = "bold";
        }
    });



    // Animated Stats Counter
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

    // Trigger stats when visible
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


    // Scroll Reveal 
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

// Page Transition Animation
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



    // Back to Top Button
    const backToTop = document.createElement("button");

    backToTop.innerText = "↑";
    backToTop.style.position = "fixed";
    backToTop.style.bottom = "600px";
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



// Light Dark mode toggler
const themeBtn = document.createElement("button");

themeBtn.innerText = "☀️";
themeBtn.style.position = "fixed";
themeBtn.style.top = "150px";
themeBtn.style.right = "20px";
themeBtn.style.bottom = "auto";
themeBtn.style.padding = "10px";
themeBtn.style.border = "none";
themeBtn.style.borderRadius = "8px";
themeBtn.style.cursor = "pointer";

document.body.appendChild(themeBtn);

// Load saved mode
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


const regForm = document.getElementById("registrationForm");

if (regForm) {
    regForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const age = document.getElementById("age").value.trim();
        const weight = document.getElementById("weight").value.trim();
        const plan = document.getElementById("plan").value;

        const gender = document.querySelector('input[name="gender"]:checked')?.value;

        const goals = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            goals.push(cb.value);
        });

        if (!name || !email || !age || !plan || !gender || !weight || !username) {
            alert("Please fill all required fields");
            return;
        }
        if (goals.length === 0) {
            document.getElementById("goalsGroup").style.border = "2px solid red";
            return;
        }

        console.log({
            name,
            username,
            email,
            age,
            weight,
            plan,
            gender,
            goals,
            notes
        });

        alert("Registration successful 💪");

        regForm.reset();
    });
}
});