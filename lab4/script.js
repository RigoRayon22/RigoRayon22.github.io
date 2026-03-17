const zip = document.querySelector("#zip");
const city = document.querySelector("#city");
const lat = document.querySelector("#lat");
const lon = document.querySelector("#lon");
const zipMsg = document.querySelector("#zipMsg");

const state = document.querySelector("#state");
const county = document.querySelector("#county");
const stateMsg = document.querySelector("#stateMsg");
const countyMsg = document.querySelector("#countyMsg");

const username = document.querySelector("#username");
const userMsg = document.querySelector("#userMsg");

const password = document.querySelector("#password");
const suggest = document.querySelector("#suggest");

const retype = document.querySelector("#retype");
const matchMsg = document.querySelector("#matchMsg");

const form = document.querySelector("#signupForm");
const submitMsg = document.querySelector("#submitMsg");

// Helper to safely fetch JSON (prevents Chrome from “breaking” your script on errors)
async function safeJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

/* 1 & 2) ZIP lookup + "Zip not found" */
zip.addEventListener("input", async () => {
  const z = zip.value.trim();

  city.textContent = lat.textContent = lon.textContent = "";
  zipMsg.textContent = "";

  if (!/^\d{5}$/.test(z)) return;

  try {
    const d = await safeJson(`https://csumb.space/api/cityInfoAPI.php?zip=${encodeURIComponent(z)}`);

    if (!d.city) {
      zipMsg.textContent = "Zip code not found";
      return;
    }

    city.textContent = d.city;
    lat.textContent = d.latitude;
    lon.textContent = d.longitude;
  } catch (e) {
    zipMsg.textContent = "Zip API error (Chrome blocked or API down)";
  }
});

/* 6) Load states from API */
(async () => {
  state.innerHTML = `<option value="">Loading...</option>`;
  county.innerHTML = `<option value="">Select state first</option>`;
  stateMsg.textContent = "";
  countyMsg.textContent = "";

  try {
    const states = await safeJson("https://csumb.space/api/allStatesAPI.php");

    state.innerHTML =
      `<option value="">Select State</option>` +
      states.map(s => `<option value="${s.usps}">${s.state}</option>`).join("");
  } catch (e) {
    stateMsg.textContent = "States API failed in Chrome. Run via Live Server.";
    state.innerHTML = `<option value="">(error)</option>`;
  }
})();

/* 3) Load counties when state selected */
state.addEventListener("change", async () => {
  countyMsg.textContent = "";
  county.innerHTML = `<option value="">Loading...</option>`;

  if (!state.value) {
    county.innerHTML = `<option value="">Select state first</option>`;
    return;
  }

  try {
    const counties = await safeJson(
      `https://csumb.space/api/countyListAPI.php?state=${encodeURIComponent(state.value)}`
    );

    county.innerHTML =
      `<option value="">Select County</option>` +
      counties.map(c => `<option>${c.county}</option>`).join("");
  } catch (e) {
    countyMsg.textContent = "Counties API error";
    county.innerHTML = `<option value="">(error)</option>`;
  }
});

/* 4) Username availability */
username.addEventListener("input", async () => {
  const u = username.value.trim();
  userMsg.textContent = "";
  userMsg.className = "small fw-bold";

  if (!u) return;

  if (u.length < 3) {
    userMsg.textContent = "Username must be at least 3 characters";
    userMsg.classList.add("bad");
    return;
  }

  try {
    const d = await safeJson(
      `https://csumb.space/api/usernamesAPI.php?username=${encodeURIComponent(u)}`
    );

    userMsg.textContent = d.available ? "Username available" : "Username NOT available";
    userMsg.classList.add(d.available ? "ok" : "bad");
  } catch (e) {
    userMsg.textContent = "Username API error";
    userMsg.classList.add("bad");
  }
});

/* 5) Suggested password when clicking/focusing password box */
password.addEventListener("focus", async () => {
  suggest.textContent = "Loading suggested password...";
  try {
    const d = await safeJson("https://csumb.space/api/suggestedPassword.php?length=8");
    suggest.textContent = "Suggested Password: " + d.password;
  } catch (e) {
    suggest.textContent = "Password API error";
  }
});

/* Password match feedback */
retype.addEventListener("input", () => {
  matchMsg.textContent = "";
  matchMsg.className = "small fw-bold";
  if (!retype.value) return;

  const ok = password.value === retype.value;
  matchMsg.textContent = ok ? "Passwords match" : "Passwords do not match";
  matchMsg.classList.add(ok ? "ok" : "bad");
});

/* Submit validations (rubric) */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitMsg.textContent = "";
  submitMsg.className = "fw-bold";

  if (username.value.trim().length < 3) {
    submitMsg.textContent = "Username must be at least 3 characters.";
    submitMsg.classList.add("bad");
    return;
  }
  if (password.value.length < 6) {
    submitMsg.textContent = "Password must be at least 6 characters.";
    submitMsg.classList.add("bad");
    return;
  }
  if (password.value !== retype.value) {
    submitMsg.textContent = "Passwords must match.";
    submitMsg.classList.add("bad");
    return;
  }

  submitMsg.textContent = "Success! Form validated.";
  submitMsg.classList.add("ok");
});