 document.addEventListener("DOMContentLoaded", () => {

                let sides = [];
                let editingIndex = null;
                let diceCollection = JSON.parse(localStorage.getItem("diceCollection")) || [];
                renderSavedDice();

                const APP_VERSION = "2.2"; // match this to your service-worker version if you want

                const versionLabel = document.getElementById("version-label");
                if (versionLabel) {
                    versionLabel.textContent = "Version " + APP_VERSION;
                }

                function addSide() {
                    const input = document.getElementById("sideInput");
                    if (input.value.trim() === "") return;

                    sides.push(input.value);
                    input.value = "";
                    renderSides();
                }

                function renderSides() {
                    const list = document.getElementById("sidesList");
                    list.innerHTML = "";

                    sides.forEach((side, index) => {
                        const div = document.createElement("div");
                        div.className = "side-item";

                        const span = document.createElement("span");
                        span.textContent = side;

                        const editBtn = document.createElement("button");
                        editBtn.textContent = "Edit";
                        editBtn.style.marginLeft = "100px";
                        editBtn.style.background = "#28a745";

                        editBtn.onclick = () => {
                            editSide(index);
                        };

                        const deleteBtn = document.createElement("button");
                        deleteBtn.textContent = "Delete";
                        deleteBtn.style.marginLeft = "20px";
                        deleteBtn.style.background = "#dc3545";

                        deleteBtn.onclick = () => {
                        sides.splice(index, 1);
                        renderSides();
                };

                        div.appendChild(span);
                        div.appendChild(editBtn);
                        div.appendChild(deleteBtn);
                        list.appendChild(div);
                    });
                }

                function saveDice() {
                    const name = document.getElementById("diceName").value;
                    if (!name || sides.length === 0) {
                        alert("Please add a name and at least one side.");
                        return;
                    }

                    if (editingIndex !== null) {
                        // Update existing dice
                        diceCollection[editingIndex] = { name: name, sides: [...sides] };
                    } else {
                        // Create new dice
                        diceCollection.push({ name: name, sides: [...sides] });
                    }

                    localStorage.setItem("diceCollection", JSON.stringify(diceCollection));

                    sides = [];
                    editingIndex = null;
                    document.getElementById("diceName").value = "";
                    renderSides();
                    renderSavedDice();
                }

                function renderSavedDice() {
                    const container = document.getElementById("savedDice");
                    container.innerHTML = "";

                    diceCollection.forEach((dice, index) => {

                        const wrapper = document.createElement("div");
                        wrapper.className = "saved-dice-item";

                        const loadBtn = document.createElement("button");
                        loadBtn.textContent = dice.name;

                        loadBtn.addEventListener("click", () => {
                            sides = [...dice.sides];
                            document.getElementById("diceName").value = dice.name;
                            editingIndex = index;
                            renderSides();
                        });

                        const deleteBtn = document.createElement("button");
                        deleteBtn.textContent = "Delete";
                        deleteBtn.className = "delete-btn";
                        deleteBtn.style.marginLeft = "20px";
                        deleteBtn.style.background = "#dc3545";

                        deleteBtn.addEventListener("click", () => {
                            deleteSavedDice(index);
                        });

                        wrapper.appendChild(loadBtn);
                        wrapper.appendChild(deleteBtn);
                        container.appendChild(wrapper);
                    });
                }

                function deleteSavedDice(index) {

                    // Remove from array
                    diceCollection.splice(index, 1);

                    // Update localStorage
                    localStorage.setItem("diceCollection", JSON.stringify(diceCollection));

                    // If we were editing this dice, reset editor
                    if (editingIndex === index) {
                        sides = [];
                        editingIndex = null;
                        document.getElementById("diceName").value = "";
                        renderSides();
                    }

                    // If deleting an earlier item, adjust editingIndex
                    if (editingIndex !== null && editingIndex > index) {
                        editingIndex--;
                    }

                    renderSavedDice();
                }

                function rollDice() {
                    if (sides.length === 0) {
                        alert("No sides to roll!");
                        return;
                    }

                    let count = 0;
                    const resultDiv = document.getElementById("result");

                    const interval = setInterval(() => {
                        const randomIndex = Math.floor(Math.random() * sides.length);
                        resultDiv.textContent = sides[randomIndex];
                        count++;

                        if (count > 20) {
                            clearInterval(interval);
                        }
                    }, 100);
                }

                function clearSides() {
                    sides = [];
                    renderSides();
                    document.getElementById("result").textContent = "";
                }

                function editSide(index) {
                    const newValue = prompt("Edit this side:", sides[index]);

                    if (newValue !== null && newValue.trim() !== "") {
                        sides[index] = newValue;
                        renderSides();
                    }
                }

                    if ("serviceWorker" in navigator) {
                        navigator.serviceWorker.register("service-worker.js").then(reg => {

                            reg.addEventListener("updatefound", () => {
                                const newWorker = reg.installing;

                                newWorker.addEventListener("statechange", () => {
                                    if (newWorker.state === "activated") {
                                        window.location.reload();
                                    }
                                });
                            });

                        });
                    }

                window.addEventListener("load", () => {
                    const hasOpened = localStorage.getItem("hasOpenedApp");

                    if (hasOpened) {
                        document.getElementById("splash-screen").classList.add("visible");
                    } else {
                        document.getElementById("splash-screen").classList.remove("visible");
                    }
                });

                function startApp() {
                    localStorage.setItem("hasOpenedApp", "true");
                    closeAbout();
                }

                function showAbout() {
                    document.getElementById("splash-screen")
                        .classList.add("visible");
                }

                function closeAbout() {
                    document.getElementById("splash-screen")
                        .classList.remove("visible");
                }

// =========================
// EVENT LISTENERS
// =========================
document.getElementById("addSideBtn")?.addEventListener("click", addSide);
document.getElementById("saveDiceBtn")?.addEventListener("click", saveDice);
document.getElementById("rollDiceBtn")?.addEventListener("click", rollDice);
document.getElementById("clearSidesBtn")?.addEventListener("click", clearSides);
document.getElementById("aboutBtn")?.addEventListener("click", showAbout);
document.getElementById("startAppBtn")?.addEventListener("click", startApp);

});