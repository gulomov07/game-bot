
const courses = [
    {id:1,title:"Python Zero to Hero",category:"tech",icon:"🐍",color:"#dce9ff",price:"FREE",lessons:32,level:"BEGINNER",description:"Python dasturlashni noldan professional darajagacha o'rganing."},
    {id:2,title:"Modern Web Design",category:"creative",icon:"🎨",color:"#f3d9e8",price:"$19",lessons:24,level:"BEGINNER",description:"Zamonaviy web dizayn, ranglar va kompozitsiya sirlarini o'rganing."},
    {id:3,title:"JavaScript Advanced",category:"tech",icon:"⚡",color:"#f6e9b9",price:"$29",lessons:40,level:"ADVANCED",description:"JavaScript yordamida kuchli interaktiv loyihalar yarating."},
    {id:4,title:"Creative Photography",category:"creative",icon:"📸",color:"#d9e7e1",price:"$15",lessons:18,level:"INTERMEDIATE",description:"Professional fotografiya va vizual hikoya yaratish."},
    {id:5,title:"Digital Business",category:"business",icon:"📈",color:"#dce1ff",price:"$25",lessons:26,level:"BEGINNER",description:"Raqamli biznesni qurish va rivojlantirish asoslari."},
    {id:6,title:"UI/UX Masterclass",category:"creative",icon:"🖥️",color:"#eadbff",price:"$22",lessons:30,level:"INTERMEDIATE",description:"Figma, UX research va professional interfeys dizayni."},
    {id:7,title:"Artificial Intelligence",category:"tech",icon:"🤖",color:"#d6e9e8",price:"$35",lessons:38,level:"ADVANCED",description:"AI texnologiyalari va sun'iy intellekt asoslari."},
    {id:8,title:"Startup Academy",category:"business",icon:"🚀",color:"#f8dfc9",price:"$20",lessons:21,level:"BEGINNER",description:"Startap g'oyasidan haqiqiy loyihagacha bo'lgan yo'l."},
    {id:9,title:"Frontend Engineer",category:"tech",icon:"💻",color:"#d8e1ff",price:"$39",lessons:45,level:"ADVANCED",description:"Professional frontend dasturchi bo'lish uchun amaliy kurs."},
    {id:10,title:"Brand Identity",category:"creative",icon:"✳️",color:"#f5dbe0",price:"$18",lessons:22,level:"INTERMEDIATE",description:"Brend yaratish, logotip va vizual identifikatsiya."},
    {id:11,title:"Marketing Strategy",category:"business",icon:"📊",color:"#e0e7d5",price:"$24",lessons:27,level:"INTERMEDIATE",description:"Marketing strategiyalari va auditoriya bilan ishlash."},
    {id:12,title:"Cyber Security Basics",category:"tech",icon:"🔐",color:"#d9e2ec",price:"$28",lessons:34,level:"BEGINNER",description:"Raqamli xavfsizlik va internet himoyasi asoslari."}
];

let enrolled = JSON.parse(localStorage.getItem("nxEnrolled") || "[]");
let completed = JSON.parse(localStorage.getItem("nxCompleted") || "[]");
let favorites = JSON.parse(localStorage.getItem("nxFavorites") || "[]");
let xp = Number(localStorage.getItem("nxXP") || 0);

function save() {
    localStorage.setItem("nxEnrolled",JSON.stringify(enrolled));
    localStorage.setItem("nxCompleted",JSON.stringify(completed));
    localStorage.setItem("nxFavorites",JSON.stringify(favorites));
    localStorage.setItem("nxXP",xp);
}

function toast(message) {
    const box = document.getElementById("toast");
    box.textContent = message;
    box.classList.add("show");
    setTimeout(()=>box.classList.remove("show"),2500);
}

// COURSES

const grid = document.getElementById("courseGrid");
const search = document.getElementById("searchInput");
let activeCategory = "all";

