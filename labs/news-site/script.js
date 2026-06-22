const LAB_STATE_KEY = "newsLabSimulationState";

let originalArticle = "";
let defenseMode = false;

document.addEventListener("DOMContentLoaded", function(){
    const article = document.querySelector(".article");
    if(article) originalArticle = article.innerHTML;

    injectLabStyles();
    bindCommentForm();
    applyStoredState();
});

window.addEventListener("message", function(event){
    const data = typeof event.data === "string" ? { action:event.data } : event.data;
    if(!data || !data.action) return;

    if(data.action === "ATTACK_NEWS"){
        if(defenseMode) return addForensicNote("blocked: manual filter is active");
        saveAttack({ kind:"news-edit", detail:data.detail || {} });
        applyStoredState();
    }

    if(data.action === "ATTACK_AD"){
        if(defenseMode) return addForensicNote("blocked: suspicious ad injection was filtered");
        saveAttack({ kind:"ad-loop", detail:data.detail || {} });
        applyStoredState();
    }

    if(data.action === "DEFENSE_INSPECT"){
        addForensicNote("inspection: symptoms found in article integrity and ad slot behavior");
    }

    if(data.action === "DEFENSE_TRACE"){
        markSuspiciousElements();
        addForensicNote("trace: source points to modified content and injected ad slot");
    }

    if(data.action === "DEFENSE_ISOLATE"){
        isolateAdSlot();
        addForensicNote("containment: suspicious ad slot isolated from click actions");
    }

    if(data.action === "DEFENSE_FILTER"){
        defenseMode = true;
        setDefenseMode(true);
        isolateAdSlot();
        addForensicNote("manual filter active: future suspicious commands will be blocked");
    }

    if(data.action === "DEFENSE_RESTORE"){
        defenseMode = true;
        localStorage.removeItem(LAB_STATE_KEY);
        setDefenseMode(true);
        restorePage();
        addForensicNote("verified restore: content baseline restored and ad slot cleared");
    }

    if(data.action === "RESET"){
        defenseMode = false;
        localStorage.removeItem(LAB_STATE_KEY);
        setDefenseMode(false);
        restorePage();
    }
});

function bindCommentForm(){
    const textarea = document.querySelector(".comment-box textarea");
    const button = document.querySelector(".comment-box button");
    if(!textarea || !button) return;

    button.onclick = function(){
        const div = document.createElement("div");
        div.className = "comment";
        div.textContent = "Guest: " + textarea.value;
        document.querySelector(".article").appendChild(div);
        textarea.value = "";
    };
}

function getState(){
    try{
        return JSON.parse(localStorage.getItem(LAB_STATE_KEY)) || { attacks:[], defense:false };
    }catch(error){
        return { attacks:[], defense:false };
    }
}

function setState(state){
    localStorage.setItem(LAB_STATE_KEY, JSON.stringify(state));
}

function setDefenseMode(value){
    const state = getState();
    state.defense = value;
    setState(state);
}

function saveAttack(attack){
    const state = getState();
    const signature = JSON.stringify(attack);
    const attacks = state.attacks.filter(function(item){
        return JSON.stringify(item) !== signature;
    });

    attacks.push(attack);
    setState({ attacks:attacks, defense:false, updatedAt:new Date().toISOString() });
    defenseMode = false;
}

function applyStoredState(){
    const state = getState();
    defenseMode = Boolean(state.defense);
    clearTransientMarkers();

    state.attacks.forEach(function(attack){
        if(attack.kind === "news-edit") applyNewsEdit(attack.detail);
        if(attack.kind === "ad-loop") applyAdInjection(attack.detail);
    });

    if(defenseMode){
        addForensicNote("manual filter active");
    }
}

function currentPageKey(){
    const file = location.pathname.split("/").pop();
    if(file === "politics.html") return "politics";
    if(file === "economy.html") return "economy";
    if(file === "sport.html") return "sport";
    if(file === "entertainment.html") return "entertainment";
    return "home";
}

function pageMatches(page){
    return page === "all" || page === currentPageKey();
}

