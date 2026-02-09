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

      bringAppToFront(cameraApp)
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
    updateDockState();
  });

  function toggleFinder() {
    if (isMinimized || !isVisible) {
      finderApp.classList.remove("hidden");
      isVisible = true;
      isMinimized = false;
    } else {
      finderApp.classList.add("hidden");
      isVisible = false;
      isMinimized = true;
    }

    updateDockState();
  }

  closeBtn.addEventListener("click", () => {
    finderApp.classList.add("hidden");
    isVisible = false;
    isMinimized = false;
    finderResize(); // Reset to normal size
    isBig = false;
    updateDockState();
  });

  minimiseBtn.addEventListener("click", () => {
    toggleFinder();
  });

  const finderDockIcon = document.getElementById("finder");
  if (finderDockIcon) {
    finderDockIcon.addEventListener("click", () => {
      toggleFinder();
    });
  }

  // Drag support
  const dragBar1 = finderApp.querySelector(".right nav");
  const dragBar2 = finderApp.querySelector(".left nav");

  dragSupport(dragBar1, finderApp);
  dragSupport(dragBar2, finderApp);

  // Don't show on load
  finderApp.classList.add("hidden");
  isVisible = false;
  isMinimized = false;
  updateDockState();
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

function updateDockState() {
  const dock = document.getElementById("dock");
  const app = document.getElementById("0");
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
  finderApplication();
  codeApplication();
  cameraApp();

  dock();
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
      isVisible = 1;
    } else {
      codeApp.classList.add("hidden");
      isVisible = 0;
    }
    // isVisible = ;
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

function cameraApp() {
  const cameraApp = document.querySelector("#cameraApp");
  const video = document.querySelector("#cameraApp #video");
  const canvas = document.querySelector("#cameraApp #canvas");
  // const snap = document.getElementById("snap");

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
    updateDockState();
  });

  closeBtn.addEventListener("click", () => {
    cameraApp.classList.add("hidden");
    appResize(cameraApp);
    stopCamera();
    isBig = 0;
    isVisible = 0;
    updateDockState();
  });

  minimiseBtn.addEventListener("click", () => {
    cameraApp.classList.add("hidden");
    stopCamera();
    isVisible = 0;
    updateDockState();
  });

  resizeBtn.addEventListener("click", () => {
    if (!isBig) {
      appBigger(cameraApp);
      isBig = 1;
    } else {
      appResize(cameraApp);
      isBig = 0;
    }
    updateDockState();
  });

  dragSupport(dragBar, cameraApp);

  // snap.addEventListener("click", () => {
  //   const context = canvas.getContext("2d");
  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  //   context.drawImage(video, 0, 0, canvas.width, canvas.height);
  //   const imageData = canvas.toDataURL("image/png");
  //   downloadLink.href = imageData;
  //   downloadLink.classList.remove("hidden");
  // });
}