function renderCourses() {
    const term = search.value.toLowerCase().trim();

    const list = courses.filter(course =>
        (activeCategory === "all" || course.category === activeCategory) &&
        course.title.toLowerCase().includes(term)
    );

    grid.innerHTML = "";

    document.getElementById("emptyMessage").style.display =
        list.length ? "none" : "block";

    list.forEach(course => {
        const isJoined = enrolled.includes(course.id);
        const isFav = favorites.includes(course.id);

        const card = document.createElement("article");
        card.className = "course-card";

        card.innerHTML = `
            <div class="course-cover" style="background:${course.color}">
                <small>${course.category.toUpperCase()}</small>
                ${course.icon}
                <button class="favorite ${isFav ? "active" : ""}" data-fav="${course.id}">${isFav ? "♥" : "♡"}</button>
            </div>
            <div class="course-info">
                <div class="course-meta">
                    <span>◷ ${course.lessons} LESSONS</span>
                    <span>${course.level}</span>
                </div>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-bottom">
                    <strong>${course.price}</strong>
                    <button data-open="${course.id}">${isJoined ? "CONTINUE ↗" : "EXPLORE ↗"}</button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

search.addEventListener("input",renderCourses);

document.getElementById("categories").addEventListener("click",e=>{
    const button = e.target.closest(".category");
    if(!button)return;

    document.querySelector(".category.active").classList.remove("active");
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderCourses();
});

// FAVORITES AND COURSE MODAL

grid.addEventListener("click",e=>{
    const fav = e.target.closest("[data-fav]");
    const open = e.target.closest("[data-open]");

    if(fav) {
        const id = Number(fav.dataset.fav);
        favorites = favorites.includes(id)
            ? favorites.filter(x=>x!==id)
            : [...favorites,id];

        save();
        renderCourses();
        toast("Favorites updated ♥");
    }

    if(open) openCourse(Number(open.dataset.open));
});

const modal = document.getElementById("courseModal");

function openCourse(id) {
    const course = courses.find(c=>c.id===id);
    if(!course)return;

    const joined = enrolled.includes(id);
    const done = completed.includes(id);

    document.getElementById("modalContent").innerHTML = `
        <div style="background:${course.color};padding:40px;text-align:center;font-size:75px">${course.icon}</div>
        <p style="margin-top:20px;color:var(--blue)">${course.category.toUpperCase()}</p>
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <p style="margin-top:15px">◷ ${course.lessons} Lessons<br><br>✦ ${course.level}<br><br>PRICE: ${course.price}</p>
        ${done ? "<button class='join-btn' disabled>COMPLETED ✓</button>" : joined ? "<button class='join-btn' id='finishCourse'>COMPLETE COURSE ✓</button>" : "<button class='join-btn' id='joinCourse'>JOIN COURSE ↗</button>"}
    `;

    modal.classList.add("show");

    document.getElementById("joinCourse")?.addEventListener("click",()=>{
        enrolled.push(id);
        save();
        updateDashboard();
        renderCourses();
        modal.classList.remove("show");
        toast("Welcome to your new course!");
    });

    document.getElementById("finishCourse")?.addEventListener("click",()=>{
        finishCourse(id);
        modal.classList.remove("show");
    });
}

document.getElementById("closeModal").addEventListener("click",()=>modal.classList.remove("show"));

modal.addEventListener("click",e=>{
    if(e.target===modal)modal.classList.remove("show");
});

// DASHBOARD

function finishCourse(id) {
    if(!enrolled.includes(id)||completed.includes(id))return;

    completed.push(id);
    xp+=100;
    save();
    updateDashboard();
    renderCourses();
    toast("Course completed! +100 XP 🏆");
}

function updateDashboard() {
    document.getElementById("enrolledCount").textContent=String(enrolled.length).padStart(2,"0");
    document.getElementById("completedCount").textContent=String(completed.length).padStart(2,"0");
    document.getElementById("xpCount").textContent=String(xp).padStart(3,"0");
    document.getElementById("levelCount").textContent=String(Math.floor(xp/200)+1).padStart(2,"0");

    const list=document.getElementById("learningList");

    if(!enrolled.length) {
        list.innerHTML="<div class='empty-learning'>No courses yet. Explore and join your first course.</div>";
        return;
    }

    list.innerHTML="";

    enrolled.forEach(id=>{
        const c=courses.find(x=>x.id===id);
        if(!c)return;

        const done=completed.includes(id);
        const item=document.createElement("div");
        item.className="learning-item";

        item.innerHTML=`
            <span class="learning-icon">${c.icon}</span>
            <div>
                <strong>${c.title}</strong>
                <p>${done?"COMPLETED":"IN PROGRESS"} · ${c.lessons} lessons</p>
            </div>
            <button data-finish="${id}" ${done?"disabled":""}>${done?"DONE ✓":"FINISH"}</button>
        `;

        list.appendChild(item);
    });
}

document.getElementById("learningList").addEventListener("click",e=>{
    const button=e.target.closest("[data-finish]");
    if(button)finishCourse(Number(button.dataset.finish));
});

// QUIZ

const questions=[
    {q:"Which language structures web pages?",a:["Python","HTML","SQL","Java"],c:1},
    {q:"What does CSS control?",a:["Database","Server","Visual design","Hardware"],c:2},
    {q:"Which is a JavaScript data type?",a:["Boolean","Website","Monitor","Folder"],c:0},
    {q:"What does UI stand for?",a:["User Interface","Universal Internet","Unique Input","User Information"],c:0},
    {q:"What is AI?",a:["Automatic Internet","Artificial Intelligence","Advanced Input","Application Interface"],c:1}
];

let qIndex=0;
let score=0;
let answered=false;

const qTitle=document.getElementById("question");
const answerBox=document.getElementById("answers");
const next=document.getElementById("nextBtn");
const feedback=document.getElementById("quizFeedback");

function renderQuestion() {
    const q=questions[qIndex];
    answered=false;

    qTitle.textContent=q.q;
    answerBox.innerHTML="";
    document.getElementById("quizNumber").textContent=`${String(qIndex+1).padStart(2,"0")} / 05`;
    document.getElementById("quizLine").style.width=((qIndex+1)/5*100)+"%";
    feedback.textContent="SELECT YOUR ANSWER";
    next.disabled=true;
    next.textContent=qIndex===4?"RESULT →":"NEXT →";

    q.a.forEach((answer,i)=>{
        const btn=document.createElement("button");
        btn.className="answer";
        btn.textContent=answer;
        btn.addEventListener("click",()=>selectAnswer(i));
        answerBox.appendChild(btn);
    });
}

function selectAnswer(index) {
    if(answered)return;
    answered=true;

    const correct=questions[qIndex].c;

    [...answerBox.children].forEach((btn,i)=>{
        btn.disabled=true;
        if(i===correct)btn.classList.add("correct");
        if(i===index&&i!==correct)btn.classList.add("wrong");
    });

    if(index===correct) {
        score++;
        feedback.textContent="CORRECT ANSWER +10 XP";
    } else {
        feedback.textContent="WRONG ANSWER";
    }

    next.disabled=false;
}

function showResult() {
    const points=score*10;
    xp+=points;
    save();
    updateDashboard();

    qTitle.textContent="CHALLENGE COMPLETED!";
    answerBox.innerHTML=`
        <div style="text-align:center;padding:25px">
            <div style="font-size:55px">🏆</div>
            <h2 style="font-size:35px;margin:15px">${score}/5</h2>
            <p style="color:var(--muted)">YOU EARNED ${points} XP</p>
        </div>
    `;

    feedback.textContent="YOUR RESULT IS SAVED";
    next.textContent="RESTART ↻";
    next.disabled=false;
    next.onclick=restartQuiz;
}

function restartQuiz() {
    qIndex=0;
    score=0;
    next.onclick=null;
    renderQuestion();
}

next.addEventListener("click",()=>{
    if(!answered)return;

    if(qIndex<4) {
        qIndex++;
        renderQuestion();
    } else {
        showResult();
    }
});

renderQuestion();

// THEME

const themeBtn=document.getElementById("themeBtn");

if(localStorage.getItem("nxTheme")==="dark") {
    document.body.classList.add("dark");
    themeBtn.textContent="☀";
}

themeBtn.addEventListener("click",()=>{
    document.body.classList.toggle("dark");
    const dark=document.body.classList.contains("dark");

    themeBtn.textContent=dark?"☀":"☾";
    localStorage.setItem("nxTheme",dark?"dark":"light");
});

// PROFILE

const profileBtn=document.getElementById("profileBtn");

function updateProfile() {
    const name=localStorage.getItem("nxName");
    profileBtn.textContent=name?name.toUpperCase().slice(0,14):"JOIN NEXORA ↗";
}

profileBtn.addEventListener("click",()=>{
    const oldName=localStorage.getItem("nxName")||"";
    const name=prompt("Enter your name:",oldName);

    if(name===null)return;

    if(!name.trim()) {
        toast("Please enter your name");
        return;
    }

    localStorage.setItem("nxName",name.trim());
    updateProfile();
    toast("Welcome to NEXORA!");
});

updateProfile();

// MOBILE MENU

const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");

menuBtn.addEventListener("click",()=>{
    nav.classList.toggle("open");
    menuBtn.textContent=nav.classList.contains("open")?"✕":"☰";
});

nav.querySelectorAll("a").forEach(a=>{
    a.addEventListener("click",()=>{
        nav.classList.remove("open");
        menuBtn.textContent="☰";
    });
});

// PAGE LOADING

window.addEventListener("load",()=>{
    setTimeout(()=>{
        document.getElementById("preloader").classList.add("hide");
    },500);
});

// INITIALIZE

renderCourses();
updateDashboard();
