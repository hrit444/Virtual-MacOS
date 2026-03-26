let appZIndexCounter = 2000;

function bringAppToFront(app) {
  app.style.zIndex = appZIndexCounter++;
}

document.addEventListener("mousedown", (e) => {
  const app = e.target.closest("[data-app]");
  if (app && !app.classList.contains("hidden")) {
    bringAppToFront(app);
  }
});

function displayContolOpener() {
  let brightness = document.querySelector("#brightness");
  let displayContainer = document.querySelector(".display-container");
  let displayCount = 0;

  brightness.addEventListener("click", () => {
    if (displayCount) {
      displayContainer.style.display = "block";
      displayCount = 0;
      controlCenter.style.display = "none";
      menuCount = 1;
    } else {
      displayContainer.style.display = "none";
      displayCount = 1;
    }
  });

  let control = document.querySelector("#control");
  let controlCenter = document.querySelector(".control-center");
  let menuCount = 0;
  control.addEventListener("click", () => {
    if (menuCount) {
      controlCenter.style.display = "grid";
      menuCount = 0;
      displayContainer.style.display = "none";
      displayCount = 1;
    } else {
      controlCenter.style.display = "none";
      menuCount = 1;
    }
  });

  document.body.addEventListener("click", (e) => {
    const isInsideControl = control.contains(e.target);
    const isInsideControlCenter = controlCenter.contains(e.target);
    const isInsideBrightness = brightness.contains(e.target);
    const isInsideDisplayContainer = displayContainer.contains(e.target);

    if (
      !isInsideControl &&
      !isInsideControlCenter &&
      !isInsideBrightness &&
      !isInsideDisplayContainer
    ) {
      displayContainer.style.display = "none";
      controlCenter.style.display = "none";
      menuCount = 1;
      displayCount = 1;
    }
  });
}

displayContolOpener();

function date() {
  const dt = new Date();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = days[dt.getDay()];
  let month = months[dt.getMonth()];
  let date = dt.getDate();

  return { day, month, date };
}

function time() {
  const dt = new Date();

  let hours = dt.getHours();
  let minutes = dt.getMinutes();
  let seconds = dt.getSeconds();

  let hr = 0,
    min = 0,
    sec = 0,
    mer = 0;

  if (hours > 12) {
    hr = String(hours - 12).padStart("2", "0");
    min = String(minutes).padStart("2", "0");
    sec = String(seconds).padStart("2", "0");
    mer = "PM";
  } else {
    hr = String(hours).padStart("2", "0");
    min = String(minutes).padStart("2", "0");
    sec = String(seconds).padStart("2", "0");
    mer = "AM";
  }

  return { hr, min, sec, mer };
}

function clockDateTime() {
  function updateClock() {
    const currentTime = time();
    const dt = date();

    document.querySelector(".time").innerHTML =
      `${currentTime.hr}:${currentTime.min} ${currentTime.mer}`;

    document.querySelector(".date").innerHTML =
      `${dt.day} ${dt.month} ${dt.date}`;
  }

  updateClock(); // initial call immediately
  setInterval(updateClock, 1000); // update every second
}

clockDateTime();

const wifiIcon = document.querySelector("#wifi-icon");
const wifiStatus = document.querySelector("#wifi-status");
const wifiRound = document.querySelector(".wifi .round");

wifiIcon.addEventListener("click", () => {
  const isOff = wifiIcon.classList.toggle("ri-wifi-off-line"); // returns true if it was added

  // Toggle between icons
  wifiIcon.classList.toggle("ri-wifi-fill", !isOff);

  // Update status and background
  wifiStatus.textContent = isOff ? "Off" : "On";
  wifiRound.style.backgroundColor = isOff ? "#3C3F44" : "#0B84FF";
});

const btIcon = document.querySelector("#bt-icon");
const btStatus = document.querySelector("#bt-status");
const btRound = document.querySelector(".bluetooth .round");

btIcon.addEventListener("click", () => {
  const isOff = btIcon.classList.toggle("ri-bluetooth-connect-line"); // if it adds it back, it's Off
  btIcon.classList.toggle("ri-bluetooth-fill", !isOff); // show "fill" only if On

  btStatus.textContent = isOff ? "Off" : "On";
  btRound.style.backgroundColor = isOff ? "#3C3F44" : "#0B84FF";
});

const adIcon = document.querySelector(".airdrop .pic");
const adStatus = document.querySelector("#ad-status");
let adOff = false;

adIcon.addEventListener("click", () => {
  adOff = !adOff;

  adIcon.style.backgroundColor = adOff ? "#3C3F44" : "#0B84FF";
  adStatus.textContent = adOff ? "Off" : "On";
});

function contextMenu() {
  let rClkWindow = document.querySelector(".right-click-window");
  let isInsideFinder = false;

  document.body.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    // Check if right-click is inside finder app
    const finderApp = document.getElementById("0");
    const finderWorkarea = finderApp?.querySelector(".finder-workarea");
    isInsideFinder =
      finderWorkarea?.contains(e.target) &&
      !finderApp.classList.contains("hidden");

    const menuWidth = rClkWindow.offsetWidth;
    const menuHeight = rClkWindow.offsetHeight;
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > pageWidth) x = pageWidth - menuWidth;
    if (y + menuHeight > pageHeight) y = pageHeight - menuHeight;

    rClkWindow.style.top = `${y}px`;
    rClkWindow.style.left = `${x}px`;
    rClkWindow.style.display = "flex";
  });

  document.body.addEventListener("click", () => {
    rClkWindow.style.display = "none";
  });

  // Store context location for new folder function
  window.finderContextActive = () => isInsideFinder;
}

contextMenu();

