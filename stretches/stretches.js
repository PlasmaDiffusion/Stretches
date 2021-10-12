//Global timer
var time = 0;
var timer = setInterval(Tick, 1000);

const stretchSet = {
  CPPS: 0,
  FAB_SEVEN: 1
}

var set = stretchSet.CPPS;


var stretchNames = [
  "Squat Stretch",
  "Leg Push",
  "Calves",
  "Hamstring Tie",
  "Figure Four",
  "Abdomen",
  "Child Pose",
  "Butterfly",
  "Forward Hip",
];
var currentStretch = -1; //Starts at negative to skip the first one if disabled
//Debug stretches
/*var stretchTimeMultipliers = [
  0.016,
  0.016,
  0.036,
  0.036,
  0.016,
  0.016,
  0.016,
  0.016,
];*/
var stretchTimeMultipliers = [1, 1, 1, 2, 2, 1, 1, 1, 2];
var secondsPerStretch = 120;
var stretchColours = [
  "",
  "lightcoral",
  "salmon",
  "pink",
  "lightseagreen",
  "aqua",
  "limegreen",
  "green",
  "yellow",
];
var stretchEnabled = [];

var paused = true;

document.addEventListener("DOMContentLoaded", () => {

  changeStretchSet();

  document.getElementById("stretchName").innerHTML = stretchNames[0];

  document.querySelectorAll("button").forEach((button) => {
    if (button.id == "pause")
      button.onclick = () => {
        if (currentStretch == -1) {
          //Check to hide options the first time
          let optionsMenu = document.getElementById("options");
          optionsMenu.style.display = "none";

          //Save a cookie of the time you set.
          createCookie("timeForSet" + (set), secondsPerStretch, 1);

          NextStretch();
        } else TogglePause();
      };
    else if (button.id == "halveTime")
      //Lower the time
      button.onclick = () => {
        if (secondsPerStretch <= 30) secondsPerStretch = 270;
        secondsPerStretch = secondsPerStretch - 30;
        button.innerHTML = "Time " + secondsPerStretch.toString();
      };
      else if (button.id == "save")
      button.onclick = () =>{saveStretchMultipliers(set);};
  });

  //Get cloning the checkbox to allow you to enable certain stretches
  let p = document.getElementById("enableStretch");

  for (let i = 0; i < stretchNames.length; i++) {
    //Checkbox
    let newCheck = p.cloneNode(true);
    newCheck.id = "enableStretch";
    +i.toString();
    newCheck.children[0].id = "check" + i.toString();
    newCheck.children[1].innerHTML = stretchNames[i];
    stretchEnabled.push(true);
    newCheck.children[1].for = "check1" + i.toString();

    //Time slider
    newCheck.children[2].id = "timeSlider" + i.toString();
    newCheck.children[2].value = stretchTimeMultipliers[i] * 2;
    newCheck.children[3].for = "timeSlider" + i.toString();
    newCheck.children[3].innerHTML =
      stretchTimeMultipliers[i] * secondsPerStretch;

    //Toggle the stretch here!
    newCheck.children[0].onclick = () => {
      stretchEnabled[i] = !stretchEnabled[i];
      console.log(stretchEnabled[i]);
    };

    //Change stretch time multiplier here!
    newCheck.children[2].onchange = () => {
      let newVal = newCheck.children[2].value / 2;
      stretchTimeMultipliers[i] = newVal;
      newCheck.children[3].innerHTML = newVal * secondsPerStretch;
    };

    document.getElementById("options").appendChild(newCheck);
  }

  //Deselect all
  let disableButton = document.getElementById("disableAll");
  disableButton.onclick = () => {

    let enableAll=true;

      for (let i = 0; i < stretchNames.length; i++) {
        if (document.getElementById("check" + i.toString()).checked) enableAll=false;
      }

    for (let i = 0; i < stretchNames.length; i++) {
      stretchEnabled[i] = enableAll;
      document.getElementById("check" + i.toString()).checked = enableAll;
    }
  };

  

  //Hide the slider and check marks that got cloned
  p.children[0].style.display="none";
  p.children[1].style.display="none";
  p.children[2].style.display = "none";
  p.children[3].style.display = "none";

  //Set stretches based on what the cached checkboxes are
  for (let i = 0; i < stretchNames.length; i++) {
    stretchEnabled[i] = document.getElementById("check" + i.toString()).checked;
  }

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
    if (time > 60 && time % ((secondsPerStretch*stretchTimeMultipliers[currentStretch])/2) == 0) window.navigator.vibrate(500);
    else if (time % secondsPerStretch == 0) window.navigator.vibrate(500);
    //Vibrate for quick two part stretches (i.e. vibrate per minute instead of per two minutes)
    else if (time % (secondsPerStretch / 2) == 0 && currentStretch == 2 && set == stretchSet.CPPS)
      window.navigator.vibrate(500);
    else if (time % ((secondsPerStretch*stretchTimeMultipliers[currentStretch])/3) == 0 && (currentStretch == 1 || currentStretch == 2) && set == stretchSet.FAB_SEVEN)
      window.navigator.vibrate(500);

    //Go on to the next stretch after the set amount of time in the arrays
    if (time >= secondsPerStretch * stretchTimeMultipliers[currentStretch])
      NextStretch();
  }
}

