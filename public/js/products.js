const form = document.getElementById("logoutForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const dataObj = {};
    data.forEach((value, key) => (dataObj[key] = value));
    console.log(dataObj)
    fetch("/api/sessions/logout", {
        method: "POST",
        body: JSON.stringify(dataObj),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if (response.status === 200) {
            window.location.replace("/login");
        }
    });
});