function newFolder() {
  const newFolderBtn = document.querySelector("#new-folder");
  if (newFolderBtn) {
    newFolderBtn.addEventListener("click", createNewFolder);
  }

  const maxFolderLimit = 84;
  let folderCount = 1;
  const createdFolders = [];

  const folderWidth = 80;
  const folderHeight = 100;
  const margin = 20;
  const desktopPadding = 20;

  let zIndexCounter = 1000;

  document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key === "N") {
      e.preventDefault();
      createNewFolder();
    }
  });

  function createNewFolder() {
    const isInFinder = window.finderContextActive?.() || false;

    if (!isInFinder && createdFolders.length >= maxFolderLimit) {
      alert("You can't create more than 84 folders on the desktop.");
      return;
    }

    const folder = document.createElement("div");
    const name = `Untitled folder ${folderCount++}`;

    if (isInFinder) {
      // Get finder folders from localStorage
      let finderFolders =
        JSON.parse(localStorage.getItem("finderFolders")) || [];

      // Add new folder
      finderFolders.push({
        id: Date.now(),
        name: name,
      });

      // Save to localStorage
      localStorage.setItem("finderFolders", JSON.stringify(finderFolders));

      // Switch finder to folders mode and reload
      const finderApp = document.getElementById("0");
      const workarea = finderApp.querySelector(".finder-workarea");
      const filenameDisplay = finderApp.querySelector("#filename");

      filenameDisplay.textContent = "folders";

      // Determine if finder is in big mode
      const isBig =
        finderApp.style.height === "100%" ||
        finderApp.classList.contains("fullscreen");

      // Reload folders view
      loadFolders(workarea, isBig);
    } else {
      // Create folder for desktop (original behavior)
      folder.className =
        "folder absolute flex flex-col justify-center items-center h-20 w-16 cursor-grab";
      folder.style.zIndex = zIndexCounter++;

      folder.innerHTML = `
        <img class="w-3/4 h-3/4" src="/assets/folder.png" alt="" draggable="false">
        <input
          type="text"
          class="text-white text-[.8vw] font-medium text-center placeholder:text-[.8vw] outline-none bg-transparent"
          placeholder="${name}"
          value="${name}"
          readonly
        />
      `;

      document.body.appendChild(folder);
      createdFolders.push(folder);

      const input = folder.querySelector("input");
      input.addEventListener("dblclick", () => {
        input.removeAttribute("readonly");
        input.focus();
        input.select();
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          input.setAttribute("readonly", true);
          input.blur();
        }
      });

      const img = folder.querySelector("img");
      const bringToFront = () => {
        folder.style.zIndex = zIndexCounter++;
      };
      img.addEventListener("mousedown", bringToFront);
      folder.addEventListener("mousedown", (e) => {
        if (e.target.tagName !== "INPUT") bringToFront();
      });

      dragSupport(img, folder);
      dragSupport(folder, folder);

      repositionFolders();
    }
  }

  function repositionFolders() {
    const screenHeight = window.innerHeight - desktopPadding * 2;
    const screenWidth = window.innerWidth - desktopPadding * 2;
    const maxPerColumn = Math.floor(screenHeight / (folderHeight + margin));

    createdFolders.forEach((folder, index) => {
      const row = index % maxPerColumn;
      const col = Math.floor(index / maxPerColumn);

      const top = row * (folderHeight + margin) + desktopPadding;
      const left = col * (folderWidth + margin) + desktopPadding;

      folder.style.top = `${top}px`;
      folder.style.left = `${left}px`;
    });
  }

  window.addEventListener("resize", repositionFolders);
}

newFolder();

function brightnessSeeker() {
  const brightnessSlider = document.querySelector(
    ".control-center .brightness input",
  );
  const brightnessProgressBar = document.querySelector(
    ".control-center .brightness progress",
  );
  const displayBrightnessSlider = document.querySelector(
    ".display-container .brightness input",
  );
  const displayBrightnessProgressBar = document.querySelector(
    ".display-container .brightness progress",
  );

  function syncBrightness(value) {
    // Sync all sliders
    brightnessSlider.value = value;
    displayBrightnessSlider.value = value;

    // Sync all progress bars
    brightnessProgressBar.value = value;
    displayBrightnessProgressBar.value = value;

    // Apply brightness
    const controller = document.querySelector(".brightness-controller");
    if (controller) {
      controller.style.filter = `brightness(${value}%)`;
    }
  }

  // Add event listeners
  brightnessSlider.addEventListener("input", () => {
    syncBrightness(brightnessSlider.value);
  });

  displayBrightnessSlider.addEventListener("input", () => {
    syncBrightness(displayBrightnessSlider.value);
  });
}

brightnessSeeker();

function soundSeeker() {
  const soundSlider = document.querySelector(".control-center .sound input");
  const soundProgressBar = document.querySelector(
    ".control-center .sound progress",
  );
  soundSlider.addEventListener("input", () => {
    soundProgressBar.value = soundSlider.value;
  });
}

soundSeeker();

function changeWallpaper() {
  let wallDiv = document.querySelector(".wallpaper-changer");
  let wallClose = document.querySelector(".wallpaper-changer nav button");
  let wallDrag = document.querySelector(".wallpaper-changer nav");

  dragSupport(wallDrag, wallDiv);

  document.querySelector("#change-wallpaper").addEventListener("click", () => {
    wallDiv.style.display = "flex";
  });

  wallClose.addEventListener("click", () => {
    wallDiv.style.display = "none";
  });

  const controller = document.querySelector(".brightness-controller");
  let imgs = document.querySelectorAll(".workarea img");
  imgs.forEach((img) => {
    img.addEventListener("click", () => {
      imgs.forEach((i) => {
        i.style.border = "none";
        i.style.filter = "blur(0)";
      });
      img.style.border = "1px solid blue";
      img.style.filter = "blur(2%)";
      controller.style.backgroundImage = `url(${img.getAttribute("src")})`;
    });
  });
}

changeWallpaper();

