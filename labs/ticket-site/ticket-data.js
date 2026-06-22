window.TicketEvents = {
    luna:{
        artist:"Luna Blue",
        title:"Luna Blue - Midnight Arena Tour",
        venue:"Impact Arena, Bangkok",
        date:"Sat 24 Aug",
        price:2800,
        seat:"Floor B / Row 12",
        image:"https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1100&q=80",
        detail:"คอนเสิร์ตป๊อปอิเล็กทรอนิกส์พร้อมเวทีแสงสีเต็มรูปแบบ รอบนี้เปิดขายบัตรโซนหน้าเวทีและโซนนั่งชมแบบครอบครัว"
    },
    river:{
        artist:"Riverstone",
        title:"Riverstone Live in Bangkok",
        venue:"Thunder Dome",
        date:"Fri 06 Sep",
        price:1900,
        seat:"Zone A / Seat 22",
        image:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1100&q=80",
        detail:"วงอินดี้ร็อกที่กลับมาพร้อมอัลบั้มใหม่ บัตรมีทั้งโซนยืนและโซนนั่ง เหมาะกับผู้ชมที่ชอบบรรยากาศไลฟ์สดใกล้เวที"
    },
    neon:{
        artist:"The Neon Lights",
        title:"The Neon Lights Festival Night",
        venue:"Queen Sirikit National Convention Center",
        date:"Sun 15 Sep",
        price:3200,
        seat:"VIP Balcony / Seat 08",
        image:"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1100&q=80",
        detail:"งานดนตรีค่ำคืนเดียวที่รวมศิลปินซินธ์ป๊อปและดีเจรับเชิญ พร้อมระบบเสียงและภาพแบบ festival indoor"
    },
    atlas:{
        artist:"Atlas Echo",
        title:"Atlas Echo - City Lights",
        venue:"Union Hall",
        date:"Fri 20 Sep",
        price:1600,
        seat:"Standing GA",
        image:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1100&q=80",
        detail:"โชว์อัลเทอร์เนทีฟป๊อปสำหรับคนชอบเสียงกีตาร์และซินธ์อุ่น ๆ พร้อมแขกรับเชิญจากวงอินดี้รุ่นใหม่"
    },
    aurora:{
        artist:"Aurora Frame",
        title:"Aurora Frame Acoustic Evening",
        venue:"Scala Hall",
        date:"Sat 28 Sep",
        price:1200,
        seat:"Seat C14",
        image:"https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1100&q=80",
        detail:"ค่ำคืนอะคูสติกในฮอลล์ขนาดกลาง เหมาะสำหรับผู้ชมที่อยากฟังเสียงร้องและเครื่องสายแบบใกล้ชิด"
    },
    orbit:{
        artist:"Orbit Kids",
        title:"Orbit Kids Family Show",
        venue:"Bangkok Art Theatre",
        date:"Sun 29 Sep",
        price:900,
        seat:"Family Zone / Row 6",
        image:"https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1100&q=80",
        detail:"โชว์ดนตรีสำหรับครอบครัว มีช่วงร้องเล่นและกิจกรรมบนเวที เหมาะกับเด็กและผู้ปกครอง"
    },
    velvet:{
        artist:"Velvet Room",
        title:"Velvet Room Jazz Sessions",
        venue:"Blue Note Bangkok",
        date:"Thu 03 Oct",
        price:2100,
        seat:"Table 04",
        image:"https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1100&q=80",
        detail:"แจ๊สเซสชันในบรรยากาศคลับ พร้อมชุดเพลงมาตรฐานและเพลงใหม่จากศิลปินรับเชิญ"
    },
    pulse:{
        artist:"Pulse District",
        title:"Pulse District EDM Weekender",
        venue:"BITEC Live",
        date:"Sat 12 Oct",
        price:3500,
        seat:"Premium Standing",
        image:"https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1100&q=80",
        detail:"งาน EDM สองเวทีพร้อมแสงเลเซอร์และระบบเสียงขนาดใหญ่ เปิดขายบัตรแบบ standing และ premium standing"
    },
    sierra:{
        artist:"Sierra Moon",
        title:"Sierra Moon Folk Night",
        venue:"River Park Amphitheatre",
        date:"Sun 20 Oct",
        price:1450,
        seat:"Lawn Zone / Gate 2",
        image:"https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=1100&q=80",
        detail:"คอนเสิร์ตโฟล์กกลางแจ้งริมสวน เหมาะกับผู้ชมที่อยากนั่งฟังเพลงสบาย ๆ ในช่วงเย็น"
    }
};

window.formatTicketPrice = function(value){
    return "฿" + value.toLocaleString("th-TH");
};
