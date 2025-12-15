document.addEventListener("DOMContentLoaded", function () {
    let uploadedImageBase64 = null;
    const BASE_URL =
        "https://raw.githubusercontent.com/ramor333221/email-blessing-generator/main/images/";

    const defaultEventImages = {
        wedding: BASE_URL + "wedding.png",
        engagement: BASE_URL + "engagement.png",
        "baby-boy": BASE_URL + "baby-boy.png",
        "baby-girl": BASE_URL + "baby-girl.png",
        "bar-mitzva": BASE_URL + "bar-mitzva.png",
        "bat-mitzva": BASE_URL + "bat-mitzva.png",
        brit: BASE_URL + "brit.png",
        general: BASE_URL + "general.png"
    };

    const logoURL = BASE_URL + "family-logo.png";

    const imageInput = document.getElementById("event-image-input");
    const imagePreview = document.getElementById("event-image-preview");

    imageInput.addEventListener("change", async function () {
        const file = this.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            this.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Image is too large (max 2MB)");
            this.value = "";
            return;
        }

        uploadedImageBase64 = await fileToBase64(file);

        imagePreview.src = uploadedImageBase64;
        imagePreview.style.display = "block";
    });





    document.getElementById("message-type").addEventListener("change", function () {
    const type = this.value;

    document.getElementById("engagement-fields").style.display =
        type.startsWith("engagement") ? "block" : "none";

    document.getElementById("general-fields").style.display =
        type === "general" ? "block" : "none";

    document.querySelector(".names").style.display =
        type === "general" ? "none" : "block";
});


imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    // Optional: limit size (2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large (max 2MB)");
        this.value = "";
        imagePreview.style.display = "none";
        return;
    }

    const imageURL = URL.createObjectURL(file);
    imagePreview.src = imageURL;
    imagePreview.style.display = "block";
});

