
document.getElementById("account-type").addEventListener("change", function () { 
    const accountType = this.value.toLowerCase(); 
    const mailBox = document.getElementById("mail-box"); 
    const cookie2fa = document.getElementById("2fa-cookie"); 
    const fdType = document.getElementById("fd-type");

    if (["gmail", "instagram", "telegram"].includes(accountType)) {
        mailBox.disabled = true;
        mailBox.required = false;
        cookie2fa.disabled = true;
        cookie2fa.required = false;
        fdType.disabled = true;
        fdType.required = false;

        mailBox.value = "";
        cookie2fa.value = "";
        fdType.value = "";
    } else {
        mailBox.disabled = false;
        mailBox.required = true;
        cookie2fa.disabled = false;
        cookie2fa.required = true;
        fdType.disabled = false;
        fdType.required = true;
    }

    if (cookie2fa.value === "Cookies") {
        fdType.disabled = true;
        fdType.value = "";
    } else {
        fdType.disabled = false;
    }
});

document.getElementById("2fa-cookie").addEventListener("change", function () { 
    const fdType = document.getElementById("fd-type"); 
    if (this.value === "Cookies") { 
        fdType.disabled = true; 
        fdType.value = ""; 
    } else { 
        fdType.disabled = false; 
    }
});

document.getElementById("submit-btn").addEventListener("click", function () { 
    const accountType = document.getElementById("account-type").value; 
    const mailBox = document.getElementById("mail-box").value || " "; 
    const cookie2fa = document.getElementById("2fa-cookie").value.trim();
    const fdType = document.getElementById("fd-type").value || " "; 
    const ttlId = document.getElementById("ttl-id").value; 
    const tgUsername = document.getElementById("tg-username").value; 
    const tgChatId = document.getElementById("tg-chat-id").value; 
    const googleSheet = document.getElementById("google-sheet").value;

    const requiredFields = [
        { value: accountType, name: "Account Type" },
        { value: cookie2fa, name: "2FA/Cookies" },
        { value: ttlId, name: "Ttl Id" },
        { value: tgUsername, name: "Tg Username" },
        { value: tgChatId, name: "Tg Chat Id" },
        { value: googleSheet, name: "Google Sheet Link" }
    ];

    for (const field of requiredFields) {
        if (!field.value || field.value === "Select") {
            showAlert(`Please fill out the ${field.name}.`);
            return;
        }
    }

    if (!/^\d{1,4}$/.test(ttlId)) {
        showAlert("Ttl Id must be between 1 and 4 digits.");
        return;
    }

    if (!/^\d{9,10}$/.test(tgChatId)) {
        showAlert("Tg Chat Id must be 9 or 10 digits.");
        return;
    }

    const sheetLinkRegex = /^https?:\/\/(docs\.google\.com\/spreadsheets\/.+)/;
    if (!sheetLinkRegex.test(googleSheet)) {
        showAlert("Please enter a valid Google Sheet link.");
        return;
    }

    let chatIdForBot;

    if (cookie2fa === "Cookies") {
        chatIdForBot = "-1002372301785";
    } else if (cookie2fa === "2FA" &&  fdType === "30FD") {
        chatIdForBot = "-1002635815704";
    } else if (cookie2fa === "2FA" &&  fdType === "0FD") {
        chatIdForBot = "-1002636197141";
    } else if (accountType.toLowerCase() === "gmail") {
        chatIdForBot = "-1002281630040";
    } else if (accountType.toLowerCase() === "instagram") {
        chatIdForBot = "-1002289360040";
    } else if (accountType.toLowerCase() === "telegram") {
        chatIdForBot = "-1002238560040";
    } else {
        showAlert("সঠিকভাবে 2FA বা Cookies সিলেক্ট করুন।");
        return;
    }

    const options = { 
        timeZone: "Asia/Dhaka", 
        day: "2-digit", 
        month: "2-digit", 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: true 
    };
    const currentDate = new Date().toLocaleString("en-GB", options).replace(",", "");

    const message = `
      New Form Submission:
      - Account Type: ${accountType}
      - Mail Box: ${mailBox}
      - 2FA-Cook: ${cookie2fa}
      - FD Type: ${fdType}
      - Ttl Id: ${ttlId}
      - Tg UsrNM: ${tgUsername}
      - Tg ChatId: ${tgChatId}
      - File: ${googleSheet}
      - D&T: ${currentDate}
    `;

    const botToken = "7734169736:AAGDFW2mVkNSLrrPClDohEfNE0whlwmBiuE";
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatIdForBot}&text=${encodeURIComponent(message)}`;

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;

    fetch(telegramUrl)
        .then(async (response) => {
            const result = await response.json();

            
            if (response.ok) {
    sendReadyMadeMessageToUser(tgChatId); // ✅ ইউজারের দেওয়া চ্যাট আইডিতে মিডিয়া পাঠাও

    setTimeout(() => {
        window.location.href = "success.html";
    }, 1000);
            }
            
            else {
                console.error("Telegram API Error:", result);
                showAlert(`Failed: ${result.description}`);
                submitBtn.disabled = false;
            }
        })
        .catch((error) => {
            console.error("Network Error:", error);
            showAlert("Failed to send data. Please check your network and try again.");
            submitBtn.disabled = false;
        });
});



// ✅ ফাংশন: অ্যালার্ট শো করা
function showAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");
    
    alertMessage.textContent = message;  // মেসেজ সেট করা
    alertBox.style.display = "flex";    // পপ-আপ শো করানো
}

// ✅ ফাংশন: অ্যালার্ট বন্ধ করা
document.getElementById("alert-ok").addEventListener("click", function () {
    document.getElementById("custom-alert").style.display = "none";
});






function sendReadyMadeMessageToUser(tgChatId) {
    const botToken = "7673657711:AAHVLLBUQUyW4de_qrZsy2L3Hcj3Siav3kY";

// আজকের তারিখ ও সময় (সাল বাদে)
const today = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
});

    // মিডিয়া ফাইলের লিঙ্ক (তোমার সার্ভারে থাকা লাগবে)
    const mediaUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7TresD68j1z7kGLxwCZwyxX9D2tg_iC5tuUQOnbPpOwTNcRICz91oFLCLP3bzBhIzXKt7sGDSAZC5HvpKvcFjaHhefNIndTl6uGgw7BUh5aN8XD1d2YJs0wol1tfWDIidivg4Fjls0vKLJF-91rPLrEYdJ7v_ZN3VHg2_Y8FQ12a1el9232IgTimTZD0V/s1280/wssfl.png"; // ইমেজ বা ভিডিও লিংক

    const caption = `Submit Successful 💐 \n\nআপনার কাজ সফল ভাবে জমা করা হয়েছে। \n\nআপনার কাজের রিপোর্ট জানতে অবশ্যই আমাদের গ্রূপে যুক্ত থাকুন এবং যেকোনো সমস্যার সমাধান নিন।   \n\nতারিখ: ${today}`;

    const replyMarkup = {
        inline_keyboard: [[
            {
                text: "Join Group",
                url: "https://t.me/fbmMarket" // তোমার টেলিগ্রাম সাপোর্ট লিংক
            }
        ]]
    };

    // API URL
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`; // যদি ভিডিও হয়, তাহলে sendVideo

    // ফর্ম ডেটা তৈরি
    const formData = {
        chat_id: tgChatId,
        photo: mediaUrl, // যদি ভিডিও হয়, তাহলে "video" key দিতে হবে
        caption: caption,
        reply_markup: JSON.stringify(replyMarkup),
        parse_mode: "HTML"
    };

    // ফেচ রিকুয়েস্ট
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        if (!data.ok) {
            console.error("Failed to send media message:", data);
        }
    })
    .catch(err => {
        console.error("Error sending media message:", err);
    });
}