function applyNewsEdit(detail){
    if(!pageMatches(detail.page || "home")) return;

    const article = document.querySelector(".article");
    if(!article) return;

    const payload = detail.payload || "รายงานพิเศษ: แหล่งข่าวยืนยันข้อมูลใหม่";
    const field = detail.field || "headline";

    if(field === "headline"){
        const heading = article.querySelector("h2");
        if(heading) mutateText(heading, payload, "headline changed after publish");
    }

    if(field === "lead"){
        const lead = article.querySelector(".lead") || article.querySelector("p");
        if(lead) mutateText(lead, payload, "lead paragraph changed after publish");
    }

    if(field === "body"){
        const paragraphs = article.querySelectorAll("p");
        const target = paragraphs.length > 1 ? paragraphs[1] : paragraphs[0];
        if(target) mutateText(target, payload, "body paragraph changed after publish");
    }

    addForensicNote("content diff: " + readableField(field) + " modified on " + currentPageKey());
}

function mutateText(node, text, note){
    if(!node.dataset.originalText) node.dataset.originalText = node.textContent;
    node.textContent = text;
    node.classList.add("lab-modified-text");
    node.dataset.labMutation = note;
}

function applyAdInjection(detail){
    const slot = document.querySelector(".related") || document.querySelector(".sidebar-box") || document.querySelector(".article");
    if(!slot || document.querySelector("[data-lab-marker='ad-loop']")) return;

    const ad = document.createElement("button");
    ad.type = "button";
    ad.className = "lab-strange-ad-icon";
    ad.dataset.labMarker = "ad-loop";
    ad.innerHTML = "<span class=\"lab-ad-eye\">◉</span><span class=\"lab-ad-text\">OPEN</span>";
    ad.title = "suspicious floating ad";
    ad.addEventListener("click", showLoopingSite);
    document.body.appendChild(ad);
    makeDraggable(ad);

    const marker = document.createElement("div");
    marker.className = "lab-ad-slot-marker";
    marker.dataset.labMarker = "ad-slot-marker";
    marker.textContent = "ad slot anomaly: floating campaign object injected";
    slot.appendChild(marker);

    addForensicNote("ad slot changed: movable floating campaign injected");
}