function dragSupport(dragElem, dragApp) {
  let isDragging = false,
    offsetX = 0,
    offsetY = 0;

  dragElem.addEventListener("mousedown", (e) => {
    // Disable dragging if app is fullscreen
    if (
      dragApp.style.height === "100%" ||
      dragApp.classList.contains("fullscreen")
    ) {
      return;
    }

    isDragging = true;
    offsetX = e.clientX - dragApp.offsetLeft;
    offsetY = e.clientY - dragApp.offsetTop;

    bringAppToFront(dragApp); // ✅ Changed from cameraApp to dragApp
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    // Also stop dragging if app was maximized during drag
    if (
      dragApp.style.height === "100%" ||
      dragApp.classList.contains("fullscreen")
    ) {
      isDragging = false;
      return;
    }

    dragApp.style.left = `${e.clientX - offsetX}px`;
    dragApp.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

function appBigger(app) {
  app.style.height = "100%";
  app.style.width = "100%";
  app.style.top = "0";
  app.style.left = "0";
  app.style.borderRadius = "0";
  app.classList.add("fullscreen");
  bringAppToFront(app);
}

function appResize(app) {
  app.style.height = "66%";
  app.style.width = "50%";
  app.style.top = "20%";
  app.style.left = "10%";
  app.style.borderRadius = "1vw";
  app.classList.remove("fullscreen");
  bringAppToFront(app);
}

function loadFolders(workarea, isBig) {
  let folders = JSON.parse(localStorage.getItem("finderFolders")) || [];

  workarea.innerHTML = "";
  workarea.className = "finder-workarea finder-folders grid p-4 overflow-auto";
  workarea.style.gridTemplateColumns = isBig
    ? "repeat(10, 1fr)"
    : "repeat(4, 1fr)";
  workarea.style.gap = "1rem";
  workarea.style.alignContent = "start";

  if (folders.length === 0) {
    workarea.innerHTML = `
      <p class="text-gray-400 col-span-full text-center mt-10">
        No folders yet. Right-click to create one 📁
      </p>`;
    return;
  }

  folders.forEach((folderData) => {
    const div = document.createElement("div");
    div.className =
      "folder-item flex flex-col items-center justify-start p-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors";
    div.style.maxWidth = "120px";

    div.innerHTML = `
      <img class="w-14 h-14 mb-1" src="/assets/folder.png" alt="" draggable="false">
      <input
        type="text"
        class="text-white text-xs font-medium text-center outline-none bg-transparent w-full px-1"
        style="line-height: 1.2; max-width: 100%; word-break: break-word;"
        value="${folderData.name}"
        readonly
      />
    `;

    const input = div.querySelector("input");

    // Double-click to rename
    input.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      input.removeAttribute("readonly");
      input.focus();
      input.select();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        input.setAttribute("readonly", true);
        input.blur();

        // Update in localStorage
        let folders = JSON.parse(localStorage.getItem("finderFolders")) || [];
        const folderIndex = folders.findIndex((f) => f.id === folderData.id);
        if (folderIndex !== -1) {
          folders[folderIndex].name = input.value;
          localStorage.setItem("finderFolders", JSON.stringify(folders));
        }
      }

      if (e.key === "Escape") {
        input.value = folderData.name;
        input.setAttribute("readonly", true);
        input.blur();
      }
    });

    input.addEventListener("blur", () => {
      input.setAttribute("readonly", true);
    });

    // Right-click to delete
    div.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (confirm(`Delete "${folderData.name}"?`)) {
        let folders = JSON.parse(localStorage.getItem("finderFolders")) || [];
        folders = folders.filter((f) => f.id !== folderData.id);
        localStorage.setItem("finderFolders", JSON.stringify(folders));

        // Determine if in big mode
        const finderApp = document.getElementById("0");
        const isBig =
          finderApp.style.height === "100%" ||
          finderApp.classList.contains("fullscreen");
        loadFolders(workarea, isBig);
      }
    });

    workarea.appendChild(div);
  });
}

function finderApp() {
  const finderApp = document.getElementById("0");
  const dock = document.getElementById("dock");
  const closeBtn = finderApp.querySelector("#close");
  const minimiseBtn = finderApp.querySelector("#minimise");
  const resizeBtn = finderApp.querySelector("#resize");
  const searchBar = finderApp.querySelector(".search-list");
  const searchBorder = finderApp.querySelector(".sBorder");
  const searchIcon = finderApp.querySelector(".search-icon");
  const workarea = finderApp.querySelector(".finder-workarea");

  let isBig = false;
  let isVisible = false;
  let isMinimized = false;
  let mode = "folders"; // Default mode

  finderApp.addEventListener("click", () => {
    bringAppToFront(finderApp);
  });

  function finderResize() {
    appResize(finderApp);
    finderApp.querySelector(".left").style.width = "23%";
    finderApp.querySelector(".right").style.width = "77%";
    searchBar.style.display = "none";
    searchBorder.style.display = "none";
    searchIcon.style.display = "block";
    dock.style.opacity = "1";
    dock.style.pointerEvents = "auto";
  }

  resizeBtn.addEventListener("click", () => {
    if (!isBig) {
      appBigger(finderApp);
      finderApp.querySelector(".left").style.width = "13%";
      finderApp.querySelector(".right").style.width = "87%";
      searchBar.style.display = "block";
      searchBorder.style.display = "flex";
      searchIcon.style.display = "none";
      workarea.style.gridTemplateColumns = "repeat(4, 1fr)";
    } else {
      finderResize();
      workarea.style.gridTemplateColumns = "repeat(3, 1fr)";
    }
    isBig = !isBig;
    isMinimized = false;

    // Reload current mode with new size
    if (mode === "folders") loadFolders(workarea, isBig);
    else if (mode === "photos") loadPhotos(workarea, isBig);
  });

  function toggleApp(app) {
    if (isMinimized || !isVisible) {
      app.classList.remove("hidden");
      isVisible = true;
      isMinimized = false;
    } else {
      app.classList.add("hidden");
      isVisible = false;
      isMinimized = true;
    }
  }

  closeBtn.addEventListener("click", () => {
    finderApp.classList.add("hidden");
    isVisible = false;
    isMinimized = false;
    finderResize();
    isBig = false;
  });

  minimiseBtn.addEventListener("click", () => {
    toggleApp(finderApp);
  });

  document.querySelector("#finder").addEventListener("click", () => {
    if (!isVisible) {
      finderApp.classList.remove("hidden");
      bringAppToFront(finderApp);

      // Load the current mode
      if (mode === "photos") {
        loadPhotos(workarea, isBig);
      } else if (mode === "folders") {
        loadFolders(workarea, isBig);
      }

      isVisible = true;
    } else {
      finderApp.classList.add("hidden");
      isVisible = false;
    }
  });

  function dragFinder() {
    const dragBar1 = finderApp.querySelector(".right nav");
    const dragBar2 = finderApp.querySelector(".left nav");

    dragSupport(dragBar1, finderApp);
    dragSupport(dragBar2, finderApp);
  }

  dragFinder();

  finderApp
    .querySelector(".favorites .Photos")
    .addEventListener("click", () => {
      mode = "photos";
      workarea.className =
        "finder-workarea finder-photos grid gap-4 p-4 overflow-auto";
      workarea.style.gridTemplateColumns = isBig
        ? "repeat(4, 1fr)"
        : "repeat(3, 1fr)";
      finderApp.querySelector("#filename").textContent = mode;
      loadPhotos(workarea, isBig);
    });

  finderApp
    .querySelector(".favorites .folders")
    .addEventListener("click", () => {
      mode = "folders";
      workarea.className =
        "finder-workarea finder-folders grid gap-4 p-4 overflow-auto";
      workarea.style.gridTemplateColumns = isBig
        ? "repeat(4, 1fr)"
        : "repeat(3, 1fr)";
      finderApp.querySelector("#filename").textContent = mode;
      loadFolders(workarea, isBig);
    });
}

