const imagePicker = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");

const showPreview = () => {
    const files = imagePicker.files;
    if(!files || files.length === 0) {
        imagePreview.style.display = "none";
        return;
    }
    const pickedImage = files[0];
    const imagePath = URL.createObjectURL(pickedImage);
    imagePreview.src = imagePath;
    imagePreview.style.display = "block";
};

imagePicker.addEventListener("change", showPreview);
