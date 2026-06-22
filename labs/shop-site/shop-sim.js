const SHOP_SIM_KEY = "greenNestShopSimulation";
const SHOP_ATTACK_POS_KEY = "greenNestShopAttackMirrorPosition";
const SHOP_DEFENSE_POS_KEY = "greenNestShopDefenseMirrorPosition";

document.addEventListener("DOMContentLoaded", function(){
    injectShopSimStyles();
    applyShopSimulation();
});

window.addEventListener("message", function(event){
    const data = typeof event.data === "string" ? { action:event.data } : event.data;
    if(!data || !data.action) return;

    if(data.action === "ATTACK_CUSTOMER_DATA"){
        addSimulationState("attacks", "customer-data");
    }

    if(data.action === "ATTACK_ACCOUNT_CHANGE"){
        addSimulationState("attacks", "account-change");
    }

    if(data.action === "ATTACK_CHECKOUT_BYPASS"){
        addSimulationState("attacks", "checkout-bypass");
    }

    if(data.action === "DEFENSE_PRICE_VALIDATE"){
        addSimulationState("defenses", "price-validation");
    }

    if(data.action === "DEFENSE_AUTH_FORCE"){
        addSimulationState("defenses", "force-auth");
    }

    if(data.action === "DEFENSE_ORDER_SEQUENCE"){
        addSimulationState("defenses", "order-sequence");
    }

    if(data.action === "SHOP_SIM_RESET"){
        localStorage.removeItem(SHOP_SIM_KEY);
        clearShopSimulation();
    }
});

function getSimulationState(){
    try{
        return JSON.parse(localStorage.getItem(SHOP_SIM_KEY)) || { attacks:[], defenses:[] };
    }catch(error){
        return { attacks:[], defenses:[] };
    }
}

function setSimulationState(state){
    localStorage.setItem(SHOP_SIM_KEY, JSON.stringify(state));
}

function addSimulationState(group, value){
    const state = getSimulationState();
    if(!state[group].includes(value)){
        state[group].push(value);
    }
    setSimulationState(state);
    applyShopSimulation();
}

function applyShopSimulation(){
    clearShopSimulation();
    const state = getSimulationState();

    if(state.attacks.length){
        showAttackMirror(state.attacks);
    }

    if(state.defenses.length){
        showDefenseMirror(state.defenses, state.attacks);
    }

    if(state.attacks.length || state.defenses.length){
        document.body.classList.add("shop-sim-compromised");
    }
}

function clearShopSimulation(){
    document.querySelectorAll("[data-shop-sim]").forEach(function(node){
        node.remove();
    });
    document.body.classList.remove("shop-sim-compromised");
}

function showAttackMirror(attacks){
    const mirror = document.createElement("aside");
    mirror.className = "shop-sim-nested-browser shop-sim-attack-browser";
    mirror.dataset.shopSim = "attack-mirror";
    mirror.innerHTML = `
        <div class="shop-sim-browser-chrome" data-drag-handle>
            <span class="dot red"></span>
            <span class="dot amber"></span>
            <span class="dot green"></span>
            <strong>greennest.session/mirror</strong>
            <em>reload loop</em>
        </div>
        <div class="shop-sim-recursive-view attack-view">
            <div class="shop-sim-mini-page">
                <div class="mini-bar"></div>
                <div class="mini-hero"></div>
                <div class="mini-grid"><span></span><span></span><span></span></div>
                <div class="shop-sim-mini-page nested">
                    <div class="mini-bar"></div>
                    <div class="mini-hero"></div>
                    <div class="mini-grid"><span></span><span></span><span></span></div>
                </div>
            </div>
        </div>
        <div class="shop-sim-feed">
            ${attacks.map(renderAttackSection).join("")}
        </div>
    `;

    document.body.appendChild(mirror);
    restoreMirrorPosition(mirror, SHOP_ATTACK_POS_KEY);
    enableMirrorDrag(mirror, SHOP_ATTACK_POS_KEY);
}

