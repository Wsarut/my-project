(function(){
    "use strict";

    document.documentElement.dataset.challengeBridge = "ready";

    function injectStyle(){
        if(document.getElementById("challengeBridgeStyle")){
            return;
        }
        const style = document.createElement("style");
        style.id = "challengeBridgeStyle";
        style.textContent = `
            .cb-mark{box-shadow:inset 0 -5px 0 rgba(255,190,45,.2)!important}
            .cb-drift{outline:0!important;box-shadow:none!important;filter:saturate(.82)}
            .cb-ghost{opacity:.72!important;filter:saturate(.65) contrast(.94)!important}
            .cb-sold{opacity:.56!important;filter:grayscale(.72)!important}
            .cb-last-ticket{box-shadow:inset 0 0 0 2px rgba(255,190,45,.38)!important}
            .cb-sold-button{background:#777!important;border-color:#777!important;cursor:not-allowed!important}
            .cb-status{position:fixed;right:20px;bottom:20px;z-index:2147483645;width:min(360px,calc(100vw - 40px));border:1px solid rgba(20,105,52,.45);background:rgba(250,255,251,.96);box-shadow:0 16px 42px rgba(0,0,0,.24);padding:12px 14px;font:13px/1.5 Arial,sans-serif;color:#173a22;animation:cbIn .3s ease both}
            .cb-status.alert{border-color:rgba(185,35,35,.58);color:#501b1b;background:rgba(255,247,245,.97)}
            .cb-status strong{display:block;margin-bottom:5px;color:#11612c;letter-spacing:.03em}
            .cb-status.alert strong{color:#a11d1d}
            .cb-pill{display:inline-block;margin:5px 5px 0 0;padding:3px 7px;border-radius:999px;background:#fff0b4;color:#6b4200;font-size:11px}
            .cb-count{display:inline-block;margin:5px 5px 0 0;padding:3px 7px;border-radius:999px;background:#ffe1df;color:#8d1e1e;font-size:11px}
            .cb-glitch{position:fixed;left:0;right:0;top:34%;height:8px;z-index:2147483644;pointer-events:none;background:rgba(203,30,30,.38);box-shadow:0 0 18px rgba(203,30,30,.45);animation:cbGlitch 1.2s steps(2,end) infinite}
            .cb-restored{outline:0!important;box-shadow:inset 0 -3px 0 rgba(35,145,69,.22)!important}
            @keyframes cbIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
            @keyframes cbGlitch{0%,100%{transform:translateY(0);opacity:.25}35%{transform:translateY(80px);opacity:.72}70%{transform:translateY(-42px);opacity:.38}}
        `;
        document.head.appendChild(style);
    }

    function first(selectors){
        for(const selector of selectors){
            const node = document.querySelector(selector);
            if(node){
                return node;
            }
        }
        return null;
    }

    function panel(html, alert){
        const parser = document.createElement("div");
        parser.innerHTML = html;
        const heading = parser.querySelector("strong");
        if(window.parent && window.parent !== window){
            window.parent.postMessage({
                type:"challenge:internal-event",
                title:heading ? heading.textContent : "internal event",
                detail:parser.textContent.replace(heading ? heading.textContent : "", "").trim(),
                level:alert ? "alert" : "watch"
            }, "*");
        }
    }

    function glitch(active){
        let node = document.getElementById("challengeBridgeGlitch");
        if(active && !node){
            node = document.createElement("div");
            node.id = "challengeBridgeGlitch";
            node.className = "cb-glitch";
            document.body.appendChild(node);
        }else if(!active && node){
            node.remove();
        }
    }

    function badgeTargets(selector, text, limit){
        document.querySelectorAll(selector).forEach(function(node, index){
            if(index >= limit || node.querySelector(".cb-count")){
                return;
            }
            node.classList.add("cb-drift");
            const badge = document.createElement("span");
            badge.className = "cb-count";
            badge.textContent = text(index);
            node.appendChild(badge);
        });
    }

    function setAvailability(card, text, sold){
        if(!card){
            return;
        }
        const body = card.matches(".event-body") ? card : card.querySelector(".event-body") || card;
        let badge = body.querySelector(".cb-count");
        if(!badge){
            badge = document.createElement("span");
            badge.className = "cb-count";
            body.appendChild(badge);
        }
        badge.textContent = text;
        card.classList.toggle("cb-sold", sold);
        card.classList.toggle("cb-last-ticket", !sold);
        if(sold && !card.dataset.cbSoldBound){
            card.dataset.cbSoldBound = "true";
            card.addEventListener("click", function(event){
                if(card.classList.contains("cb-sold")){
                    event.preventDefault();
                }
            });
        }
    }

    function updateTicketDetailAvailability(stage){
        const button = document.getElementById("buyButton");
        if(!button){
            return;
        }
        const eventId = new URLSearchParams(location.search).get("id") || "luna";
        if(stage === 1){
            button.textContent = "เหลือไม่ถึง 5 ใบ - เลือกบัตร";
            return;
        }
        if(eventId === "sierra"){
            button.disabled = false;
            button.classList.remove("cb-sold-button");
            button.textContent = "เหลือ 1 ใบ - เลือกบัตรทันที";
        }else{
            button.disabled = true;
            button.classList.add("cb-sold-button");
            button.textContent = "บัตรขายหมดแล้ว";
        }
    }

    function updateTicketOversellDetail(stage, targetIds){
        const button = document.getElementById("buyButton");
        if(!button){
            return;
        }
        const eventId = new URLSearchParams(location.search).get("id") || "luna";
        const targeted = targetIds.includes(eventId);
        if(!targeted){
            return;
        }
        button.disabled = true;
        button.classList.add("cb-sold-button");
        button.textContent = stage >= 2 ? "ขายเกินจำนวน / ปิดการซื้อ" : "ตั๋วคงเหลือ 0 ใบ";
    }

    function applyNewsContent(stage){
        const headline = first([".article h2", ".hero h2", "main h2", "h2"]);
        if(stage >= 1 && headline){
            headline.classList.add("cb-mark");
            headline.textContent = "ความจริงที่พวกเขาไม่อยากให้คุณเห็น กำลังถูกซ่อนจากคนทั้งเมือง";
        }
        if(stage >= 2){
            const paragraph = first([".article p:nth-of-type(3)", ".article p:nth-of-type(2)", "main p"]);
            if(paragraph){
                paragraph.classList.add("cb-drift");
                paragraph.textContent = "อย่ามัวรอคำยืนยัน คนที่บอกให้ใจเย็นกำลังช่วยกันปิดความจริง แชร์เรื่องนี้ออกไปให้มากที่สุดก่อนทุกอย่างจะถูกลบ";
            }
            panel("<strong>Integrity mismatch</strong> เนื้อหาบางส่วนไม่ตรงกับ editorial baseline<span class='cb-pill'>article drift</span><span class='cb-pill'>source unknown</span>", true);
        }
        if(stage >= 3){
            const breaking = first([".breaking marquee", ".breaking"]);
            if(breaking){
                breaking.classList.add("cb-drift");
                breaking.textContent = "ใครยังนิ่งเฉยก็เท่ากับยอมให้ทุกอย่างพัง แชร์ต่อเดี๋ยวนี้ก่อนจะสายเกินไป";
            }
            glitch(true);
        }
    }

    function applyNewsHome(stage){
        const hero = first([".hero h2", "main h1", "h1", "h2"]);
        if(stage >= 1 && hero){
            hero.classList.add("cb-mark");
            hero.textContent = "พวกเขาหลอกคุณมานานพอแล้ว ถึงเวลาทวงคืนความจริงด้วยตัวเอง";
        }
        if(stage >= 2){
            document.querySelectorAll(".card h4, aside p strong").forEach(function(node, index){
                if(index < 4){
                    node.classList.add("cb-drift");
                    node.textContent = index % 2 === 0 ? "คนที่ไม่แชร์กำลังเข้าข้างผู้ปิดบังความจริง" : "หยุดเชื่อคำชี้แจงเดิม ทุกอย่างแย่กว่าที่พวกเขายอมรับ";
                }
            });
            panel("<strong>Homepage module drift</strong> หลายบล็อกเปลี่ยนพร้อมกันนอก publish queue<span class='cb-pill'>cache path</span>", true);
        }
        if(stage >= 3){
            const brand = first([".navbar", ".brand", "header"]);
            if(brand){
                brand.classList.add("cb-drift");
            }
            glitch(true);
        }
    }

    function applyShopLeak(stage){
        if(stage >= 1){
            const account = first(["a[href*='login']", ".nav-link", "header a"]);
            if(account){
                account.classList.add("cb-mark");
                account.textContent = "สวัสดี Narin K.";
            }
            panel("<strong>Cache trace</strong> customer session fragment appears outside account view<span class='cb-pill'>cust_1842</span>", false);
        }
        if(stage >= 2){
            const account = first(["a[href*='login']", ".nav-link", "header a"]);
            if(account){
                account.classList.add("cb-mark");
                account.textContent = "Narin K. / ที่อยู่จัดส่งล่าสุด";
            }
            panel("<strong>Customer data preview</strong> Narin K. / narin.store@example.test<br>last order: Everyday Cup x2<span class='cb-count'>address token</span><span class='cb-count'>cart session</span>", true);
        }
        if(stage >= 3){
            document.body.classList.add("cb-ghost");
            glitch(true);
        }
    }

    function applyShopOrder(stage){
        const price = first([".price", ".price-text", "[class*='price']", ".product-card strong"]);
        if(stage >= 1 && price){
            price.classList.add("cb-mark");
            price.textContent = "฿1 ราคาพิเศษเฉพาะรอบนี้";
            panel("<strong>Order validator delayed</strong> server-price response arrived after order state update", false);
        }
        if(stage >= 2){
            badgeTargets(".product-card, .cart-item, article, .card", function(index){return index === 0 ? "ชำระแล้ว" : "ยอดรวม ฿0";}, 2);
            panel("<strong>Checkout route anomaly</strong> คำสั่งซื้อบางรายการข้ามลำดับตรวจราคาและสถานะ<span class='cb-count'>non-checkout write</span>", true);
        }
        if(stage >= 3){
            glitch(true);
            panel("<strong>Payment state pressure</strong> รายการจำลองถูกทำเครื่องหมาย approved ก่อน validation ครบ", true);
        }
    }

    function applyTicketOversell(stage, targetIds){
        const targets = targetIds && targetIds.length ? targetIds : ["luna"];
        const targetCards = Array.from(document.querySelectorAll(".event-card")).filter(function(card){
            const href = card.getAttribute("href") || "";
            return targets.some(function(id){ return href.includes("id=" + id); });
        });
        if(stage >= 1){
            targetCards.forEach(function(card){
                setAvailability(card, "เหลือ 0 ใบ", true);
            });
            updateTicketOversellDetail(1, targets);
            panel("<strong>Targeted inventory drain</strong> พบการดึงตั๋วออกจากอีเวนต์เป้าหมาย " + targets.length + " รายการ", false);
        }
        if(stage >= 2){
            targetCards.forEach(function(card){
                const href = card.getAttribute("href") || "";
                const targetIndex = Math.max(0, targets.findIndex(function(id){ return href.includes("id=" + id); }));
                setAvailability(card, "ขายเกิน " + (18 + targetIndex * 7) + " ใบ", true);
            });
            updateTicketOversellDetail(2, targets);
            panel("<strong>Ticket inventory mismatch</strong> inventory ของเป้าหมายถูกดึงจนต่ำกว่าศูนย์<span class='cb-count'>targeted oversell</span>", true);
        }
        if(stage >= 3){
            targetCards.forEach(function(card){
                card.classList.add("cb-drift");
            });
            updateTicketOversellDetail(3, targets);
            panel("<strong>Target ledger exhausted</strong> reserve pool ของอีเวนต์เป้าหมายถูกใช้จนหมด", true);
        }
    }

    function applyTicketRapid(stage){
        const cards = Array.from(document.querySelectorAll(".event-card"));
        if(stage >= 1){
            cards.forEach(function(card, index){
                if(index < Math.ceil(cards.length * .55)){
                    setAvailability(card, index % 2 === 0 ? "เหลือ 3 ใบ" : "กำลังมีคนเลือกบัตร", false);
                }
            });
            updateTicketDetailAvailability(1);
            panel("<strong>Purchase pressure</strong> request frequency rising above human pattern<span class='cb-pill'>weak identity</span>", false);
        }
        if(stage >= 2){
            const remainingCard = document.querySelector(".all-event-grid .event-card:last-child") || cards[cards.length - 1];
            cards.forEach(function(card){
                setAvailability(card, card === remainingCard ? "เหลือ 1 ใบ" : "ขายหมด", card !== remainingCard);
            });
            updateTicketDetailAvailability(2);
            panel("<strong>Rapid buyout pattern</strong> ผู้ใช้ทั่วไปเริ่มเสียช่วงเวลาซื้อให้ session ที่ยิงคำขอถี่", true);
        }
        if(stage >= 3){
            cards.forEach(function(card){
                if(!card.classList.contains("cb-last-ticket")){
                    card.classList.add("cb-ghost");
                }
            });
            updateTicketDetailAvailability(3);
            glitch(true);
        }
    }

    function applyStage(state){
        injectStyle();
        const scenario = state.scenario;
        const stage = Number(state.stage) || 1;
        const path = location.pathname.toLowerCase();
        const siteType = path.includes("news-site") ? "news" : path.includes("shop-site") ? "shop" : path.includes("ticket-site") ? "ticket" : "unknown";
        if(siteType !== "unknown" && !String(scenario).startsWith(siteType + "-")){
            return;
        }
        if(scenario === "news-content-drift") applyNewsContent(stage);
        else if(scenario === "news-homepage-drift") applyNewsHome(stage);
        else if(scenario === "shop-data-leak") applyShopLeak(stage);
        else if(scenario === "shop-order-anomaly") applyShopOrder(stage);
        else if(scenario === "ticket-oversell") applyTicketOversell(stage, Array.isArray(state.targets) ? state.targets : []);
        else if(scenario === "ticket-rapid-buyout") applyTicketRapid(stage);
    }

    function resetBridge(){
        document.querySelectorAll(".cb-status,.cb-glitch").forEach(function(node){node.remove();});
        document.querySelectorAll(".cb-mark,.cb-drift,.cb-ghost").forEach(function(node){
            node.classList.remove("cb-mark", "cb-drift", "cb-ghost");
        });
    }

    window.addEventListener("message", function(event){
        const data = event.data || {};
        if(data.type === "challenge:stage"){
            const state = {scenario:data.scenario, stage:data.stage, targets:data.targets};
            applyStage(state);
        }else if(data.type === "challenge:defense"){
            panel("<strong>Defense response</strong> " + String(data.message || "control applied"), false);
            document.querySelectorAll(".cb-drift").forEach(function(node){
                node.classList.remove("cb-drift");
                node.classList.add("cb-restored");
            });
            glitch(false);
        }else if(data.type === "challenge:overlay"){
            panel(String(data.html || "system trace"), data.alert === true);
        }else if(data.type === "challenge:reset"){
            resetBridge();
        }
    });

    if(window.parent && window.parent !== window){
        window.parent.postMessage({type:"challenge:bridge-ready"}, "*");
    }
})();