function dock() {
  const dock = document.getElementById("dock");

  // Auto show/hide when ANY app is fullscreen
  document.addEventListener("mousemove", (e) => {
    const allApps = document.querySelectorAll("[data-app]");

    const isAnyFullscreen = Array.from(allApps).some(
      (app) =>
        !app.classList.contains("hidden") &&
        (app.style.height === "100%" || app.classList.contains("fullscreen")),
    );

    if (isAnyFullscreen) {
      if (e.clientY > window.innerHeight - 80) {
        dock.style.opacity = "1";
        dock.style.pointerEvents = "auto";
      } else {
        dock.style.opacity = "0";
        dock.style.pointerEvents = "none";
      }
    } else {
      dock.style.opacity = "1";
      dock.style.pointerEvents = "auto";
    }
  });

  // Bounce animation
  function applyBounceListeners() {
    document.querySelectorAll(".dock-icon").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.add("animate-bounce");
        setTimeout(() => btn.classList.remove("animate-bounce"), 700);
      });
    });
  }

  // Drag and drop reorder
  function applyDragListeners() {
    let dragSrcEl = null;

    function handleDragStart(e) {
      dragSrcEl = this;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", this.innerHTML);
    }

    function handleDragOver(e) {
      e.preventDefault();
      return false;
    }

    function handleDrop(e) {
      e.stopPropagation();
      if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData("text/html");
        applyBounceListeners();
        applyDragListeners();
      }
      return false;
    }

    document.querySelectorAll(".dock-icon").forEach((btn) => {
      btn.setAttribute("draggable", true);
      btn.addEventListener("dragstart", handleDragStart);
      btn.addEventListener("dragover", handleDragOver);
      btn.addEventListener("drop", handleDrop);
    });
  }

  applyBounceListeners();
  applyDragListeners();
}

function updateDockState(app) {
  const dock = document.getElementById(".dock");
  const isVisible = !app.classList.contains("hidden");
  const isFullscreen = app.style.height === "100%";

  if (!isVisible || !isFullscreen) {
    dock.style.opacity = "1";
    dock.style.pointerEvents = "auto";
  } else {
    dock.style.opacity = "0";
    dock.style.pointerEvents = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  dock()
  finderApp()
  codeApp()
  calculatorApp()
  cameraApp()
  photosApp()
  terminalApp()
  settingsApp()
});

function codeApp() {
  const codeApp = document.getElementById("1");
  const closeBtn = codeApp.querySelector("#close");
  const minimiseBtn = codeApp.querySelector("#minimise");
  const resizeBtn = codeApp.querySelector("#resize");
  const dragBar = codeApp.querySelector(".c-up-nav");

  let isBig = 0;
  let isVisible = 0;

  document.querySelector("#code").addEventListener("click", () => {
    if (!isVisible) {
      codeApp.classList.remove("hidden");
      appResize(codeApp);
    } else {
      codeApp.classList.add("hidden");
    }
    isVisible = !isVisible;
  });

  closeBtn.addEventListener("click", () => {
    codeApp.classList.add("hidden");
    appResize(codeApp);
    isBig = 0;
    isVisible = 0;
  });

  minimiseBtn.addEventListener("click", () => {
    codeApp.classList.add("hidden");
    isVisible = 0;
  });

  resizeBtn.addEventListener("click", () => {
    if (!isBig) {
      appBigger(codeApp);
      isBig = 1;
    } else {
      appResize(codeApp);
      isBig = 0;
    }
  });

  dragSupport(dragBar, codeApp);
}