function showDefenseMirror(defenses, attacks){
    const mirror = document.createElement("aside");
    mirror.className = "shop-sim-nested-browser shop-sim-defense-browser";
    mirror.dataset.shopSim = "defense-mirror";
    mirror.innerHTML = `
        <div class="shop-sim-browser-chrome defense-chrome" data-drag-handle>
            <span class="shield-dot"></span>
            <strong>commerce-defense.console</strong>
            <em>protection scan</em>
        </div>
        <div class="shop-sim-defense-terminal">
            <div class="terminal-line"><span class="x-mark">×</span> web protection layer separated from attack mirror</div>
            <div class="terminal-line"><span class="loader"></span> loading staged checks...</div>
        </div>
        <div class="shop-sim-feed">
            ${defenses.map(function(defense){ return renderDefenseSection(defense, attacks); }).join("")}
        </div>
    `;

    document.body.appendChild(mirror);
    restoreMirrorPosition(mirror, SHOP_DEFENSE_POS_KEY);
    enableMirrorDrag(mirror, SHOP_DEFENSE_POS_KEY);
    animateDefenseSteps(mirror);
}

function renderAttackSection(attack){
    if(attack === "customer-data"){
        return `
            <section class="shop-sim-feed-card">
                <h3>Customer Data Preview</h3>
                <p>ข้อมูลลูกค้าถูกแยกออกมาแสดงผ่านหน้าจอซ้อนของระบบ</p>
                <table>
                    <tr><th>ID</th><th>Email</th><th>พื้นที่จัดส่ง</th></tr>
                    <tr><td>GN-1021</td><td>nida@example.test</td><td>Bangkok</td></tr>
                    <tr><td>GN-1044</td><td>bank@example.test</td><td>Chiang Mai</td></tr>
                    <tr><td>GN-1088</td><td>ploy@example.test</td><td>Khon Kaen</td></tr>
                </table>
            </section>
        `;
    }

    if(attack === "account-change"){
        return `
            <section class="shop-sim-feed-card">
                <h3>บัญชีลูกค้าถูกแก้ไข</h3>
                <p>โปรไฟล์ลูกค้าถูกเปลี่ยนข้อมูลจัดส่งและช่องทางติดต่อ</p>
                <div class="shop-sim-change-grid">
                    <span>ชื่อเดิม</span><strong>Nida Green</strong>
                    <span>ชื่อใหม่</span><strong>N. Changed</strong>
                    <span>ที่อยู่ใหม่</span><strong>404 Unknown Green Alley</strong>
                    <span>อีเมลใหม่</span><strong>changed-user@example.test</strong>
                </div>
            </section>
        `;
    }

    if(attack === "checkout-bypass"){
        return `
            <section class="shop-sim-feed-card payment">
                <h3>Payment Approved</h3>
                <p>คำสั่งซื้อถูกผลักเข้าสถานะอนุมัติผ่านเส้นทางที่ไม่ผ่านลำดับตรวจสอบครบถ้วน</p>
                <div class="shop-sim-receipt">
                    <p>Order ID: GN-7781</p>
                    <p>Status: Paid without verification</p>
                    <p>Gateway: bypass-demo.local</p>
                    <p>Cart total: ฿1,325</p>
                </div>
            </section>
        `;
    }

    return "";
}