function showLoopingSite(){
    if(document.querySelector(".lab-loop-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "lab-loop-overlay";
    overlay.innerHTML = `
        <div class="lab-loop-shell">
            <button class="lab-loop-close" type="button">ปิด</button>
            <div class="lab-loop-status">loading external site... 0%</div>
            <div class="lab-loop-bars"><span></span><span></span><span></span></div>
            <div class="lab-loop-screen">
                <div class="lab-loop-message">reloading mirror... please wait...</div>
            </div>
            <iframe class="lab-nested-frame" title="strange nested site" srcdoc='
                <html>
                <head>
                <style>
                body{margin:0;background:#d8ffe5;color:#052b19;font-family:Arial;overflow:hidden;filter:hue-rotate(42deg) contrast(1.2)}
                .wrap{min-height:100vh;padding:18px;transform:skew(-3deg);animation:pulse 1.25s infinite alternate;background:radial-gradient(circle at 20% 30%,#fff 0,#d8ffe5 22%,#74b77b 58%,#0b3d24 100%)}
                h1{font-size:30px;margin:0 0 12px;letter-spacing:4px;text-shadow:2px 2px #baffc7}
                p{line-height:1.6;background:rgba(255,255,255,.66);padding:8px;border-left:5px solid #008c42;transform:rotate(-1deg)}
                .glitch{font-family:Consolas,monospace;margin:12px 0;color:#031;animation:blink .35s infinite alternate}
                iframe{width:82%;height:120px;border:3px double #0b7a3b;margin-left:18px;filter:blur(.45px) saturate(1.8);transform:rotate(.7deg)}
                @keyframes pulse{from{transform:scale(1) skew(-3deg)}to{transform:scale(1.035) skew(3deg)}}
                @keyframes blink{from{opacity:.38}to{opacity:1}}
                </style>
                </head>
                <body>
                <div class="wrap">
                <h1>VERIFYING NEWS ACCESS</h1>
                <p>redirect loop detected... the page is trying to open itself again.</p>
                <div class="glitch">mirror://news-copy/loading/loading/loading</div>
                <iframe srcdoc="<body style=&quot;background:#efffed;font-family:Arial;color:#064;transform:skew(2deg);&quot;><h3>loading copy of site</h3><p>mirror inside mirror inside mirror</p><iframe style=&quot;width:80%;height:42px;border:2px solid #080&quot; srcdoc=&quot;still loading...&quot;></iframe></body>"></iframe>
                </div>
                </body>
                </html>'></iframe>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = overlay.querySelector(".lab-loop-close");
    const status = overlay.querySelector(".lab-loop-status");
    const screen = overlay.querySelector(".lab-loop-screen");
    const nestedFrame = overlay.querySelector(".lab-nested-frame");
    let percent = 0;
    let cycle = 0;
    const timer = setInterval(function(){
        percent = percent + 17;
        if(percent >= 100){
            cycle += 1;
            percent = 0;
            status.textContent = "reload loop detected... retry " + cycle;
        }else{
            status.textContent = "loading external site... " + percent + "%";
        }

        if(cycle >= 3){
            screen.classList.add("hidden");
            nestedFrame.classList.add("visible");
            status.textContent = "external site opened inside this site";
        }

        if(!document.body.contains(overlay)) clearInterval(timer);
    }, 450);

    close.onclick = function(){
        overlay.remove();
        clearInterval(timer);
    };
}

function makeDraggable(node){
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let moved = false;

    node.addEventListener("pointerdown", function(event){
        dragging = true;
        moved = false;
        offsetX = event.clientX - node.getBoundingClientRect().left;
        offsetY = event.clientY - node.getBoundingClientRect().top;
        node.setPointerCapture(event.pointerId);
    });

    node.addEventListener("pointermove", function(event){
        if(!dragging) return;
        moved = true;
        node.style.left = Math.max(8, Math.min(window.innerWidth - node.offsetWidth - 8, event.clientX - offsetX)) + "px";
        node.style.top = Math.max(8, Math.min(window.innerHeight - node.offsetHeight - 8, event.clientY - offsetY)) + "px";
        node.style.right = "auto";
        node.style.bottom = "auto";
    });

    node.addEventListener("pointerup", function(event){
        dragging = false;
        node.releasePointerCapture(event.pointerId);
        if(moved){
            event.preventDefault();
            event.stopPropagation();
        }
    });
}

function markSuspiciousElements(){
    document.querySelectorAll(".lab-modified-text,[data-lab-marker='ad-loop']").forEach(function(node){
        node.classList.add("lab-suspect-outline");
    });
}

function isolateAdSlot(){
    document.querySelectorAll("[data-lab-marker='ad-loop']").forEach(function(node){
        node.classList.add("lab-isolated-ad");
        node.disabled = true;
        node.innerHTML = "<span class=\"lab-ad-eye\">×</span><span class=\"lab-ad-text\">BLOCKED</span>";
    });
}

function addForensicNote(text){
    const article = document.querySelector(".article") || document.body;
    const note = document.createElement("div");
    note.className = "lab-audit-hint";
    note.dataset.labMarker = "forensic-note";
    note.textContent = text;
    article.appendChild(note);
}

function restorePage(){
    const article = document.querySelector(".article");
    clearTransientMarkers();
    if(article && originalArticle) article.innerHTML = originalArticle;
    bindCommentForm();
}

function clearTransientMarkers(){
    document.querySelectorAll("[data-lab-marker]").forEach(function(node){ node.remove(); });
    document.querySelectorAll(".lab-modified-text").forEach(function(node){
        if(node.dataset.originalText) node.textContent = node.dataset.originalText;
        node.classList.remove("lab-modified-text","lab-suspect-outline");
        delete node.dataset.originalText;
        delete node.dataset.labMutation;
    });
    document.querySelectorAll(".lab-loop-overlay").forEach(function(node){ node.remove(); });
}

function readableField(field){
    const names = { headline:"headline", lead:"lead", body:"body" };
    return names[field] || field;
}

function injectLabStyles(){
    if(document.getElementById("labSimulationStyles")) return;
    const style = document.createElement("style");
    style.id = "labSimulationStyles";
    style.textContent = `
        .lab-modified-text{background:linear-gradient(transparent 66%, rgba(255,235,59,.42) 66%)}
        .lab-audit-hint{margin-top:12px;color:#555;font-family:Consolas,"Courier New",monospace;font-size:12px;border-top:1px dashed #bbb;padding-top:8px}
        .lab-suspect-outline{outline:2px dashed rgba(239,108,0,.75);outline-offset:3px}
        .lab-strange-ad-icon{position:fixed;right:26px;bottom:34px;z-index:7000;width:82px;height:82px;border-radius:18px 36px 20px 34px;border:2px solid #0b7a3b;background:radial-gradient(circle at 35% 30%,#fff 0,#c9ffd6 22%,#20a65a 58%,#073d24 100%);color:#062b19;cursor:grab;box-shadow:0 10px 26px rgba(0,0,0,.24),0 0 16px rgba(46,255,123,.32);transform:rotate(-7deg);animation:labAdFloat 1.8s infinite alternate}
        .lab-strange-ad-icon:active{cursor:grabbing}
        .lab-ad-eye{display:block;font-size:34px;line-height:30px;text-shadow:2px 1px #baffc7}
        .lab-ad-text{display:block;font-family:Consolas,"Courier New",monospace;font-size:11px;margin-top:5px;letter-spacing:1px}
        .lab-ad-slot-marker{margin-top:12px;padding:9px;border:1px dashed #83a98d;color:#4b6652;font-family:Consolas,"Courier New",monospace;font-size:12px;background:#f7fff7}
        .lab-isolated-ad{opacity:.7;cursor:not-allowed;background:#f1f1f1;color:#555;animation:none;box-shadow:none}
        .lab-loop-overlay{position:fixed;inset:0;background:rgba(4,30,16,.82);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px}
        .lab-loop-shell{width:min(760px,92vw);height:min(560px,86vh);background:#f3fff2;border:4px solid #0b7a3b;box-shadow:0 0 38px rgba(34,255,120,.25);position:relative;padding:18px;box-sizing:border-box;animation:labDrift 2s infinite alternate}
        .lab-loop-shell iframe{width:100%;height:calc(100% - 76px);border:2px solid #075c2d;background:white;display:none}
        .lab-loop-shell iframe.visible{display:block}
        .lab-loop-screen{height:calc(100% - 76px);border:2px solid #075c2d;background:repeating-linear-gradient(0deg,#eaffed,#eaffed 10px,#d1f7d8 10px,#d1f7d8 20px);display:flex;align-items:center;justify-content:center;color:#063;font-family:Consolas,"Courier New",monospace;animation:labScreenPulse .45s infinite alternate}
        .lab-loop-screen.hidden{display:none}
        .lab-loop-message{background:rgba(255,255,255,.7);padding:12px 18px;border:1px solid #0b7a3b;transform:rotate(-1deg)}
        .lab-loop-close{position:absolute;right:12px;top:10px;background:#0b7a3b;color:white;border:0;padding:7px 12px;cursor:pointer}
        .lab-loop-status{font-family:Consolas,"Courier New",monospace;color:#063;margin:8px 0 14px}
        .lab-loop-bars{display:flex;gap:6px;margin-bottom:12px}
        .lab-loop-bars span{height:8px;flex:1;background:#0b7a3b;animation:labBar .8s infinite alternate}
        .lab-loop-bars span:nth-child(2){animation-delay:.2s}.lab-loop-bars span:nth-child(3){animation-delay:.4s}
        @keyframes labAdFloat{from{transform:translateY(0) rotate(-7deg) scale(1)}to{transform:translateY(-7px) rotate(6deg) scale(1.04)}}
        @keyframes labBar{from{opacity:.25;transform:scaleX(.4)}to{opacity:1;transform:scaleX(1)}}
        @keyframes labScreenPulse{from{filter:brightness(1)}to{filter:brightness(1.18) hue-rotate(20deg)}}
        @keyframes labDrift{from{transform:translateY(0) skew(-.5deg)}to{transform:translateY(-3px) skew(.5deg)}}
    `;
    document.head.appendChild(style);
}
