function pageLoad() {
  const zipCodeInput = document.querySelector("#zipCodeInput");
  const cityDisplay = document.querySelector("#cityDisplay");
  const latitudeDisplay = document.querySelector("#latitudeDisplay");
  const longitudeDisplay = document.querySelector("#longitudeDisplay");

  zipCodeInput.addEventListener("input", async () => {
    const zip = zipCodeInput.value.trim();

    // Optional: only call API when zip is 5 digits
    if (!/^\d{5}$/.test(zip)) {
      cityDisplay.textContent = "";
      latitudeDisplay.textContent = "";
      longitudeDisplay.textContent = "";
      return;
    }

    const url = `https://csumb.space/api/cityInfoAPI.php?zip=${zip}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error accessing API endpoint");

      const data = await response.json();
      console.log(data);

      cityDisplay.textContent = data.city ?? "";
      latitudeDisplay.textContent = data.latitude ?? "";
      longitudeDisplay.textContent = data.longitude ?? "";
    } catch (err) {
      if (err instanceof TypeError) {
        alert("Error accessing API endpoint (network failure)");
      } else {
        alert(err.message);
      }
    }
  });
}

pageLoad();

const password = document.querySelector("#password");
const suggestedPasswordDisplay = document.querySelector("#suggestedPasswordDisplay"); 


passwordInput.addEventListener("focus", async () => {

  const url = "https://csumb.space/api/suggestedPassword.php?length=8";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error accessing password API");
    }

    const data = await response.json();
    console.log(data);

    // The API returns something like: { password: "abc123XY" }
    suggestedPasswordDisplay.textContent = "Suggested Password: " + data.password;

  } catch (err) {
    if (err instanceof TypeError) {
      alert("Network error while accessing password API");
    } else {
      alert(err.message);
    }
  }
});


const usernameInput = document.querySelector("#usernameInput");
const usernameMsg = document.querySelector("#usernameMsg");

usernameInput.addEventListener("input", async () => {

  const username = usernameInput.value.trim();

  if (username.length === 0) {
    usernameMsg.textContent = "";
    return;
  }

  const url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error accessing username API");
    }

    const data = await response.json();
    console.log(data);

    if (data.available) {
      usernameMsg.textContent = "Username is available";
      usernameMsg.style.color = "green";
    } else {
      usernameMsg.textContent = "Username is NOT available";
      usernameMsg.style.color = "red";
    }

  } catch (err) {
    if (err instanceof TypeError) {
      alert("Network error while accessing username API");
    } else {
      alert(err.message);
    }
  }

});
