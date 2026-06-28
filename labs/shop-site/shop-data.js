const THERMOS_IMAGE = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eef8ef"/>
      <stop offset="1" stop-color="#cfe8d4"/>
    </linearGradient>
    <linearGradient id="cup" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fefefe"/>
      <stop offset="0.45" stop-color="#9fc6ac"/>
      <stop offset="1" stop-color="#1f7a4d"/>
    </linearGradient>
  </defs>
  <rect width="700" height="700" fill="url(#bg)"/>
  <ellipse cx="350" cy="590" rx="170" ry="28" fill="#9bb8a1" opacity=".35"/>
  <rect x="258" y="118" width="184" height="62" rx="20" fill="#104c2f"/>
  <rect x="238" y="168" width="224" height="360" rx="54" fill="url(#cup)" stroke="#123b28" stroke-width="10"/>
  <rect x="278" y="90" width="144" height="42" rx="16" fill="#1f7a4d" stroke="#123b28" stroke-width="8"/>
  <path d="M292 218c34-24 88-25 119-2" fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round" opacity=".55"/>
  <path d="M282 280h136" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity=".4"/>
  <path d="M282 330h136" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity=".28"/>
  <text x="350" y="430" text-anchor="middle" font-family="Arial" font-size="42" font-weight="700" fill="#ffffff">THERMO</text>
  <text x="350" y="474" text-anchor="middle" font-family="Arial" font-size="26" fill="#e8fff0">Everyday Cup</text>