document.getElementById("generate-message").addEventListener("click", function () {
    const messageType = document.getElementById("message-type").value;
    const engagementToEn =
        document.getElementById("engagement-to-en")?.value.trim() || "";

    const engagementToHe =
        document.getElementById("engagement-to-he")?.value.trim() || "";

    const generalMessageEn =
        document.getElementById("general-message-en")?.value.trim() || "";

    const generalMessageHe =
        document.getElementById("general-message-he")?.value.trim() || "";

    // Fixed sender
    const senderEn = "Savta";
    const senderHe = "לסבתא";

    // User input
    const en1 = document.getElementById("name-english-2").value;
    const en2 = document.getElementById("name-english-3").value;
    const he1 = "ל"+document.getElementById("name-hebrew-2").value;
    const he2 = "ל"+document.getElementById("name-hebrew-3").value;

    let englishNames = "";
    let hebrewNames = "";

    if (messageType !== "general") {
        englishNames = [senderEn, en1, en2].filter(Boolean)
            .map(name => `<div style="margin:6px 0;">${name}</div>`)
            .join("");

        hebrewNames = [senderHe, he1, he2].filter(Boolean)
            .map(name => `<div style="margin:6px 0;">${name}</div>`)
            .join("");
    }

    const wishesEn = messageType === "general" ? "" : "Big Mazal Tov<br>to";
    const wishesHe = messageType === "general" ? "" : "ברכות מזל טוב<br>לביביים";


    // Titles
    let titleEn = "";
    let titleHe = "";

    switch (messageType) {
        case "wedding":
            titleEn = "for the wedding";
            titleHe = "לרגל נישואיכם";
            break;

        case "bar-mitzva":
            titleEn = "for the Bar Mitzva";
            titleHe = "לרגל הכנסו לעול תורה ומצוות";
            break;

        case "bat-mitzva":
            titleEn = "for he Bat Mitzva";
            titleHe = "לרגל הכנסה לעול תורה ומצוות";
            break;

        case "baby-boy":
            titleEn = "on the safe arrival of a baby boy";
            titleHe = "להולדת הבן בשעה טובה ומוצלחת";
            break;

        case "baby-girl":
            titleEn = "on the safe arrival of a baby girl";
            titleHe = "להולדת הבת בשעה טובה ומוצלחת";
            break;

        case "brit":
            titleEn = "Mazal Tov on this joyful occasion";
            titleHe = "להכנסת בנו בבריתו של אברהם אבינו";
            break;

        case "engagement-boy":
            titleEn = "on your engagement";
            titleHe = "לרגל אירוסיו";
            break;

        case "engagement-girl":
            titleEn = "on your engagement";
            titleHe = "לרגל אירוסיה";
            break;

        case "general":
            titleEn = generalMessageEn || "Have a nice day";
            titleHe = generalMessageHe || "יום נעים";
            break;
    }
    let engagementToBlockEn = "";
    let engagementToBlockHe = "";

    if (messageType.startsWith("engagement")) {
        if (engagementToEn) {
            engagementToBlockEn = `
            <div style="font-size:17px;font-weight:bold;margin-top:8px;color:#555;">
                with<br>${engagementToEn}
            </div>
        `;
        }

        if (engagementToHe) {
            engagementToBlockHe = `
            <div style="font-size:17px;font-weight:bold;margin-top:8px;color:#555;">
               עם<br> ${engagementToHe}
            </div>
        `;
        }
    }

    // Images (ONLINE – email safe)
    let eventImageSrc =
        defaultEventImages[messageType] || defaultEventImages.general;

    if (uploadedImageBase64) {
        eventImageSrc = uploadedImageBase64;
    }




    const signature =
        document.getElementById("signature-input").value.trim();

    // EMAIL-SAFE HTML (TABLE BASED)
    const emailHTML = `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;text-align:center;">
   
   <tr>
    <!-- English -->
    <td width="40%" valign="top">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <div style="
    min-height:260px;
    display:block;
">
    ${wishesEn ? `
<div style="font-size:26px;font-weight:bold;margin-bottom:6px;">
    ${wishesEn}
</div>
` : ""}

    <div style="margin-bottom:8px;">
        ${englishNames}
    </div>

    <div style="margin-top:10px;">
        ${titleEn}
    </div>
        ${engagementToBlockEn || ""}
</div>

            </tr>
        </table>
    </td>

    <!-- Event Image -->
    <td width="20%" align="center" valign="middle">
        <img src="${eventImageSrc}"
             width="260"
             style="display:block;margin:0 auto;">
    </td>

    <!-- Hebrew -->
    <td width="40%" valign="top">
        <table width="100%" cellpadding="0" cellspacing="0" dir="rtl">
            <tr>
                <div style="
    min-height:260px;
    display:block;
">
    ${wishesHe ? `
<div style="font-size:26px;font-weight:bold;margin-bottom:6px;">
    ${wishesHe}
</div>
` : ""}

    <div style="margin-bottom:8px;">
        ${hebrewNames}
    </div>

    <div style="margin-top:10px;">
        ${titleHe}
    </div>
     ${engagementToBlockHe || ""}
</div>

            </tr>
        </table>
    </td>
</tr>






    ${signature || logoURL ? `
<tr>
    <!-- Signature -->
   <td width="40%" style="
    padding-top:20px;
    padding-left:20px;
    padding-right:10px;
    font-size:21px;
    font-weight:bold;
    color:#cc0000;
    text-align:center;
    vertical-align:middle;
    direction: rtl;
">
    ${signature || ""}
</td>

    <!-- Empty spacer -->
    <td width="10%"></td>

    <!-- Logo -->
    <td width="40%" style="
        padding-top:20px;
        padding-right:20px;
        text-align:right;
        vertical-align:middle;
    ">
        <img src="${logoURL}" width="80" style="display:inline-block;">
    </td>
</tr>
` : ""}

</table>
`;
    document.getElementById("email-content").innerHTML = emailHTML;
});

// Copy for email
document.getElementById("copy-message").addEventListener("click", function () {
    const range = document.createRange();
    range.selectNode(document.getElementById("email-content"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("Email content copied!");
});
});
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
