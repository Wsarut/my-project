(function(){
    const STORAGE_KEY = "stagepassTicketSimulation";
    const DISMISSED_KEY = "stagepassTicketDismissedWindows";
    const DEFAULT_STATE = {
        attackLockBypass:false,
        attackBotBurst:false,
        inventoryConnected:false,
        purchaseControlled:false,
        history:[]
    };

    function loadState(){
        try{
            return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
        }catch(error){
            return Object.assign({}, DEFAULT_STATE);
        }
    }

    function saveState(state){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function clearState(){
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(DISMISSED_KEY);
    }

    function escapeHtml(value){
        const div = document.createElement("div");
        div.textContent = value || "";
        return div.innerHTML;
    }

    function currentEvent(){
        const params = new URLSearchParams(location.search);
        const id = params.get("id") || "neon";
        const events = window.TicketEvents || {};
        return { id:id, data:events[id] || events.neon || null };
    }

    function addHistory(state, title, detail){
        state.history = state.history || [];
        state.history.unshift({
            time:new Date().toLocaleTimeString("th-TH"),
            title:title,
            detail:detail
        });
        state.history = state.history.slice(0, 8);
    }

    function removeSimulationNodes(){
        document.querySelectorAll(".ticket-sim-node").forEach(function(node){
            node.remove();
        });
        document.body.classList.remove("sim-lock-bypass", "sim-bot-burst", "sim-inventory-connected", "sim-purchase-controlled");
    }

    function dismissedWindows(){
        try{
            return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || "[]");
        }catch(error){
            return [];
        }
    }

    function setWindowDismissed(id, dismissed){
        if(!id) return;
        const list = dismissedWindows().filter(function(item){ return item !== id; });
        if(dismissed) list.push(id);
        sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(list));
    }

    function isWindowDismissed(id){
        return id && dismissedWindows().includes(id);
    }

    function makeWindow(kind, title, body, options){
        const existingId = options && options.id;
        if(existingId && !options.force && isWindowDismissed(existingId)) return null;
        if(existingId){
            const old = document.getElementById(existingId);
            if(old) old.remove();
        }

        const node = document.createElement("section");
        node.className = "ticket-sim-node sim-float " + kind;
        if(existingId) node.id = existingId;
        node.style.left = (options && options.left ? options.left : 26) + "px";
        node.style.top = (options && options.top ? options.top : 92) + "px";
        node.innerHTML = `
            <div class="sim-float-head">
                <strong>${escapeHtml(title)}</strong>
                <button type="button" aria-label="ปิดหน้าจอจำลอง">×</button>
            </div>
            <div class="sim-float-body">${body}</div>
        `;
        document.body.appendChild(node);

        const closeButton = node.querySelector("button");
        closeButton.addEventListener("pointerdown", function(event){
            event.stopPropagation();
        });
        closeButton.addEventListener("click", function(event){
            event.preventDefault();
            event.stopPropagation();
            setWindowDismissed(existingId, true);
            node.remove();
        });
        makeDraggable(node, node.querySelector(".sim-float-head"));
        return node;
    }

    function makeDraggable(panel, handle){
        let dragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        handle.addEventListener("pointerdown", function(event){
            dragging = true;
            startX = event.clientX;
            startY = event.clientY;
            startLeft = panel.offsetLeft;
            startTop = panel.offsetTop;
            handle.setPointerCapture(event.pointerId);
        });

        handle.addEventListener("pointermove", function(event){
            if(!dragging) return;
            const nextLeft = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, startLeft + event.clientX - startX));
            const nextTop = Math.max(64, Math.min(window.innerHeight - panel.offsetHeight - 8, startTop + event.clientY - startY));
            panel.style.left = nextLeft + "px";
            panel.style.top = nextTop + "px";
        });

        handle.addEventListener("pointerup", function(event){
            dragging = false;
            try{ handle.releasePointerCapture(event.pointerId); }catch(error){}
        });
    }

    function markWindowOpen(id, force){
        if(force) setWindowDismissed(id, false);
    }

    function completeLoadingWindow(node, text){
        if(!node) return;
        const loader = node.querySelector(".sim-loader");
        if(loader){
            loader.classList.add("complete");
            loader.innerHTML = "✓";
        }
        const pendingSteps = node.querySelectorAll(".sim-check-steps span");
        pendingSteps.forEach(function(step){
            step.classList.add("done");
        });
        const final = node.querySelector(".sim-check-steps strong");
        if(final){
            final.classList.add("complete");
            if(text) final.textContent = text;
        }
    }

    function renderScanWindow(force){
        markWindowOpen("ticketSimScan", force);
        makeWindow("sim-scan", "Ticket Surface Scan", `
            <div class="sim-grid-mini">
                <span>Event page</span><strong>ซื้อบัตร + ราคา</strong>
                <span>Payment popup</span><strong>ข้อมูลผู้ซื้อ + ยืนยัน</strong>
                <span>Ticket lock</span><strong>จำลองสถานะรอชำระ</strong>
                <span>Inventory source</span><strong>จำนวนบัตรคงเหลือ</strong>
            </div>
            <p>ผลสำรวจนี้ใช้เป็นแผนที่สำหรับการจำลอง ไม่ได้เชื่อมต่อระบบภายนอกหรือธุรกรรมจริง</p>
        `, { id:"ticketSimScan", left:32, top:88, force:force });
    }

    function renderAttackLockWindow(state, force){
        const event = currentEvent();
        const name = event.data ? event.data.title : "Selected event";
        const blocked = state && state.inventoryConnected;
        markWindowOpen("ticketSimAttackLock", force);
        makeWindow("sim-attack" + (blocked ? " blocked" : ""), "Lock Bypass Console", `
            <div class="sim-alert ${blocked ? "blocked" : "danger"}">${blocked ? "GET BLOCKED: ตรวจพบ lock token ผิดปกติ" : "สถานะจำลอง: ข้ามขั้นตอนล็อกตั๋วก่อนชำระเงิน"}</div>
            <div class="sim-grid-mini">
                <span>อีเว้นท์</span><strong>${escapeHtml(name)}</strong>
                <span>Lock token</span><strong class="${blocked ? "blocked-text" : "danger-text"}">${blocked ? "quarantined / invalidated" : "ไม่พบการจับคู่คิว"}</strong>
                <span>Seat hold</span><strong>${blocked ? "hold ถูกดึงกลับไปตรวจสอบ" : "VIP Balcony / Seat 08"}</strong>
                <span>Inventory check</span><strong>${blocked ? "พบค่าที่ไม่ตรงกับแหล่งข้อมูลจำนวนตั๋ว" : "ยังไม่ถูกเทียบกับแหล่งข้อมูลหลัก"}</strong>
                <span>สถานะ</span><strong>${blocked ? "การข้ามขั้นตอนถูกขัดจังหวะ" : "ปุ่มซื้อดูเหมือนพร้อมใช้งาน ทั้งที่คิวล็อกตั๋วผิดลำดับ"}</strong>
            </div>
        `, { id:"ticketSimAttackLock", left:34, top:94, force:force });
    }

    function botRows(mitigated, animate){
        const total = animate ? 28 : (mitigated ? 6 : 28);
        return Array.from({ length:total }).map(function(_, index){
            const code = "BOT-" + (4100 + index * 37);
            const survivor = mitigated && index >= total - 6;
            const count = mitigated && survivor ? 2 + (index % 4) : 24 + index * 7;
            const className = animate && !survivor ? " class=\"to-ban\"" : (mitigated && !survivor ? " class=\"removed\"" : "");
            const status = mitigated && !survivor ? "banned" : count + " requests / 4 sec";
            return `<li${className}><span>${code}</span><strong>${status}</strong></li>`;
        }).join("");
    }

    function animateBotMitigation(node){
        if(!node) return;
        const targets = Array.from(node.querySelectorAll(".sim-bot-list li.to-ban"));
        const summary = node.querySelector(".sim-bot-summary");
        targets.forEach(function(item, index){
            setTimeout(function(){
                item.classList.add("banned");
                item.querySelector("strong").textContent = "banned";
                if(summary) summary.textContent = "กำลัง ban bot session: " + Math.min(index + 1, targets.length) + " / " + targets.length;
            }, 120 + index * 70);
            setTimeout(function(){
                item.classList.add("removed");
            }, 520 + index * 70);
        });
        setTimeout(function(){
            if(summary) summary.textContent = "เหลือ session ที่ requests ต่ำเพียงไม่กี่ตัว";
            node.classList.add("bot-contained");
        }, 760 + targets.length * 70);
    }

    function renderBotBurstWindow(state, force, animateMitigation){
        const mitigated = state && state.purchaseControlled;
        const rows = botRows(mitigated, animateMitigation);
        const alertText = mitigated ? "BOT CONTAINED: พบและ ban คำสั่งซื้ออัตโนมัติจำนวนมาก" : "พบพฤติกรรมจำลอง: คำสั่งซื้อจำนวนมากในช่วงเวลาสั้น";
        markWindowOpen("ticketSimBotBurst", force);
        const node = makeWindow("sim-attack bot" + (mitigated ? " blocked" : ""), "Auto Purchase Burst", `
            <div class="sim-alert ${mitigated ? "blocked" : "danger"}">${alertText}</div>
            <ul class="sim-bot-list">${rows}</ul>
            <p class="sim-bot-summary">${mitigated ? "กำลังบังคับยืนยันการซื้อและลด bot session ที่ผิดปกติ" : "รายการ request ถูกยิงเข้ามาพร้อมกันหลาย session จนดูเหมือนกวาดบัตรอย่างรวดเร็ว"}</p>
        `, { id:"ticketSimBotBurst", left:72, top:132, force:force });
        if(animateMitigation) animateBotMitigation(node);
    }

    function renderDefenseInventoryWindow(force){
        markWindowOpen("ticketSimDefenseInventory", force);
        const node = makeWindow("sim-defense", "Inventory Source Link", `
            <div class="sim-loader"></div>
            <div class="sim-check-steps">
                <span>เชื่อมต่อข้อมูลจำนวนบัตรหลัก</span>
                <span>เทียบยอดคงเหลือกับหน้าขาย</span>
                <span>ตรวจคำสั่งซื้อที่ลดจำนวนเร็วผิดปกติ</span>
                <strong>กำลังตรวจสอบ...</strong>
            </div>
        `, { id:"ticketSimDefenseInventory", left:96, top:104, force:force });
        setTimeout(function(){
            completeLoadingWindow(node, "เสร็จแล้ว: เปิดการเชื่อมต่อข้อมูลจำนวนตั๋ว");
        }, 1150);
    }

    function renderDefensePurchaseWindow(force){
        markWindowOpen("ticketSimDefensePurchase", force);
        const node = makeWindow("sim-defense purchase", "Purchase Confirmation Control", `
            <div class="sim-loader"></div>
            <div class="sim-check-steps">
                <span>ตรวจว่ามี ticket lock ที่ถูกต้องก่อนจ่ายเงิน</span>
                <span>ตรวจจำนวนบัตรต่อคำสั่งซื้อ</span>
                <span>บังคับยืนยันตัวตนก่อนออกบัตร</span>
                <strong>กำลังตรวจสอบ...</strong>
            </div>
        `, { id:"ticketSimDefensePurchase", left:132, top:142, force:force });
        setTimeout(function(){
            completeLoadingWindow(node, "เสร็จแล้ว: เปิดการควบคุมการยืนยันการซื้อ");
        }, 1350);
    }

    function renderRestoreWindow(previousState){
        const impact = [];
        if(previousState.attackLockBypass) impact.push("พบการข้ามการล็อกตั๋วในหน้าซื้อ");
        if(previousState.attackBotBurst) impact.push("พบคำสั่งซื้ออัตโนมัติจำนวนมากในช่วงสั้น");
        if(previousState.inventoryConnected) impact.push("เชื่อมต่อข้อมูลจำนวนตั๋วเพื่อเทียบยอดคงเหลือ");
        if(previousState.purchaseControlled) impact.push("เปิดการควบคุมยืนยันการซื้อก่อนออกบัตร");
        if(!impact.length) impact.push("ไม่มีผลจำลองค้างอยู่ก่อนกู้คืน");
        markWindowOpen("ticketSimRestore", true);
        const node = makeWindow("sim-defense restore", "Ticket Site Recovery", `
            <div class="sim-loader"></div>
            <div class="sim-check-steps restore-steps">
                <span>รวบรวมข้อมูลคำสั่งซื้อจำลอง</span>
                <span>ตรวจสถานะการล็อกตั๋วและที่นั่งค้าง</span>
                <span>จัดเก็บรายการ bot session ที่ถูกตรวจพบ</span>
                <span>คืนค่าจำนวนบัตรและสถานะยืนยันการซื้อ</span>
                <strong>กำลังจัดเก็บข้อมูลบัตรตั๋ว...</strong>
            </div>
            <p class="sim-restore-status">ระบบกำลังรวบรวมหลักฐานและกู้คืนข้อมูลจำลอง โปรดรอสักครู่</p>
        `, { id:"ticketSimRestore", left:62, top:94, force:true });

        const steps = node ? Array.from(node.querySelectorAll(".restore-steps span")) : [];
        steps.forEach(function(step, index){
            setTimeout(function(){
                step.classList.add("done");
            }, 700 + index * 650);
        });

        setTimeout(function(){
            completeLoadingWindow(node, "เสร็จแล้ว: กู้คืนหน้าเว็บขายตั๋ว");
            const status = node && node.querySelector(".sim-restore-status");
            if(status) status.textContent = "จัดเก็บข้อมูลบัตรตั๋วและกู้คืนสถานะจำลองเสร็จแล้ว";
        }, 3800);

        setTimeout(function(){
            if(node) node.remove();
            renderRecoverySummaryPopup(impact, previousState);
        }, 4400);
    }

    function renderRecoverySummaryPopup(impact, previousState){
        const attackCount = (previousState.attackLockBypass ? 1 : 0) + (previousState.attackBotBurst ? 1 : 0);
        const defenseCount = (previousState.inventoryConnected ? 1 : 0) + (previousState.purchaseControlled ? 1 : 0);
        const overlay = document.createElement("div");
        overlay.className = "ticket-sim-node sim-summary-overlay";
        overlay.innerHTML = `
            <section class="sim-official-summary" role="dialog" aria-modal="true" aria-labelledby="ticketRecoveryTitle">
                <button class="sim-summary-close" type="button" aria-label="ปิดสรุปผล">×</button>
                <h2 id="ticketRecoveryTitle">สรุปผลการจำลอง</h2>
                <p>ระบบได้กู้คืนหน้าเว็บขายตั๋วและล้างผลจำลองที่เกิดขึ้นกับขั้นตอนการล็อกตั๋ว จำนวนบัตร และการยืนยันการซื้อเรียบร้อยแล้ว</p>
                <div class="sim-official-grid">
                    <span>ผลกระทบที่ตรวจพบ</span><strong>${impact.length} รายการ</strong>
                    <span>รูปแบบการโจมตี</span><strong>${attackCount} รายการ</strong>
                    <span>มาตรการป้องกัน</span><strong>${defenseCount} รายการ</strong>
                    <span>สถานะหลังการกู้คืน</span><strong>พร้อมใช้งาน</strong>
                </div>
                <h3>รายละเอียด</h3>
                <ul>${impact.map(function(item){ return "<li>" + escapeHtml(item) + "</li>"; }).join("")}</ul>
                <button class="button secondary sim-summary-ok" type="button">ตกลง</button>
            </section>
        `;
        document.body.appendChild(overlay);
        overlay.querySelectorAll(".sim-summary-close, .sim-summary-ok").forEach(function(button){
            button.addEventListener("click", function(){
                overlay.remove();
            });
        });
    }

    function decorateEventPage(state){
        const infoBar = document.querySelector(".event-info-bar");
        const buyButton = document.getElementById("buyButton");
        if(!infoBar && !document.querySelector(".event-grid")) return;

        if(state.attackLockBypass){
            document.body.classList.add("sim-lock-bypass");
            if(infoBar){
                const detailStack = infoBar.querySelector(".detail-stack");
                if(detailStack && !detailStack.querySelector(".sim-seat-hold-note")){
                    detailStack.insertAdjacentHTML("beforeend", `
                        <span class="ticket-sim-node sim-seat-hold-note">ที่นั่งถูกพักไว้ชั่วคราว • เวลาจอง 00:00</span>
                    `);
                }
            }
            if(buyButton) buyButton.textContent = "ดำเนินการต่อ";
        }

        if(state.attackBotBurst){
            document.body.classList.add("sim-bot-burst");
            document.querySelectorAll(".event-card").forEach(function(card, index){
                card.insertAdjacentHTML("beforeend", `<span class="ticket-sim-node sim-card-badge">เหลือ ${Math.max(3, 28 - index * 3)} ใบ</span>`);
            });
        }

        if(state.inventoryConnected){
            document.body.classList.add("sim-inventory-connected");
            const target = infoBar ? infoBar.querySelector(".detail-stack") : document.querySelector(".search-hint");
            if(target && !target.querySelector(".sim-stock-refresh")){
                target.insertAdjacentHTML("beforeend", `
                    <span class="ticket-sim-node sim-stock-refresh">อัปเดตจำนวนบัตรล่าสุด ${new Date().toLocaleTimeString("th-TH", { hour:"2-digit", minute:"2-digit" })}</span>
                `);
            }
        }

        if(state.purchaseControlled){
            document.body.classList.add("sim-purchase-controlled");
            if(buyButton) buyButton.textContent = "เลือกบัตรและชำระเงิน";
            decoratePaymentForm();
        }
    }

    function decoratePaymentForm(){
        const paymentForm = document.getElementById("paymentForm");
        if(!paymentForm || paymentForm.querySelector(".sim-confirm-guard")) return;
        paymentForm.insertAdjacentHTML("afterbegin", `
            <div class="ticket-sim-node sim-confirm-guard">
                <strong>ยืนยันข้อมูลบัตรก่อนดำเนินการ</strong>
                <span>ตรวจสอบข้อมูลผู้ซื้อและรายละเอียดบัตรให้ครบถ้วน</span>
            </div>
        `);
    }

    function applyVisualState(forceEffect){
        const state = loadState();
        removeSimulationNodes();
        decorateEventPage(state);
        if(state.attackLockBypass) renderAttackLockWindow(state, forceEffect === "attack-lock-bypass" || forceEffect === "defense-inventory-connect");
        if(state.attackBotBurst) renderBotBurstWindow(state, forceEffect === "attack-bot-burst" || forceEffect === "defense-purchase-control", forceEffect === "defense-purchase-control");
        if(state.inventoryConnected) renderDefenseInventoryWindow(forceEffect === "defense-inventory-connect");
        if(state.purchaseControlled) renderDefensePurchaseWindow(forceEffect === "defense-purchase-control");
    }

    function applyEffect(effect, payload){
        const state = loadState();
        if(effect === "scan-surface"){
            renderScanWindow(true);
            return;
        }

        if(effect === "attack-lock-bypass"){
            state.attackLockBypass = true;
            addHistory(state, "ข้ามการล็อกตั๋ว", "หน้าซื้อแสดงอาการ ticket lock ผิดลำดับ");
        }

        if(effect === "attack-bot-burst"){
            state.attackBotBurst = true;
            addHistory(state, "ซื้อตั๋วอัตโนมัติจำนวนมาก", "ยอดบัตรลดลงเร็วและมี bot request จำลอง");
        }

        if(effect === "defense-inventory-connect"){
            state.inventoryConnected = true;
            addHistory(state, "เชื่อมต่อข้อมูลจำนวนตั๋ว", "เทียบยอดคงเหลือกับแหล่งข้อมูลหลัก");
        }

        if(effect === "defense-purchase-control"){
            state.purchaseControlled = true;
            addHistory(state, "ควบคุมการยืนยันการซื้อ", "บังคับตรวจ ticket lock และตัวตนก่อนออกบัตร");
        }

        if(effect === "defense-restore-ticket"){
            const previousState = Object.assign({}, state);
            clearState();
            removeSimulationNodes();
            renderRestoreWindow(previousState);
            return;
        }

        saveState(state);
        applyVisualState(effect);
    }

    window.addEventListener("message", function(event){
        const data = event.data || {};
        if(data.source !== "ticket-lab" || data.action !== "ticket-sim") return;
        applyEffect(data.effect, data.payload || {});
    });

    document.addEventListener("click", function(event){
        if(event.target && event.target.id === "buyButton"){
            setTimeout(function(){
                const state = loadState();
                if(state.purchaseControlled) decoratePaymentForm();
            }, 30);
        }
    });

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", applyVisualState);
    }else{
        applyVisualState();
    }
})();