</svg>`);

window.ShopProducts = {
    lamp:{
        categoryId:"home",
        category:"ของใช้บ้าน",
        name:"โคมไฟไม้ Leaf Desk Lamp",
        price:890,
        image:"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80",
        short:"แสงนุ่มสำหรับอ่านหนังสือและทำงานช่วงกลางคืน",
        description:"โคมไฟตั้งโต๊ะโทนอุ่นสำหรับมุมอ่านหนังสือ โต๊ะทำงาน หรือหัวเตียง ดีไซน์เรียบ ใช้งานง่าย และเข้ากับบ้านโทนธรรมชาติ",
        details:["แสงนุ่ม ลดความแข็งของแสงในห้อง", "ฐานไม้เรียบง่าย วางบนโต๊ะได้มั่นคง", "เหมาะกับโต๊ะทำงาน ห้องนอน และมุมอ่านหนังสือ"]
    },
    vase:{
        categoryId:"home",
        category:"ของใช้บ้าน",
        name:"แจกันเซรามิก Moss Vase",
        price:520,
        image:"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80",
        short:"โทนธรรมชาติสำหรับวางบนชั้นหรือโต๊ะกินข้าว",
        description:"แจกันเซรามิกสีสุภาพสำหรับแต่งชั้นวาง โต๊ะกินข้าว หรือมุมรับแขก เพิ่มบรรยากาศสงบให้ห้องโดยไม่ทำให้พื้นที่ดูแน่นเกินไป",
        details:["ผิวด้าน ทำความสะอาดง่าย", "ใช้กับดอกไม้สดหรือดอกไม้แห้งได้", "ขนาดพอดีกับโต๊ะและชั้นวางขนาดเล็ก"]
    },
    pillow:{
        categoryId:"home",
        category:"ของใช้บ้าน",
        name:"หมอนแต่งบ้าน Soft Fern",
        price:390,
        image:"https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1000&q=80",
        short:"ผ้านุ่ม สีเขียวหม่น เข้ากับโซฟาเรียบ ๆ",
        description:"หมอนแต่งบ้านสีเขียวหม่น เนื้อผ้านุ่ม ช่วยให้โซฟาหรือเตียงดูอบอุ่นขึ้น เหมาะกับห้องนั่งเล่นที่ต้องการบรรยากาศสบายตา",
        details:["ปลอกถอดซักได้", "สีเข้ากับเฟอร์นิเจอร์ไม้", "เหมาะกับห้องนั่งเล่นและห้องพักผ่อน"]
    },
    stand:{
        categoryId:"work",
        category:"โต๊ะทำงาน",
        name:"แท่นวางแล็ปท็อป Work Stand",
        price:690,
        image:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
        short:"ช่วยจัดระดับจอและลดพื้นที่รกบนโต๊ะทำงาน",
        description:"แท่นวางแล็ปท็อปสำหรับจัดระดับสายตา ช่วยให้โต๊ะทำงานเป็นระเบียบและใช้งานได้นานขึ้น เหมาะกับงานเรียนและงานออฟฟิศ",
        details:["ช่วยยกหน้าจอให้อยู่ระดับสายตา", "ช่องว่างด้านล่างเก็บคีย์บอร์ดได้", "เหมาะกับโต๊ะทำงานขนาดเล็ก"]
    },
    note:{
        categoryId:"work",
        category:"โต๊ะทำงาน",
        name:"สมุดโน้ต Soft Note",
        price:120,
        image:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80",
        short:"กระดาษถนอมสายตา ปกเรียบสำหรับจดงาน",
        description:"สมุดโน้ตกระดาษถนอมสายตาสำหรับจดงาน วางแผน หรือเขียนไอเดียระหว่างวัน ปกเรียบ พกง่าย และเหมาะกับโต๊ะทำงานทุกแบบ",
        details:["กระดาษสีอ่อน อ่านสบายตา", "ปกเรียบ จับถนัดมือ", "เหมาะกับการจดประชุมและวางแผนงาน"]
    },
    tray:{
        categoryId:"work",
        category:"โต๊ะทำงาน",
        name:"กล่องจัดโต๊ะ Desk Tray",
        price:260,
        image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
        short:"เก็บปากกา สายชาร์จ และของชิ้นเล็กให้หยิบง่าย",
        description:"กล่องจัดของบนโต๊ะสำหรับเก็บของชิ้นเล็ก ลดความรกและช่วยให้หยิบใช้งานง่าย เหมาะกับสายชาร์จ ปากกา และโพสต์อิท",
        details:["แบ่งพื้นที่ของใช้ประจำวัน", "วางได้ทั้งโต๊ะทำงานและชั้นหนังสือ", "ช่วยให้โต๊ะดูสะอาดขึ้นทันที"]
    },
    tote:{
        categoryId:"travel",
        category:"พกพา",
        name:"กระเป๋าผ้า Market Tote",
        price:250,
        image:"https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000&q=80",
        short:"ผ้าหนา รับน้ำหนักดี มีช่องเล็กด้านใน",
        description:"กระเป๋าผ้าทรงกว้างสำหรับซื้อของ พกหนังสือ หรือใช้ประจำวัน น้ำหนักเบา พับเก็บง่าย และใช้แทนถุงพลาสติกได้",
        details:["ผ้าหนา รับน้ำหนักดี", "มีช่องเล็กด้านใน", "เหมาะกับการเดินทางสั้น ๆ และซื้อของ"]
    },
    cup:{
        categoryId:"travel",
        category:"พกพา",
        name:"แก้วเก็บอุณหภูมิ Everyday Cup",
        price:390,
        image:THERMOS_IMAGE,
        short:"เก็บร้อนเย็น เหมาะกับโต๊ะทำงานและการเดินทาง",
        description:"แก้วเก็บอุณหภูมิสำหรับกาแฟ ชา หรือเครื่องดื่มเย็นในวันทำงาน พกง่าย ล้างสะดวก และภาพสินค้าเป็นไฟล์ในระบบจึงโหลดได้เสถียร",
        details:["ขนาด 420 ml", "ฝาปิดแน่น เหมาะกับการเดินทาง", "ผิวด้านจับถนัดมือ"]
    },
    cutlery:{
        categoryId:"travel",
        category:"พกพา",
        name:"ชุดช้อนส้อมพกพา Mini Kit",
        price:180,
        image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
        short:"น้ำหนักเบา ล้างง่าย พร้อมกล่องจัดเก็บ",
        description:"ชุดช้อนส้อมพกพาพร้อมกล่อง เหมาะกับมื้อกลางวันที่ออฟฟิศหรือการเดินทางสั้น ๆ ช่วยลดการใช้ช้อนส้อมพลาสติก",
        details:["น้ำหนักเบา", "กล่องจัดเก็บล้างง่าย", "ลดการใช้พลาสติกแบบใช้ครั้งเดียว"]
    },
    balm:{
        categoryId:"care",
        category:"ดูแลตัวเอง",
        name:"บาล์มบำรุงมือ Herb Balm",
        price:210,
        image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80",
        short:"กลิ่นสมุนไพรอ่อน ๆ สำหรับพกติดกระเป๋า",
        description:"บาล์มบำรุงมือกลิ่นสมุนไพรอ่อน ๆ สำหรับพกติดกระเป๋า ใช้หลังล้างมือหรือก่อนนอน เหมาะกับผิวแห้งจากห้องแอร์",
        details:["เนื้อบาล์มซึมง่าย", "กลิ่นเขียวสะอาด", "พกง่าย ใช้ระหว่างวันได้"]
    },
    soap:{
        categoryId:"care",
        category:"ดูแลตัวเอง",
        name:"สบู่ธรรมชาติ Green Soap",
        price:95,
        image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=80",
        short:"สูตรอ่อนโยน กลิ่นสะอาด ใช้ได้ทุกวัน",
        description:"สบู่ธรรมชาติสูตรอ่อนโยน กลิ่นสะอาด ใช้ได้ทุกวัน และเหมาะกับห้องน้ำโทนเรียบที่ต้องการของใช้หน้าตาดี",
        details:["กลิ่นอ่อน ไม่ฉุน", "ก้อนจับถนัดมือ", "เหมาะกับการใช้งานประจำวัน"]
    },
    mist:{
        categoryId:"care",
        category:"ดูแลตัวเอง",
        name:"สเปรย์หอม Linen Mist",
        price:340,
        image:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=80",
        short:"ฉีดผ้าและห้อง กลิ่นสดชื่นแบบใบไม้หลังฝน",
        description:"สเปรย์หอมสำหรับฉีดผ้าและห้อง กลิ่นสดชื่นแบบใบไม้หลังฝน ทำให้มุมพักผ่อนดูสะอาดและผ่อนคลายขึ้น",
        details:["ใช้กับผ้าม่าน ผ้าปู หรือหมอนได้", "กลิ่นบางเบา", "ขวดพกง่าย วางบนโต๊ะก็ดูดี"]
    }
};

window.ShopCart = {
    key:"greennestCart",
    storage:window.sessionStorage,
    read:function(){
        try{
            return JSON.parse(this.storage.getItem(this.key)) || [];
        }catch(error){
            return [];
        }
    },
    write:function(items){
        this.storage.setItem(this.key, JSON.stringify(items));
    },
    add:function(id, quantity, delivery){
        const items = this.read();
        const existing = items.find(function(item){
            return item.id === id && item.delivery === delivery;
        });

        if(existing){
            existing.quantity += quantity;
        }else{
            items.push({ id:id, quantity:quantity, delivery:delivery });
        }

        this.write(items);
    },
    clear:function(){
        this.storage.removeItem(this.key);
        try{
            window.localStorage.removeItem(this.key);
        }catch(error){
            return;
        }
    },
    totals:function(){
        const items = this.read();
        const subtotal = items.reduce(function(sum, item){
            const product = window.ShopProducts[item.id];
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
        const shipping = items.length ? 45 : 0;
        return { subtotal:subtotal, shipping:shipping, total:subtotal + shipping };
    }
};

window.formatBaht = function(value){
    return "฿" + value.toLocaleString("th-TH");
};
