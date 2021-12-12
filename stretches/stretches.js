import { loadStretchMultipliers,
  saveStretchMultipliers,
  changeStretchSet,
  createCookie,
  getCookie
} from "./stretchSetup.js";

//Global timer
var time = 0;
var timer = setInterval(Tick, 1000);


const stretchSet = {
  CPPS: 0,
  FAB_SEVEN: 1
}


var sObj = {
  stretchSet : {
    CPPS: 0,
    FAB_SEVEN: 1
  },
  
  set : stretchSet.CPPS,
  
  
  stretchNames : [
    "Squat Stretch",
    "Leg Push",
    "Calves",
    "Hamstring Tie",
    "Figure Four",
    "Abdomen",
    "Child Pose",
    "Butterfly",
    "Forward Hip",
  ],
  currentStretch: -1, //Starts at negative to skip the first one if disabled
  stretchTimeMultipliers : [1, 1, 1, 2, 2, 1, 1, 1, 2],
  secondsPerStretch : 120,
  stretchColours : [
    "",
    "lightcoral",
    "salmon",
    "pink",
    "lightseagreen",
    "aqua",
    "limegreen",
    "green",
    "#58D68D",
    "yellow",
  ],
  stretchEnabled : [],
  
}

var paused = true;

document.addEventListener("DOMContentLoaded", () => {

  changeStretchSet(sObj);

  document.getElementById("stretchName").innerHTML = sObj.stretchNames[0];

  document.querySelectorAll("button").forEach((button) => {
    if (button.id == "pause")
      button.onclick = () => {
        if (sObj.currentStretch == -1) {
          //Check to hide options the first time
          let optionsMenu = document.getElementById("options");
          optionsMenu.style.display = "none";

          //Save a cookie of the time you set.
          createCookie("timeForSet" + (sObj.set), sObj.secondsPerStretch, 30);

          NextStretch();
        } else TogglePause();
      };
    else if (button.id == "halveTime")
      //Lower the time
      button.onclick = () => {
        if (sObj.secondsPerStretch <= 30) sObj.secondsPerStretch = 270;
        sObj.secondsPerStretch = sObj.secondsPerStretch - 30;
        button.innerHTML = "Time " + sObj.secondsPerStretch.toString();
      };
      else if (button.id == "save")
      button.onclick = () =>{saveStretchMultipliers(sObj);};
  });

  //Get cloning the checkbox to allow you to enable certain stretches
  let p = document.getElementById("enableStretch");

  for (let i = 0; i < sObj.stretchNames.length; i++) {
    //Checkbox
    let newCheck = p.cloneNode(true);
    newCheck.id = "enableStretch"+i.toString();
    newCheck.children[0].id = "check" + i.toString();
    newCheck.children[1].innerHTML = sObj.stretchNames[i];
    newCheck.children[1].for = "check1" + i.toString(); 
    console.log(sObj.stretchEnabled[i]);
    newCheck.children[0].checked=sObj.stretchEnabled[i];

    //Time slider
    newCheck.children[2].id = "timeSlider" + i.toString();
    newCheck.children[2].value = sObj.stretchTimeMultipliers[i] * 2;
    newCheck.children[3].for = "timeSlider" + i.toString();
    newCheck.children[3].innerHTML =
      sObj.stretchTimeMultipliers[i] * sObj.secondsPerStretch;

    //Toggle the stretch here!
    newCheck.children[0].onclick = () => {
      sObj.stretchEnabled[i] = !sObj.stretchEnabled[i];
      console.log(sObj.stretchEnabled[i]);
    };

    //Change stretch time multiplier here!
    newCheck.children[2].onchange = () => {
      let newVal = newCheck.children[2].value / 2;
      sObj.stretchTimeMultipliers[i] = newVal;
      newCheck.children[3].innerHTML = newVal * sObj.secondsPerStretch;
    };

    document.getElementById("options").appendChild(newCheck);
  }

  //Deselect all
  let disableButton = document.getElementById("disableAll");
  disableButton.onclick = () => {

    let enableAll=true;

      for (let i = 0; i < sObj.stretchNames.length; i++) {
        if (document.getElementById("check" + i.toString()).checked) enableAll=false;
      }

    for (let i = 0; i < sObj.stretchNames.length; i++) {
      sObj.stretchEnabled[i] = enableAll;
      document.getElementById("check" + i.toString()).checked = enableAll;
    }
  };

  

  //Hide the slider and check marks that got cloned
  p.children[0].style.display="none";
  p.children[1].style.display="none";
  p.children[2].style.display = "none";
  p.children[3].style.display = "none";


});

function Wait() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
}

function Tick() {
  if (!paused) {
    time += 1;

    //Display time
    document.getElementById("time").innerHTML =
      Math.floor(time / 60).toString() +
      ":" +
      (time % 60 < 10 ? "0" : "") +
      (time % 60).toString();

    //Vibrate phone when finished a cycle. Do it twice when over a minute.
    if (time % ((sObj.secondsPerStretch*sObj.stretchTimeMultipliers[sObj.currentStretch])) == 0) window.navigator.vibrate(500);
    //Vibrate for quick two part OG CPPS stretches (i.e. vibrate per minute instead of per two minutes)
    else if (time % (sObj.secondsPerStretch / 2) == 0 && sObj.currentStretch == 2  && set == sObj.stretchSet.CPPS)
      window.navigator.vibrate(500);
      //Vibrate for the 3 part lunge stretch
    //else if (time % ((sObj.secondsPerStretch*sObj.stretchTimeMultipliers[sObj.currentStretch])/3) == 0 && (sObj.currentStretch == 1 || sObj.currentStretch == 2) && sObj.set == stretchSet.FAB_SEVEN)
    //  window.navigator.vibrate(500);

    //Go on to the next stretch after the set amount of time in the arrays
    if (time >= sObj.secondsPerStretch * sObj.stretchTimeMultipliers[sObj.currentStretch])
      NextStretch();
  }
}

//Go to the next stretch once time is up or during the first unpause.
function NextStretch() {
  sObj.currentStretch++;

  //Go to name of next stretch
  var nextName = "";
  //Or don't if complete.
  if (sObj.currentStretch >= sObj.stretchNames.length) {
    nextName = "Complete!";
    TogglePause();
  } else nextName = sObj.stretchNames[sObj.currentStretch];
  document.getElementById("stretchName").innerHTML = nextName;

  //Change colour to next stretch colour
  if (sObj.currentStretch < sObj.stretchColours.length)
    document.getElementById("wrapper").style.backgroundColor =
      sObj.stretchColours[sObj.currentStretch];

  //Skip stretch if disabled
  if (!sObj.stretchEnabled[sObj.currentStretch]) {
    NextStretch();
    return;
  }

  time = 0;
  TogglePause();
}

function TogglePause() {
  paused = !paused;
  document.getElementById("pause").innerHTML = paused ? "Unpause" : "Pause";
}