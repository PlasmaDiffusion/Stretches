
const stretchSet = {
    CPPS: 0,
    FAB_SEVEN: 1
  }
  

//Change to a different set of stretches depending on url query
export function changeStretchSet(sObj)
{

  const urlParams = new URLSearchParams(window.location.search);

  sObj.set = urlParams.get('q');

  if (sObj.set == null || sObj.set == sObj.stretchSet.CPPS)
  {
    sObj.stretchTimeMultipliers = [1, 1, 1, 2, 2, 1, 1, 1, 2];
    sObj.stretchNames = [
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
  
  sObj.secondsPerStretch = getCookie("timeForSet0");
  if (sObj.secondsPerStretch == "") sObj.secondsPerStretch = 120;

  }
  else if (sObj.set == stretchSet.FAB_SEVEN)
  {
    sObj.stretchTimeMultipliers = [
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
    sObj.stretchNames = [
    "Oburator",
    "Lunge Set 1",
    "Lunge Set 2",
    "Child Pose",
    "Cat Stretch",
    "Chest Stretch",
    "Clam",
    "Butterfly",
    "Bridging",
    "Rev. Kegel"

  ];
  
  sObj.secondsPerStretch = getCookie("timeForSet1");
  if (sObj.secondsPerStretch == "") sObj.secondsPerStretch = 120;

  }

  loadStretchMultipliers(sObj);

  document.getElementById("halveTime").innerHTML = "Time " + sObj.secondsPerStretch;

}

export function createCookie(name, value, days) {
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



export function getCookie(cname) {
  //console.log(document.cookie);
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


export function saveStretchMultipliers(sObj)
{
  for (let i =0; i < sObj.stretchNames.length; i++)
  {
    createCookie(sObj.set+"multiplier"+i, sObj.stretchTimeMultipliers[i], 30);
    createCookie(sObj.set+"enabled"+i, sObj.stretchEnabled[i], 30);
  }
}

export function loadStretchMultipliers(sObj)
{
  for (let i =0; i < sObj.stretchNames.length; i++)
  {
    sObj.stretchTimeMultipliers[i] = getCookie(sObj.set+"multiplier"+i);
    sObj.stretchEnabled[i]=getCookie(sObj.set+"enabled"+i)=='true';
    console.log(sObj.stretchEnabled[i])
  }
}