function renderDefenseSection(defense, attacks){
    const foundAttack = attacks.length ? "พบค่าข้อมูลที่เปลี่ยนแปลงจากสถานะปกติ" : "ไม่พบผลโจมตีค้างอยู่ แต่ยังตรวจครบตามขั้นตอน";

    if(defense === "price-validation"){
        return `
            <section class="shop-sim-feed-card defense">
                <h3><span class="shield-mark">×</span> Price Validation Firewall</h3>
                <p>${foundAttack}: กำลังเทียบราคาสินค้า ยอดรวม ค่าจัดส่ง และยอดชำระกับตารางสินค้าหลัก หากพบยอดไม่ตรง ระบบจะย้อนกลับค่าเดิม</p>
                ${renderDefenseSteps(["โหลดรายการสินค้า", "เทียบราคาจาก product catalog", "ล็อกยอดรวมที่ไม่ตรง", "คืนค่า checkout summary"])}
            </section>
        `;
    }

    if(defense === "force-auth"){
        return `
            <section class="shop-sim-feed-card defense">
                <h3><span class="shield-mark">×</span> Identity Enforcement</h3>
                <p>${foundAttack}: พบการแตะข้อมูลบัญชีหรือที่อยู่จัดส่ง ระบบจึงตรวจ session สิทธิ์ผู้ใช้ และบังคับยืนยันตัวตนก่อนให้แก้ข้อมูลต่อ</p>
                ${renderDefenseSteps(["อ่าน session token", "ตรวจสิทธิ์แก้ไขโปรไฟล์", "ปิดช่องทางเปลี่ยนบัญชี", "ทำเครื่องหมายให้ยืนยันตัวตนใหม่"])}
            </section>
        `;
    }

    if(defense === "order-sequence"){
        return `
            <section class="shop-sim-feed-card defense">
                <h3><span class="shield-mark">×</span> Order Sequence Guard</h3>
                <p>${foundAttack}: คำสั่งซื้อถูกบังคับให้ย้อนกลับไปผ่าน cart, account, price validation และ checkout summary ตามลำดับก่อนอนุมัติ</p>
                ${renderDefenseSteps(["ตรวจตะกร้า", "ตรวจบัญชีลูกค้า", "ตรวจยอดชำระ", "ยืนยันลำดับคำสั่งซื้อ"])}
            </section>
        `;
    }

    return "";
}

function renderDefenseSteps(steps){
    return `
        <ol class="shop-sim-defense-steps">
            ${steps.map(function(step, index){
                return `<li class="loading" style="--step:${index}"><span class="loader"></span><span>${step}</span></li>`;
            }).join("")}
        </ol>
    `;
}

function animateDefenseSteps(mirror){
    mirror.querySelectorAll(".shop-sim-defense-steps li").forEach(function(item, index){
        setTimeout(function(){
            item.classList.remove("loading");
            item.classList.add("done");
            const icon = item.querySelector(".loader");
            if(icon){
                icon.outerHTML = '<span class="confirm">✓</span>';
            }
        }, 700 + index * 620);
    });
}

function restoreMirrorPosition(mirror, storageKey){
    try{
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if(!saved) return;
        mirror.style.left = saved.left + "px";
        mirror.style.top = saved.top + "px";
        mirror.style.right = "auto";
    }catch(error){
        return;
    }
}

function enableMirrorDrag(mirror, storageKey){
    const handle = mirror.querySelector("[data-drag-handle]");
    if(!handle) return;

    let startX = 0;
    let startY = 0;
    let baseLeft = 0;
    let baseTop = 0;
    let dragging = false;

    function pointerPoint(event){
        const touch = event.touches && event.touches[0];
        return { x:touch ? touch.clientX : event.clientX, y:touch ? touch.clientY : event.clientY };
    }

    function startDrag(event){
        const point = pointerPoint(event);
        const rect = mirror.getBoundingClientRect();
        dragging = true;
        startX = point.x;
        startY = point.y;
        baseLeft = rect.left;
        baseTop = rect.top;
        mirror.style.left = rect.left + "px";
        mirror.style.top = rect.top + "px";
        mirror.style.right = "auto";
        mirror.classList.add("dragging");
        event.preventDefault();
    }

    function moveDrag(event){
        if(!dragging) return;
        const point = pointerPoint(event);
        const rect = mirror.getBoundingClientRect();
        const nextLeft = Math.max(6, Math.min(window.innerWidth - rect.width - 6, baseLeft + point.x - startX));
        const nextTop = Math.max(6, Math.min(window.innerHeight - 46, baseTop + point.y - startY));
        mirror.style.left = nextLeft + "px";
        mirror.style.top = nextTop + "px";
        event.preventDefault();
    }

    function endDrag(){
        if(!dragging) return;
        dragging = false;
        mirror.classList.remove("dragging");
        const rect = mirror.getBoundingClientRect();
        localStorage.setItem(storageKey, JSON.stringify({ left:Math.round(rect.left), top:Math.round(rect.top) }));
    }

    handle.addEventListener("mousedown", startDrag);
    handle.addEventListener("touchstart", startDrag, { passive:false });
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("touchmove", moveDrag, { passive:false });
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
}

