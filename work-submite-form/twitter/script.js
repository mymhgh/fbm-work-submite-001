document.getElementById("account-type").addEventListener("change", function () { 
    const accountType = this.value.toLowerCase(); 
    const mailBox = document.getElementById("mail-box"); 
    const cookie2fa = document.getElementById("2fa-cookie"); 
    const fdType = document.getElementById("fd-type");

    mailBox.disabled = false;
    mailBox.required = true;
    cookie2fa.disabled = false;
    cookie2fa.required = true;
    fdType.disabled = false;
    fdType.required = true;

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
    const tgUsername = document.getElementById("tg-username").value.trim();
    const tgChatId = document.getElementById("tg-chat-id").value; 
    const googleSheet = document.getElementById("google-sheet").value;

    function isValidTelegramUsername(username) {
        const cleaned = username.slice(1); // remove '@'

        if (cleaned.length < 5) return false;

        const hasLetter = /[a-zA-Z]/.test(cleaned);
        const hasNumber = /[0-9]/.test(cleaned);
        const hasSpecial = /[_]/.test(cleaned);

        if (!hasLetter) return false;

        return true;
    }

    if (!tgUsername.startsWith("@")) {
        showAlert(" অবশ্যই প্রথমে '@' দিতে হবে। ");
        return;
    }

    const invalidUsernames = ["admin", "pro", "fbm", "edris"];
    const cleanedUsername = tgUsername.slice(1).toLowerCase();

    if (invalidUsernames.includes(cleanedUsername)) {
        if (cleanedUsername === "admin") {
            showAlert("সঠিক ইউজারনেম দিন ( admin ❌ )");
        } else if (cleanedUsername === "pro") {
            showAlert("সঠিক ইউজারনেম দিন ( pro ❌ )");
        } else if (cleanedUsername === "edris") {
            showAlert("সঠিক ইউজারনেম দিন ( Edris ❌ )");
        } else if (cleanedUsername === "fbm") {
            showAlert("সঠিক ইউজারনেম দিন ( fbm ❌ )");
        }
        return;
    }

    if (!isValidTelegramUsername(tgUsername)) {
        showAlert("সঠিক ইউজারনেম দিন।");
        return;
    }

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
                sendReadyMadeMessageToUser(tgChatId);
                setTimeout(() => {
                    window.location.href = "success.html";
                }, 1000);
            } else {
                console.error("API Error:", result);
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

function showAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");
    
    alertMessage.textContent = message;
    alertBox.style.display = "flex";
}

document.getElementById("alert-ok").addEventListener("click", function () {
    document.getElementById("custom-alert").style.display = "none";
});

function sendReadyMadeMessageToUser(tgChatId) {
    const botToken = "7673657711:AAHVLLBUQUyW4de_qrZsy2L3Hcj3Siav3kY";

    const today = new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Dhaka",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    const mediaUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7TresD68j1z7kGLxwCZwyxX9D2tg_iC5tuUQOnbPpOwTNcRICz91oFLCLP3bzBhIzXKt7sGDSAZC5HvpKvcFjaHhefNIndTl6uGgw7BUh5aN8XD1d2YJs0wol1tfWDIidivg4Fjls0vKLJF-91rPLrEYdJ7v_ZN3VHg2_Y8FQ12a1el9232IgTimTZD0V/s1280/wssfl.png";

    const caption = `Submit Successful 💐 \n\nআপনার কাজ সফল ভাবে জমা করা হয়েছে। \n\nআপনার কাজের রিপোর্ট জানতে অবশ্যই আমাদের গ্রূপে যুক্ত থাকুন এবং যেকোনো সমস্যার সমাধান নিন।   \n\nতারিখ: ${today}`;

    const replyMarkup = {
        inline_keyboard: [[
            {
                text: "Join Group",
                url: "https://t.me/fbmMarket"
            }
        ]]
    };

    const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

    const formData = {
        chat_id: tgChatId,
        photo: mediaUrl,
        caption: caption,
        reply_markup: JSON.stringify(replyMarkup),
        parse_mode: "HTML"
    };

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


// Go Back ---------
function goBack() {
    window.history.back(); // এটি ইউজারকে আগের পেজে ফিরিয়ে নিয়ে যাবে
  }