//Go to the next stretch once time is up or during the first unpause.
function NextStretch() {
  currentStretch++;

  //Go to name of next stretch
  var nextName = "";
  //Or don't if complete.
  if (currentStretch >= stretchNames.length) {
    nextName = "Complete!";
    TogglePause();
  } else nextName = stretchNames[currentStretch];
  document.getElementById("stretchName").innerHTML = nextName;

  //Change colour to next stretch colour
  if (currentStretch < stretchColours.length)
    document.getElementById("wrapper").style.backgroundColor =
      stretchColours[currentStretch];

  //Skip stretch if disabled
  if (!stretchEnabled[currentStretch]) {
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


//Change to a different set of stretches depending on url query
function changeStretchSet()
{

  const urlParams = new URLSearchParams(window.location.search);

  set = urlParams.get('q');
  if (set == null || set == stretchSet.CPPS)
  {
    stretchTimeMultipliers = [1, 1, 1, 2, 2, 1, 1, 1, 2];
    stretchNames = [
    "Squat Stretch",
    "Leg Push",
    "Calves",
    "Hamstring Tie",
    "Figure Four",
    "Abdomen",
    "Child Pose",
    "Butterfly",
    "Forward Hip",
  ];
  
  secondsPerStretch = getCookie("timeForSet0");
  if (secondsPerStretch == "") secondsPerStretch = 120;

  }
  else if (set == stretchSet.FAB_SEVEN)
  {
    stretchTimeMultipliers = [
      2,
      1.5,
      1.5,
      1,
      1,
      1,
      2,
      1,
      1,
    2];
    stretchNames = [
    "Oburator",
    "Lunge Set 1",
    "Lunge Set 2",
    "Child Pose",
    "Cat Stretch",
    "Chest Stretch",
    "Hamstrings",
    "Bridging",
    "Tabletop",
    "Rev. Kegel"

  ];
  
  secondsPerStretch = getCookie("timeForSet1");
  if (secondsPerStretch == "") secondsPerStretch = 120;

  }

  loadStretchMultipliers(set);

  document.getElementById("halveTime").innerHTML = "Time " + secondsPerStretch;

}

function createCookie(name, value, days) {
  var date, expires;
  if (days) {
      date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires="+date.toUTCString();
  } else {
      expires = "";
  }
  document.cookie = name+"="+value+expires+"; path=/";
}



function getCookie(cname) {
  console.log(document.cookie);
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function saveStretchMultipliers(set)
{
  for (let i =0; i < stretchNames.length; i++)
  {
    createCookie(set+"multiplier"+i, stretchTimeMultipliers[i], 30);
  }
}

function loadStretchMultipliers(set)
{
  for (let i =0; i < stretchNames.length; i++)
  {
    stretchTimeMultipliers[i] = getCookie(set+"multiplier"+i);
  }
}