function injectShopSimStyles(){
    if(document.getElementById("shopSimulationStyles")) return;

    const style = document.createElement("style");
    style.id = "shopSimulationStyles";
    style.textContent = `
        .shop-sim-compromised{outline:4px solid rgba(198,40,40,.16);outline-offset:-4px}
        .shop-sim-nested-browser{position:fixed;z-index:9000;width:min(430px,calc(100vw - 36px));max-height:calc(100vh - 96px);overflow:auto;background:#101512;color:#edf8ef;border:1px solid #6ee18d;box-shadow:0 22px 55px rgba(0,0,0,.38);font-size:13px}
        .shop-sim-attack-browser{right:18px;top:68px}
        .shop-sim-defense-browser{left:18px;top:88px;border-color:#7fd2ff;background:#071017;color:#e6f7ff}
        .shop-sim-nested-browser.dragging{user-select:none;box-shadow:0 28px 70px rgba(0,0,0,.48)}
        .shop-sim-browser-chrome{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:12px 12px 12px 1fr auto;align-items:center;gap:7px;background:#06100a;border-bottom:1px solid rgba(110,225,141,.42);padding:9px 10px;cursor:move}
        .defense-chrome{grid-template-columns:18px 1fr auto;background:#06141d;border-bottom-color:rgba(127,210,255,.46)}
        .shop-sim-browser-chrome .dot{width:9px;height:9px;border-radius:50%;display:block}
        .shop-sim-browser-chrome .red{background:#ff5f56}
        .shop-sim-browser-chrome .amber{background:#ffbd2e}
        .shop-sim-browser-chrome .green{background:#27c93f}
        .shield-dot{width:14px;height:14px;border:1px solid #7fd2ff;border-radius:50%;box-shadow:0 0 0 3px rgba(127,210,255,.15)}
        .shop-sim-browser-chrome strong{font-family:Consolas,"Courier New",monospace;font-size:12px;color:#d6ffe0}
        .defense-chrome strong{color:#d9f4ff}
        .shop-sim-browser-chrome em{font-style:normal;font-size:11px;color:#9df0ac;animation:shopSimBlink 1s steps(2,end) infinite}
        .defense-chrome em{color:#9fdcff}
        .shop-sim-recursive-view{padding:14px;background:radial-gradient(circle at 20% 10%,rgba(110,225,141,.25),transparent 34%),linear-gradient(135deg,#08110b,#18251d)}
        .shop-sim-defense-terminal{padding:12px;background:linear-gradient(135deg,#071017,#10202b);border-bottom:1px solid rgba(127,210,255,.25);font-family:Consolas,"Courier New",monospace;font-size:12px;display:grid;gap:8px}
        .terminal-line{display:grid;grid-template-columns:22px 1fr;align-items:center;color:#d9f4ff}
        .x-mark{display:grid;place-items:center;width:17px;height:17px;border:1px solid #7fd2ff;border-radius:50%;color:#7fd2ff;font-weight:700}
        .shop-sim-mini-page{position:relative;min-height:132px;border:1px solid rgba(214,255,224,.45);background:#f8fff9;color:#102315;box-shadow:inset 0 0 0 4px rgba(31,122,77,.09);padding:10px;overflow:hidden}
        .shop-sim-mini-page:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(31,122,77,.06),rgba(31,122,77,.06) 2px,transparent 2px,transparent 7px);pointer-events:none;animation:shopSimScan 1.6s linear infinite}
        .shop-sim-mini-page.nested{position:absolute;right:18px;bottom:14px;width:54%;min-height:74px;transform:rotate(-1.5deg);box-shadow:0 12px 28px rgba(0,0,0,.22)}
        .mini-bar{height:12px;background:#1f7a4d;margin-bottom:10px}
        .mini-hero{height:42px;background:linear-gradient(90deg,#cfe8d4,#eef8ef);margin-bottom:10px}
        .mini-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .mini-grid span{height:32px;background:#d8eadb}
        .shop-sim-feed{display:grid;gap:10px;padding:12px;background:#0c130f}
        .shop-sim-defense-browser .shop-sim-feed{background:#071017}
        .shop-sim-feed-card{border:1px solid rgba(110,225,141,.42);background:rgba(255,255,255,.06);padding:12px}
        .shop-sim-feed-card h3{display:flex;align-items:center;gap:8px;margin:0 0 6px;color:#d6ffe0;font-size:15px}
        .shop-sim-feed-card p{margin:0 0 10px;color:#bed6c4;line-height:1.55}
        .shop-sim-defense-browser .shop-sim-feed-card p{color:#c9e8f4}
        .shop-sim-feed-card table{width:100%;border-collapse:collapse;font-family:Consolas,"Courier New",monospace;font-size:11px}
        .shop-sim-feed-card th,.shop-sim-feed-card td{border-top:1px solid rgba(214,255,224,.18);padding:6px;text-align:left}
        .shop-sim-change-grid{display:grid;grid-template-columns:88px 1fr;gap:6px 10px;font-family:Consolas,"Courier New",monospace}
        .shop-sim-change-grid span{color:#91b89b}
        .shop-sim-change-grid strong{color:#fff;font-weight:600}
        .shop-sim-feed-card.payment{border-color:#ffbd2e}
        .shop-sim-feed-card.defense{border-color:#7fd2ff;background:rgba(25,86,120,.26)}
        .shield-mark{display:inline-grid;place-items:center;width:20px;height:20px;border:1px solid #7fd2ff;border-radius:50%;color:#7fd2ff;font-weight:700;line-height:1}
        .shop-sim-receipt{font-family:Consolas,"Courier New",monospace;background:#050806;border:1px dashed rgba(255,189,46,.68);padding:10px;color:#ffe8ad}
        .shop-sim-receipt p{margin:4px 0;color:#ffe8ad}
        .shop-sim-defense-steps{display:grid;gap:7px;margin:10px 0 0;padding:0;list-style:none}
        .shop-sim-defense-steps li{display:grid;grid-template-columns:22px 1fr;align-items:center;gap:8px;color:#e8fff0;font-family:Consolas,"Courier New",monospace;font-size:12px}
        .loader{width:14px;height:14px;border:2px solid rgba(214,255,224,.25);border-top-color:#7fd2ff;border-radius:50%;animation:shopSimSpin .9s linear infinite}
        .confirm{display:grid;place-items:center;width:16px;height:16px;border-radius:50%;background:#7fd2ff;color:#06202d;font-weight:700}
        @keyframes shopSimBlink{50%{opacity:.22}}
        @keyframes shopSimScan{to{transform:translateY(14px)}}
        @keyframes shopSimSpin{to{transform:rotate(360deg)}}
        @media (max-width:720px){
            .shop-sim-nested-browser{left:12px;right:12px;top:58px;width:auto}
            .shop-sim-defense-browser{top:96px}
        }
    `;
    document.head.appendChild(style);
}
