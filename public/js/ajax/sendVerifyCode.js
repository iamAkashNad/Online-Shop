const sendVerifyButton = document.getElementById("send-code-btn");
const codeSendingElement = document.getElementById("code-sending");

const sendVerifyCode = async () => {
    const csrfToken = sendVerifyButton.dataset.csrftoken;
    sendVerifyButton.parentElement.style.display = "none";
    codeSendingElement.style.display = "block";
    try {
        const response = await fetch("/verify-code/send", {
            method: "PATCH",
            body: JSON.stringify({ _csrf: csrfToken }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if(!response.ok) {
            serverError();
        } else {
            showMessage("Email Send Successfully!", "Please check your inbox. The code is send from our side to your provided email.");
        }
    } catch(error) {
        slowNetwork();
    }
    codeSendingElement.style.display = "none";
    sendVerifyButton.parentElement.style.display = "block";

};

sendVerifyButton.addEventListener("click", sendVerifyCode);