function calculatorApp() {
  const calculatorApp = document.querySelector("#calculatorApp");
  const closeBtn = document.querySelector("#calculatorApp #close");
  const minimiseBtn = document.querySelector("#calculatorApp #minimise");
  const dragBar = document.querySelector("#calculatorApp .c-up-nav");
  const calcDisplay = document.querySelector("#calculatorApp .calcdisplay");
  const calcBtn = document.querySelector("#calculatorApp .calcbuttons");

  let isVisible = 0;

  function formatNumber(num) {
    if (isNaN(num) || !isFinite(num)) return "Error";

    const numValue = parseFloat(num);

    if (Number.isInteger(numValue)) {
      return numValue.toString();
    }

    const rounded = Math.round(numValue * 1000) / 1000;
    return rounded.toString();
  }

  function processInput(value) {
    if (value === "Backspace" || value === "Delete") {
      calcDisplay.textContent = calcDisplay.textContent.slice(0, -1);
    } else if (value === "c" || value === "C" || value === "Escape") {
      calcDisplay.textContent = "";
    } else if (value === "=" || value === "Enter") {
      try {
        let expression = calcDisplay.textContent
          .replace(/×/g, "*")
          .replace(/÷/g, "/");

        const result = eval(expression);
        calcDisplay.textContent = formatNumber(result);
      } catch {
        calcDisplay.textContent = "Error";
      }
    } else if (value === "+/-") {
      if (calcDisplay.textContent && calcDisplay.textContent !== "Error") {
        const num = parseFloat(calcDisplay.textContent) * -1;
        calcDisplay.textContent = formatNumber(num);
      }
    } else if (
      [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        ".",
        "+",
        "-",
        "*",
        "/",
        "%",
        "×",
        "÷",
      ].includes(value)
    ) {
      calcDisplay.textContent += value;
    }

    localStorage.setItem("calcResult", JSON.stringify(calcDisplay.textContent));
  }

  document.querySelector("#calculator").addEventListener("click", () => {
    if (!isVisible) {
      calculatorApp.classList.remove("hidden");
      bringAppToFront(calculatorApp);
      isVisible = 1;
      calcDisplay.textContent =
        JSON.parse(localStorage.getItem("calcResult")) || "";
    } else {
      calculatorApp.classList.add("hidden");
      isVisible = 0;
    }
  });

  closeBtn.addEventListener("click", () => {
    calculatorApp.classList.add("hidden");
    calcDisplay.textContent = "";
    isVisible = 0;
  });

  minimiseBtn.addEventListener("click", () => {
    calculatorApp.classList.add("hidden");
    isVisible = 0;
  });

  calcBtn.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const value = button.innerText.trim();

    if (button.querySelector("i")) {
      processInput("Backspace");
    } else {
      processInput(value);
    }
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    // Only process keyboard input when calculator is visible
    if (!isVisible) return;

    e.preventDefault();

    const key = e.key;

    // Map keyboard keys to calculator inputs
    if (key === "Backspace" || key === "Delete") {
      processInput("Backspace");
    } else if (key === "Escape" || key.toLowerCase() === "c") {
      processInput("C");
    } else if (key === "Enter" || key === "=") {
      processInput("=");
    } else if (key === "*") {
      processInput("×");
    } else if (key === "/") {
      processInput("÷");
    } else if (
      [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        ".",
        "+",
        "-",
        "%",
      ].includes(key)
    ) {
      processInput(key);
    }
  });

  calculatorApp.addEventListener("click", () => {
    bringAppToFront(calculatorApp);
  });

  dragSupport(dragBar, calculatorApp);
}

function cameraApp() {
  const cameraApp = document.querySelector("#cameraApp");
  const video = document.querySelector("#cameraApp #video");
  const canvas = document.querySelector("#cameraApp #canvas");
  const snap = document.getElementById("snap");

  const closeBtn = document.querySelector("#cameraApp #close");
  const minimiseBtn = document.querySelector("#cameraApp #minimise");
  const resizeBtn = document.querySelector("#cameraApp #resize");
  const dragBar = document.querySelector("#cameraApp .c-up-nav");

  let cameraStream = null;

  function startCamera() {
    if (cameraStream) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        cameraStream = stream;
        video.srcObject = stream;
      })
      .catch((err) => {
        alert("Camera access denied or not available.");
        console.error(err);
      });
  }

  function stopCamera() {
    if (!cameraStream) return;

    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    video.srcObject = null;
  }

  let isBig = 0;
  let isVisible = 0;

  document.querySelector("#camera").addEventListener("click", () => {
    if (!isVisible) {
      cameraApp.classList.remove("hidden");
      appResize(cameraApp);
      bringAppToFront(cameraApp);
      startCamera();
      isVisible = 1;
    } else {
      cameraApp.classList.add("hidden");
      stopCamera();
      isVisible = 0;
    }
  });

  closeBtn.addEventListener("click", () => {
    cameraApp.classList.add("hidden");
    appResize(cameraApp);
    stopCamera();
    isBig = 0;
    isVisible = 0;
  });

  minimiseBtn.addEventListener("click", () => {
    cameraApp.classList.add("hidden");
    stopCamera();
    toggleApp(cameraApp);
    isVisible = 0;
  });

  resizeBtn.addEventListener("click", () => {
    if (!isBig) {
      appBigger(cameraApp);
      cameraApp
        .querySelector(".capture-overlay")
        .classList.add("camera-capture-in-big-screen");
      isBig = 1;
    } else {
      appResize(cameraApp);
      cameraApp
        .querySelector(".capture-overlay")
        .classList.remove("camera-capture-in-big-screen");
      isBig = 0;
    }
  });

  dragSupport(dragBar, cameraApp);

  function capturePhoto() {
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");

    saveToLocalStorage(imageData);
    flashEffect();
  }

  function saveToLocalStorage(image) {
    let photos = JSON.parse(localStorage.getItem("cameraPhotos")) || [];

    photos.push({
      id: Date.now(),
      src: image,
    });

    if (photos.length > 7) {
      alert("You can only save up to 7 photos.");
    }

    localStorage.setItem("cameraPhotos", JSON.stringify(photos));

    // ✅ Dispatch custom event to notify other parts of the app
    window.dispatchEvent(new CustomEvent("photosCaptured"));
  }

  snap.addEventListener("click", capturePhoto);

  function flashEffect() {
    const flash = document.createElement("div");
    flash.className =
      "absolute inset-0 bg-white opacity-80 animate-ping pointer-events-none";
    cameraApp.appendChild(flash);

    setTimeout(() => flash.remove(), 200);
  }
}

