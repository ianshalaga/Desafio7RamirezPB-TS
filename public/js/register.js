const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const dataObj = {};
    data.forEach((value, key) => (dataObj[key] = value));
    fetch("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(dataObj),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if (response.status === 201) {
            window.location.replace("/login");
        }
    });
});