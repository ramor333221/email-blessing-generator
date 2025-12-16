document.addEventListener("DOMContentLoaded", function () {
    let uploadedImageBase64 = null;
    let secondUploadedImageBase64 = null;
    const signature = document.getElementById("signature-input").value.trim();
    const BASE_URL =
        "https://raw.githubusercontent.com/ramor333221/email-blessing-generator/main/images/";

    const defaultEventImages = {
        wedding: BASE_URL + "wedding.png",
        "engagement-boy": BASE_URL + "engagement.png",
        "engagement-girl": BASE_URL + "engagement.png",
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

    const imageInput1 = document.getElementById("event-image-input");
    const imageInput2 = document.getElementById("event-image-input-2");

    imageInput1.addEventListener("change", async function () {
        uploadedImageBase64 = await handleImageUpload(this);
    });

    imageInput2.addEventListener("change", async function () {
        secondUploadedImageBase64 = await handleImageUpload(this);
    });

    async function handleImageUpload(input) {
        const file = input.files[0];
        if (!file) return null;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            input.value = "";
            return null;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Image is too large (max 2MB)");
            input.value = "";
            return null;
        }

        return await fileToBase64(file);
    }



    document.getElementById("message-type").addEventListener("change", function () {
        const type = this.value;

        document.getElementById("engagement-fields").style.display =
            type.startsWith("engagement") ? "block" : "none";

        document.getElementById("general-fields").style.display =
            type === "general" ? "block" : "none";

        document.querySelector(".names").style.display =
            type === "general" ? "none" : "block";
    });


    document.getElementById("generate-message").addEventListener("click", function () {
        const congratsText = document.getElementById("congrats-input")?.value.trim() || "";
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
        const he1 = "ל" + document.getElementById("name-hebrew-2").value;
        const he2 = "ל" + document.getElementById("name-hebrew-3").value;

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
        const wishesHe = messageType === "general" ? "" : "ברכות מזל טוב<br>לבביים";


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
            <div style="font-size:30px;font-weight:bold;margin-top:8px;color:#555;">
                with<br>${engagementToEn}
            </div>
        `;
            }

            if (engagementToHe) {
                engagementToBlockHe = `
            <div style="font-size:30px;font-weight:bold;margin-top:8px;color:#555;">
               עם<br> ${engagementToHe}
            </div>
        `;
            }
        }

        // Images (ONLINE – email safe)
        let eventImagesHTML = "";

        const images = [];

// priority: user images
        if (uploadedImageBase64) images.push(uploadedImageBase64);
        if (secondUploadedImageBase64) images.push(secondUploadedImageBase64);

// fallback: default
        if (images.length === 0) {
            images.push(defaultEventImages[messageType] || defaultEventImages.general);
        }

// build HTML
        eventImagesHTML = images.map(img => `
    <img src="${img}" style="
        display:block;
        width:100%;
        max-width:180px;
        height:auto;
        margin:8px auto;
    ">
`).join("");



        const emailHTML = `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;text-align:center;">
   
   <tr>
    <!-- English -->
    <td width="40%" valign="top">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="min-height:260px;">
        ${wishesEn ? `
        <div style="font-family:'Comic Sans MS',Arial;
                    font-size:34px;font-weight:bold;">
            ${wishesEn}
        </div>` : ""}

        <div style="font-family:'Comic Sans MS',Arial;
                    font-size:34px;font-weight:bold;">
            ${englishNames}
        </div>

        <div style="font-family:'Comic Sans MS',Arial;
                    font-size:34px;font-weight:bold;">
            ${titleEn}
        </div>

        ${engagementToBlockEn || ""}
      </td>
    </tr>
  </table>
</td>


    <!-- Event Image -->
   <td width="30%" align="center" valign="middle">
    ${eventImagesHTML}
</td>

    <!-- Hebrew -->
    <td width="40%" valign="top" dir="rtl">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="min-height:260px;">
        ${wishesHe ? `
        <div style="font-family:'Comic Sans MS',Arial;
                    font-size:34px;font-weight:bold;">
            ${wishesHe}
        </div>` : ""}

        <div style="font-family:'Comic Sans MS',Arial;
                    font-size:34px;font-weight:bold;">
            ${hebrewNames}
        </div>

        <div style="font-family:'Comic Sans MS',Arial;
                    font-size:34px;font-weight:bold;">
            ${titleHe}
        </div>

        ${engagementToBlockHe || ""}
      </td>
    </tr>
  </table>
</td>

</tr>
${congratsText ? `
<tr>
  <td colspan="3" style="
      font-size:40px;
      font-weight:bold;
      color:#d40000;
      padding-top:12px;
      text-align:center;
  ">
    ${congratsText}
  </td>
</tr>` : ""}






  ${(signature || logoURL) ? `

<tr>
  <td colspan="3" height="40"></td>
</tr>

<tr>
  <td width="40%" valign="bottom" style="
      padding-left:8px;
      font-size:22px;
      font-weight:bold;
      color:#cc0000;
      text-align:left;
      direction:rtl;
  ">
      ${signature}
  </td>

  <td width="20%"></td>

  <td width="40%" valign="bottom" style="text-align:-webkit-right;padding-right:8px;direction:ltr;">
      <img src="${logoURL}" width="80">
  </td>
</tr>
` : ""}
<tr>
  <td colspan="3" style="
      padding-top:18px;
      font-size:14px;
      font-weight:normal;
      color:#666;
      text-align:center;
  ">
      AMOR FAMILY HOTLINE – KEEPING US ALL IN TOUCH<br>
      ONLINE - BEYOND TIME<br>
      משפחת אמור - משהו מיוחד
  </td>
</tr>

</table>
`;
        document.getElementById("email-content").innerHTML = emailHTML;
    });

// Copy for email
    document.getElementById("copy-message").addEventListener("click", function () {
        const content = document.getElementById("email-content");

        const range = document.createRange();
        range.selectNode(content);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        document.execCommand("copy");
        window.getSelection().removeAllRanges();

        const status = document.getElementById("copy-status");
        status.style.display = "block";

        // auto-hide after 2 seconds
        setTimeout(() => {
            status.style.display = "none";
        }, 2000);
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