function loadPhotos(workarea, isBig) {
  let photos = JSON.parse(localStorage.getItem("cameraPhotos")) || [];

  workarea.innerHTML = "";

  if (photos.length === 0) {
    workarea.innerHTML = `
        <p class="text-gray-400 col-span-3 text-center mt-10">
          No photos yet 📸
        </p>`;
    return;
  }

  photos
    .slice()
    .reverse()
    .forEach((photo) => {
      const div = document.createElement("div");

      div.className = isBig ? "big-gallery" : "small-gallery";

      div.innerHTML = `
        <img src="${photo.src}">
        <h6>${photo.id}</h6>
      `;

      // 🔍 PREVIEW
      div.addEventListener("click", () => {
        const preview = document.createElement("div");
        preview.className =
          "fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]";

        preview.innerHTML = `
          <img src="${photo.src}" 
                class="max-h-[90%] max-w-[90%] object-cover rounded-lg shadow-xl">
        `;

        preview.addEventListener("click", () => preview.remove());
        document.body.appendChild(preview);
      });

      // 🗑️ DELETE (RIGHT CLICK)
      div.addEventListener("contextmenu", (e) => {
        e.preventDefault();

        let photos = JSON.parse(localStorage.getItem("cameraPhotos")) || [];

        photos = photos.filter((p) => p.id !== photo.id);

        localStorage.setItem("cameraPhotos", JSON.stringify(photos));

        loadPhotos(workarea, isBig);
      });

      workarea.appendChild(div);
    });
}

function photosApp() {
  const photoApp = document.getElementById("photos-app");
  const workarea = photoApp.querySelector(".gallery-workarea");

  const closeBtn = photoApp.querySelector("#close");
  const minimiseBtn = photoApp.querySelector("#minimise");
  const resizeBtn = photoApp.querySelector("#resize");

  const dragBar1 = photoApp.querySelector(".left .navigation");
  const dragBar2 = photoApp.querySelector(".right nav");

  let isBig = 0;
  let isVisible = 0;

  window.addEventListener("photosCaptured", () => {
    // Only reload if the photos app is currently visible
    if (isVisible) {
      loadPhotos(workarea, isBig);
    }
  });

  // 📸 OPEN APP
  document.querySelector("#photos").addEventListener("click", () => {
    if (!isVisible) {
      photoApp.classList.remove("hidden");
      appResize(photoApp);
      bringAppToFront(photoApp);
      loadPhotos(workarea, isBig);
      isVisible = 1;
    } else {
      photoApp.classList.add("hidden");
      isVisible = 0;
    }
  });

  // ❌ CLOSE
  closeBtn.addEventListener("click", () => {
    photoApp.classList.add("hidden");
    appResize(photoApp);
    isBig = 0;
    isVisible = 0;
  });

  // ➖ MINIMISE
  minimiseBtn.addEventListener("click", () => {
    photoApp.classList.add("hidden");
    toggleApp(photoApp);
    isVisible = 0;
  });

  // 🔳 RESIZE (BIG / SMALL)
  resizeBtn.addEventListener("click", () => {
    if (!isBig) {
      appBigger(photoApp);
      isBig = 1;

      photoApp.querySelector(".left").style.width = "13%";
      photoApp.querySelector(".right").style.width = "87%";
      photoApp.querySelector(".gallery-workarea").style.gridTemplateColumns =
        "repeat(4, 1fr)";
    } else {
      appResize(photoApp);
      isBig = 0;

      photoApp.querySelector(".left").style.width = "23%";
      photoApp.querySelector(".right").style.width = "77%";
      photoApp.querySelector(".gallery-workarea").style.gridTemplateColumns =
        "repeat(3, 1fr)";
    }

    loadPhotos(workarea, isBig);
  });

  // 🖱️ DRAG SUPPORT
  dragSupport(dragBar1, photoApp);
  dragSupport(dragBar2, photoApp);
}

