const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const dataObj = {};
    data.forEach((value, key) => (dataObj[key] = value));
    fetch("/api/sessions/login", {
        method: "POST",
        body: JSON.stringify(dataObj),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if (response.status === 200) {
            window.location.replace("/products");
        }
    });
});