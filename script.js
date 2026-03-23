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

function clockDateTime() {
  function time() {
    const dt = new Date();

    let hours = dt.getHours();
    let minutes = dt.getMinutes();

    let hr = 0,
      min = 0,
      mer = 0;

    if (hours > 12) {
      hr = String(hours - 12).padStart("2", "0");
      min = String(minutes).padStart("2", "0");
      mer = "PM";
    } else {
      hr = String(hours).padStart("2", "0");
      min = String(minutes).padStart("2", "0");
      mer = "AM";
    }

    document.querySelector(".time").innerHTML = `${hr}:${min}${mer}`;
  }

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

    document.querySelector(".date").innerHTML = `${day} ${month} ${date}`;
  }

  setInterval(() => {
    time();
    date();
  }, 1000);
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

  document.body.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // Stop default menu

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

  // Prevent menu from closing when clicking inside it
  // rClkWindow.addEventListener("click", (e) => {
  //   e.stopPropagation();
  // });
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

  // Folder size and spacing
  const folderWidth = 80;
  const folderHeight = 100;
  const margin = 20;
  const desktopPadding = 20; // prevent touching edges

  let zIndexCounter = 1000;

  document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key === "N") {
      e.preventDefault();
      createNewFolder();
    }
  });

  function createNewFolder() {
    if (createdFolders.length >= maxFolderLimit) {
      alert("You can’t create more than 84 folders on the desktop.");
      return;
    }

    const folder = document.createElement("div");
    folder.className =
      "folder absolute flex flex-col justify-center items-center h-20 w-16 cursor-grab";
    folder.style.zIndex = zIndexCounter++;

    const name = `Untitled folder ${folderCount++}`;

    folder.innerHTML = `
      <img class="w-3/4 h-3/4" src="/folder.png" alt="" draggable="false">
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

    repositionFolders(); // Align folders
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

    bringAppToFront(dragApp);  // ✅ Changed from cameraApp to dragApp
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

function finderApplication() {
  const finderApp = document.getElementById("0");
  const dock = document.getElementById("dock");
  const closeBtn = finderApp.querySelector("#close");
  const minimiseBtn = finderApp.querySelector("#minimise");
  const resizeBtn = finderApp.querySelector("#resize");
  const searchBar = finderApp.querySelector(".search-list");
  const searchBorder = finderApp.querySelector(".sBorder");
  const searchIcon = finderApp.querySelector(".search-icon");

  let isBig = false;
  let isVisible = false;
  let isMinimized = false;

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
    } else {
      finderResize();
    }
    isBig = !isBig;
    isMinimized = false;
    // updateDockState();
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

    // updateDockState();
  }

  closeBtn.addEventListener("click", () => {
    finderApp.classList.add("hidden");
    isVisible = false;
    isMinimized = false;
    finderResize(); // Reset to normal size
    isBig = false;
    // updateDockState();
  });

  minimiseBtn.addEventListener("click", () => {
    toggleApp(finderApp);
  });

  document.querySelector("#finder").addEventListener("click", () => {
    if (!isVisible) {
      finderApp.classList.remove("hidden");
      bringAppToFront(finderApp);
      isVisible = 1;
    } else {
      finderApp.classList.add("hidden");
      isVisible = 0;
    }

    // updateDockState();
  });

  // Drag support
  const dragBar1 = finderApp.querySelector(".right nav");
  const dragBar2 = finderApp.querySelector(".left nav");

  dragSupport(dragBar1, finderApp);
  dragSupport(dragBar2, finderApp);
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
  dock();
  finderApplication();
  codeApplication();
  calculatorApp();
  cameraApp();
  photosApp();
});

function codeApplication() {
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

  document.querySelector("#calculator").addEventListener("click", () => {
    if (!isVisible) {
      calculatorApp.classList.remove("hidden");
      bringAppToFront(calculatorApp);
      isVisible = 1;
      calcDisplay.textContent = JSON.parse(localStorage.getItem("calcResult")) || '';
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
    // updateDockState();
  });

  calcBtn.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const value = button.innerText.trim();

    if (button.querySelector("i")) {
      // Delete button
      calcDisplay.textContent = calcDisplay.textContent.slice(0, -1);
    } else if (value === "C") {
      calcDisplay.textContent = "";
    } else if (value === "=") {
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
    } else {
      calcDisplay.textContent += value;
    }

    localStorage.setItem("calcResult", JSON.stringify(calcDisplay.textContent));
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

  function loadPhotos() {
    photos = JSON.parse(localStorage.getItem("cameraPhotos")) || [];

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

          loadPhotos();
        });

        workarea.appendChild(div);
      });
  }

  window.addEventListener("photosCaptured", () => {
    // Only reload if the photos app is currently visible
    if (isVisible) {
      loadPhotos();
    }
  });

  // 📸 OPEN APP
  document.querySelector("#photos").addEventListener("click", () => {
    if (!isVisible) {
      photoApp.classList.remove("hidden");
      appResize(photoApp);
      bringAppToFront(photoApp);
      loadPhotos();
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

    loadPhotos();
  });

  // 🖱️ DRAG SUPPORT
  dragSupport(dragBar1, photoApp);
  dragSupport(dragBar2, photoApp);
}

