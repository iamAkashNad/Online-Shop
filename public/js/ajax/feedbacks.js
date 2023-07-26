let orderId, clickedFeedbackBtn;
const getGiveFeedbackBtns = document.querySelectorAll(".get-give-feedback-btn");
const feedbackSection = document.getElementById("feedback-section");
const feedbackForm = document.getElementById("feedback-form");
const closeFeedbackSectionBtn = document.getElementById("feedback-close");

const backDropForFeedback = document.getElementById("back-drop-feedback");



const getFeedbackSection = (event) => {
    clickedFeedbackBtn = event.target;
    orderId = event.target.dataset.orderid;
    feedbackForm.querySelector("#feeling").value = "Sefisfied";
    feedbackSection.style.display = "block";
    backDropForFeedback.style.display = "block";
};

const closeFeedbackForum = () => {
    feedbackForm.querySelector("#feeling").value = "Sefisfied";
    feedbackForm.querySelector("#feedback").value = "";
    feedbackSection.style.display = "none";
    backDropForFeedback.style.display = "none";
};

const submitFeedback = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        orderId,
        _csrf: event.target.dataset.csrf,
        feeling: formData.get("feeling"),
        feedback: formData.get("feedback"),
    };
    let response;
    try {
        closeFeedbackForum();
        response = await fetch("/orders/feedback", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch(error) {
        return slowNetwork();
    }

    if(!response.ok) return serverError();

    const responseData = await response.json();

    if(!responseData.success) return showMessage(responseData.message);

    const orderManager = clickedFeedbackBtn.parentElement;
    orderManager.querySelector(".order-status").innerText = "Delivered";
    orderManager.querySelector(".clear-order-btn").style.display = "inline";
    clickedFeedbackBtn.remove();
    showMessage(responseData.title, responseData.body);
    clickedFeedbackBtn = null;
    orderId = null;
};



for(let getGiveFeedbackBtn of getGiveFeedbackBtns)
    getGiveFeedbackBtn.addEventListener("click", getFeedbackSection);

feedbackForm.addEventListener("submit", submitFeedback);

closeFeedbackSectionBtn.addEventListener("click", closeFeedbackForum);