function terminalApp() {
  const terminalApp = document.getElementById("terminal-app");
  const closeBtn = terminalApp.querySelector("#close");
  const minimiseBtn = terminalApp.querySelector("#minimise");
  const resizeBtn = terminalApp.querySelector("#resize");
  const dragBar = terminalApp.querySelector(".c-up-nav");

  const terminalWorkArea = terminalApp.querySelector(".t-workarea");

  let isBig = 0;
  let isVisible = 0;

  document.querySelector("#terminal").addEventListener("click", () => {
    if (!isVisible) {
      terminalApp.classList.remove("hidden");
      appResize(terminalApp);
      bringAppToFront(terminalApp);
      isVisible = 1;
    } else {
      terminalApp.classList.add("hidden");
      isVisible = 0;
    }
  });

  closeBtn.addEventListener("click", () => {
    terminalApp.classList.add("hidden");
    appResize(terminalApp);
    isBig = 0;
    isVisible = 0;
  });

  minimiseBtn.addEventListener("click", () => {
    terminalApp.classList.add("hidden");
    isVisible = 0;
  });

  resizeBtn.addEventListener("click", () => {
    if (!isBig) {
      appBigger(terminalApp);
      isBig = 1;
      terminalApp.style.fontSize = "1.1vw";
    } else {
      appResize(terminalApp);
      isBig = 0;
      terminalApp.style.fontSize = ".9vw";
    }
  });

  dragSupport(dragBar, terminalApp);

  // Initialize terminal
  let dt = date();
  let currTime = time();

  terminalWorkArea.innerHTML = `<h5 class="text-white mb-2">Last login: ${dt.day} ${dt.month} ${dt.date} ${String(currTime.hr).padStart(2, "0")}:${String(currTime.min).padStart(2, "0")}:${String(currTime.sec).padStart(2, "0")} ${currTime.mer}</h5>`;

  // Add initial input line
  addInputLine();

  let commandHistory = [];
  const user = "simulation";
  const host = "Users-MacBook";
  const currentDir = "~";

  // Use event delegation - single listener on the container
  terminalWorkArea.addEventListener("keydown", (e) => {
    if (e.target.classList.contains("terminal-input") && e.key === "Enter") {
      e.preventDefault();

      const command = e.target.value.trim();

      const inputLine = e.target.closest(".input-line");

      // Get prompt text
      const promptText = inputLine.querySelector("label").textContent;

      // Store command
      if (command) {
        commandHistory.push(command);
      }

      // Replace input line with static text (like real terminal)
      inputLine.outerHTML = `
  <div class="flex gap-2 items-center">
    <span class="whitespace-nowrap text-green-400">${promptText}</span>
    <span class="text-white">${command}</span>
  </div>
`;

      // help command
      if (command.toLowerCase() === "help") {
        terminalWorkArea.innerHTML += `
  <p class="response text-white mb-1">Available commands:</p>
  <ul class="response text-gray-300 mb-2 pl-4">
    <li><span class="text-blue-400">help</span> - Show available commands</li>
    <li><span class="text-blue-400">date</span> - Display current date and time</li>
    <li><span class="text-blue-400">clear</span> - Clear terminal screen</li>
    <li><span class="text-blue-400">about</span> - System information</li>
    <li><span class="text-blue-400">echo</span> - Print text</li>
    <li><span class="text-blue-400">whoami</span> - Show current user</li>
    <li><span class="text-blue-400">hostname</span> - Show hostname</li>
    <li><span class="text-blue-400">pwd</span> - Show current directory</li>
    <li><span class="text-blue-400">history</span> - Show command history</li>
  </ul>`;
      }
      // date command
      else if (command.toLowerCase() === "date") {
        const dt = date();
        const currTime = time();
        terminalWorkArea.innerHTML += `<p class="response text-white mb-2">${dt.day} ${dt.month} ${dt.date} ${String(currTime.hr).padStart(2, "0")}:${String(currTime.min).padStart(2, "0")}:${String(currTime.sec).padStart(2, "0")} ${currTime.mer}</p>`;
      }
      // clear
      else if (command.toLowerCase() === "clear") {
        terminalWorkArea.innerHTML = "";
      }
      // about
      else if (command.toLowerCase() === "about") {
        terminalWorkArea.innerHTML += `
        <p class="response text-white mb-1">Hi, this is macOS Simulation Terminal v1.0</p>
        <p class="response text-gray-400 mb-2">Built in vanilla JavaScript</p>`;
      }
      // echo
      else if (command.startsWith("echo ")) {
        const text = command.slice(5);
        terminalWorkArea.innerHTML += `<p class="response text-white mb-2">${text}</p>`;
      }
      // whoami
      else if (command.toLowerCase() === "whoami") {
        terminalWorkArea.innerHTML += `<p class="response text-white mb-2">${user}</p>`;
      }
      // hostname
      else if (command.toLowerCase() === "hostname") {
        terminalWorkArea.innerHTML += `<p class="response text-white mb-2">${host}</p>`;
      }

      // pwd
      else if (command.toLowerCase() === "pwd") {
        terminalWorkArea.innerHTML += `<p class="response text-white mb-2">/${currentDir}</p>`;
      }
      //history
      else if (command.toLowerCase() === "history") {
        if (commandHistory.length === 0) {
          terminalWorkArea.innerHTML += `<p class="response text-gray-400 mb-2">No history</p>`;
        } else {
          const historyList = commandHistory
            .map(
              (cmd) =>
                `<p class="response text-blue-400">&nbsp;&nbsp; ${cmd}</p>`,
            )
            .join("");

          terminalWorkArea.innerHTML += `<div class="mb-2">${historyList}</div>`;
        }
      }
      // error
      else if (command) {
        terminalWorkArea.innerHTML += `<p class="response text-red-400 mb-2">zsh: command not found: ${command}</p>`;
      }

      // Add new input line and focus it
      addInputLine();

      // Scroll to bottom
      terminalWorkArea.scrollTop = terminalWorkArea.scrollHeight - 10;
    }
  });

  // Bring to front when clicked
  terminalApp.addEventListener("click", () => {
    bringAppToFront(terminalApp);
  });

  terminalWorkArea.addEventListener("click", (e) => {
    // If user clicks directly on input, let default behavior happen
    if (e.target.classList.contains("terminal-input")) return;

    // Find the last input field
    const lastInput = terminalWorkArea.querySelector(
      ".input-line:last-child .terminal-input",
    );

    if (lastInput) {
      lastInput.focus();
    }
  });

  // Helper function to add input line
  function addInputLine() {
    const inputLineHTML = `
      <div class="input-line flex gap-2 items-center">
        <label class="whitespace-nowrap text-green-400">simulation@Users-MacBook ~ %</label>
        <input type="text" class="terminal-input bg-transparent outline-none text-white flex-1" autocomplete="off" spellcheck="false" />
      </div>`;

    terminalWorkArea.insertAdjacentHTML("beforeend", inputLineHTML);

    // Focus the newly added input
    const newInput = terminalWorkArea.querySelector(
      ".input-line:last-child .terminal-input",
    );
    if (newInput) {
      newInput.focus();
    }
  }
}

