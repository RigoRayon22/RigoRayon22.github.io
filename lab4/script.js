const zip = document.querySelector("#zip");
const city = document.querySelector("#city");
const lat = document.querySelector("#lat");
const lon = document.querySelector("#lon");
const zipMsg = document.querySelector("#zipMsg");

const state = document.querySelector("#state");
const county = document.querySelector("#county");

const username = document.querySelector("#username");
const userMsg = document.querySelector("#userMsg");

const password = document.querySelector("#password");
const suggest = document.querySelector("#suggest");

const retype = document.querySelector("#retype");
const matchMsg = document.querySelector("#matchMsg");

const form = document.querySelector("#signupForm");
const submitMsg = document.querySelector("#submitMsg");

/* 1 & 2) ZIP lookup + "Zip not found" */
zip.addEventListener("input", async () => {
  const z = zip.value.trim();
  city.textContent = lat.textContent = lon.textContent = "";
  zipMsg.textContent = "";

  if (!/^\d{5}$/.test(z)) return;

  const r = await fetch(`https://csumb.space/api/cityInfoAPI.php?zip=${z}`);
  const d = await r.json();

  if (!d.city) {
    zipMsg.textContent = "Zip code not found";
    return;
  }
  city.textContent = d.city;
  lat.textContent = d.latitude;
  lon.textContent = d.longitude;
});

/* 6) Load states */
(async () => {
  const r = await fetch("https://csumb.space/api/allStatesAPI.php");
  const states = await r.json();
  state.innerHTML = `<option value="">Select State</option>` +
    states.map(s => `<option value="${s.usps}">${s.state}</option>`).join("");
})();

/* 3) Load counties when state selected */
state.addEventListener("change", async () => {
  county.innerHTML = `<option value="">Loading...</option>`;
  if (!state.value) return;

  const r = await fetch(`https://csumb.space/api/countyListAPI.php?state=${state.value}`);
  const counties = await r.json();
  county.innerHTML = `<option value="">Select County</option>` +
    counties.map(c => `<option>${c.county}</option>`).join("");
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

  const r = await fetch(`https://csumb.space/api/usernamesAPI.php?username=${u}`);
  const d = await r.json();

  userMsg.textContent = d.available ? "Username available" : "Username NOT available";
  userMsg.classList.add(d.available ? "ok" : "bad");
});

/* 5) Suggested password on click/focus */
password.addEventListener("focus", async () => {
  const r = await fetch("https://csumb.space/api/suggestedPassword.php?length=8");
  const d = await r.json();
  suggest.textContent = "Suggested Password: " + d.password;
});

/* Password match message (nice UX) */
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