function settingsApp() {
  const settingsApp = document.getElementById("settings-app");
  const closeBtn = settingsApp.querySelector("#close");
  const minimiseBtn = settingsApp.querySelector("#minimise");
  const workarea = settingsApp.querySelector(".settings-workarea");
  const about = settingsApp.querySelector(".dSec .about");
  const systemGuide = settingsApp.querySelector(".dSec .system-guide");
  const socials = settingsApp.querySelector(".dSec .socials");

  let isVisible = false;
  let isMinimized = false;
  let mode = "about";

  const conn = [
    {
      connName: "LinkedIn",
      link: "https://www.linkedin.com/in/hritam-samanta-57258b277/",
      icon: '<i class="ri-linkedin-box-fill xl:text-[1.5vw] 2xl:text-[1.2vw] z-7"></i>'
    },
    {
      connName: "Github",
      link: "https://github.com/hrit444",
      icon: '<i class="ri-github-fill xl:text-[1.5vw] 2xl:text-[1.2vw] z-7"></i>'
    },

    {
      connName: "Instagram",
      link: "https://www.instagram.com/hritam4862/",
      icon: '<i class="ri-instagram-fill xl:text-[1.5vw] 2xl:text-[1.2vw] z-7"></i>'
    },
    {
      connName: "Twitter",
      link: "https://x.com/444_dead",
      icon: '<i class="ri-twitter-x-line xl:text-[1.5vw] 2xl:text-[1.2vw] z-7"></i>'
    },
  ]

  settingsApp.addEventListener("click", () => {
    bringAppToFront(settingsApp);
  });

  function dragSettings() {
    const dragBar1 = settingsApp.querySelector(".right nav");
    const dragBar2 = settingsApp.querySelector(".left nav");

    dragSupport(dragBar1, settingsApp);
    dragSupport(dragBar2, settingsApp);
  }

  dragSettings()

  function toggleApp(app) {
    if (isMinimized || !isVisible) {
      app.classList.remove("hidden");
      isVisible = true;
      isMinimized = false;
    } else {
      app.classList.add("hidden");
      isVisible = false;
      isMinimized = true;
    }
  }

  closeBtn.addEventListener("click", () => {
    settingsApp.classList.add("hidden");
    isVisible = false;
    isMinimized = false;
    settingsResize();
    isBig = false;
  });

  minimiseBtn.addEventListener("click", () => {
    toggleApp(settingsApp);
  });

  function loadAbout(workarea){
    workarea.innerHTML = `
    <div class=" flex justify-center h-fit">
              <img class="h-[4.1vw]" src="./assets/air-mac.png" alt="">
            </div>
            <div>
              <h3 class="text-center text-[1.1vw] mt-4">MacOS Simulation</h3>
              <h4 class="text-center text-[.95vw] opacity-75">Version 1.0.0</h4>
            </div>
            <div class="credits rounded-xl border border-[#515151] justify-between gap-2 bg-[#2A2B29] px-4 py-2 group transition-all duration-200 mt-[2vw]">
              <h3 class="text-[1.1vw] group-hover:text-[1.15vw] transition-all duration-200">Credits</h3>
              <ul class="list-disc list-inside opacity-75 mt-2 text-[.9vw] group-hover:text-[.95vw] transition-all duration-200">
                <li>Design and Development: Hritam Samanta. <a href="https://github.com/hrit444" target="_blank" class="text-blue-400 underline">Github</a></li>
                <li>Icons made by <a href="https://remixicon.com/" target="_blank" class="text-blue-400 hover:underline">remixicon</a>, <a href="https://www.flaticon.com/" target="_blank" class="text-blue-400 hover:underline">flaticon</a>, <a href="https://macosicons.com/" target="_blank" class="text-blue-400 hover:underline">macosicons</a>.</li>
                <li>Special thanks to the <a href="https://sheryians.com/" target="_blank" class="text-blue-400 hover:underline">Sheryians</a> community for inspiration</li>
              </ul>
            </div>
      `;
  }

  function loadSystemGuide(workarea){
    workarea.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">System Guide</h2>
      <p class="text-gray-300 mb-2">Here's a quick guide to help you navigate and use this macOS simulation:</p>
      <ul class="text-gray-300 mb-2 pl-4 list-disc">
        <li><span class="text-blue-400">Opening Apps:</span> Click on the icons in the dock or the desktop to open apps. Click again to close them.</li>
        <li><span class="text-blue-400">Moving Apps:</span> Click and drag the top navigation bar of any app to move it around the screen.</li>
        <li><span class="text-blue-400">Resizing Apps:</span> Use the resize button (square icon) in the top left of each app to toggle between small and big sizes.</li>
        <li><span class="text-blue-400">Minimizing Apps:</span> Click the minimize button (dash icon) to hide an app. Click its dock icon to bring it back.</li>
        <li><span class="text-blue-400">Closing Apps:</span> Click the close button (x icon) to close an app. You can reopen it from the dock.</li>
        <li><span class="text-blue-400">Photos App:</span> Use the camera app to take photos, which will then appear in the photos app. Right-click on a photo in the gallery to delete it.</li>
        <li><span class="text-blue-400">Terminal App:</span> Type commands like <code>help</code>, <code>date</code>, or <code>echo Hello</code> to interact with the terminal.</li>
      </ul>
      <p class="text-gray-300 mb-2">Have fun exploring and simulating macOS! If you have any questions or want to contribute, check out the GitHub repository linked in the About section.</p>
    `;
  }

function loadSocials(workarea){
  workarea.innerHTML = `
  <div class="p-1">
    <h2 class="text-2xl mb-1">Wanna <span class="text-blue-400">get</span> in touch?</h2>
    <h4 class="mb-4">Let’s build and ship something remarkable.</h4>
    <div class="flex flex-col gap-2">
      ${conn.map(elem => `
        <a class="conn flex items-center rounded-xl border border-[#515151] justify-between gap-2 bg-[#2A2B29] px-4 py-2 hover:bg-[#1d79e5] hover:px-6 transition-all duration-200"
          target="_blank"
          href="${elem.link}"
        >
          <div class="flex items-center gap-2 py-1">
            ${elem.icon}
            <h5>${elem.connName}</h5>
          </div>
          <i class="ri-arrow-right-s-line"></i>
        </a>
      `).join("")}
    </div>
  <div> 
  `;
}

  document.querySelector("#settings").addEventListener("click", () => {
    if (!isVisible) {
      settingsApp.classList.remove("hidden");
      bringAppToFront(settingsApp);

      if (mode === "about") {
        loadAbout(workarea);
      } else if (mode === "system-guide") {
        loadSystemGuide(workarea);
      } else if (mode === "socials") {
        loadSocials(workarea);
      }
      isVisible = true;
    } else {
      settingsApp.classList.add("hidden");
      isVisible = false;
    }
  });

  about.addEventListener("click", () => {
    mode = "about";
    loadAbout(workarea);
  });

  systemGuide.addEventListener("click", () => {
    mode = "system-guide";
    loadSystemGuide(workarea);
  });

  socials.addEventListener("click", () => {
    mode = "socials";
    loadSocials(workarea);
  });

}