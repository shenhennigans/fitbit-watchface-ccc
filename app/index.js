import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import userActivity from "user-activity";


// Update the clock every second
clock.granularity = "seconds";

// get activity goals
const stepGoal = userActivity.goals.steps;
const distanceGoal = userActivity.goals.distance;
const caloriesGoal = userActivity.goals.calories;
//const activeMinutesGoal = userActivity.goals.activeMinutes;
const activeZoneMinutesGoal = userActivity.goals.activeZoneMinutes.total;
const elevationGainGoal = userActivity.goals.elevationGain;

// set activity goal booleans
let stepGoalReached;
let distanceGoalReached;
let caloriesGoalReached;
//let activeMinutesGoalReached;
let activeZoneMinutesGoalReached;
let elevationGainGoalReached;

// metric titles
const heartRateTitle = "<3";
const stepsTitle = "steps";
const distanceTitle = "km";
const activeMinutesTitle = "zone mins";
const caloriesTitle = "calories";
const elevationGainTitle = 'floors';
const completedIndicator = ' x';


// Get a handle on the <text> element
const clockElement = document.getElementById("clockText");
const batteryElement = document.getElementById("batteryText");
const batteryStatusElement = document.getElementById("batteryStatusText");
const heartRateElement = document.getElementById("heartRateText");
const heartRateSymbol = document.getElementById("heartRateSymbol");
const stepsElement = document.getElementById("stepsText");
const stepsUnitElement = document.getElementById("stepsUnitText");
const distanceElement = document.getElementById("distanceText");
const distanceUnitElement = document.getElementById("distanceUnitText");
const caloriesElement = document.getElementById("caloriesText");
const caloriesUnitElement = document.getElementById("caloriesUnitText");
//const activeMinutesElement = document.getElementById("activeMinutesText");
//const activeMinutesUnitElement = document.getElementById("activeMinutesUnitText");
const activeZoneMinutesElement = document.getElementById("activeZoneMinutesText");
const activeZoneMinutesUnitElement = document.getElementById("activeZoneMinutesUnitText");
const elevationGainElement = document.getElementById("elevationGainText");
const elevationGainUnitElement = document.getElementById("elevationGainUnitText");
const monthElement = document.getElementById("monthText");
const weekDayElement = document.getElementById("weekDayText");
const dateElement = document.getElementById("dateText");

// set metric titles
stepsUnitElement.text = stepsTitle;
distanceUnitElement.text = distanceTitle;
caloriesUnitElement.text = caloriesTitle;
//activeMinutesUnitElement.text = activeMinutesTitle;
activeZoneMinutesUnitElement.text = activeMinutesTitle;
elevationGainUnitElement.text = elevationGainTitle;
heartRateSymbol.text = heartRateTitle;

//HeartRateSensor
const hrs = new HeartRateSensor();
hrs.start();

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  let month = getMonthName(today.getMonth());
  let weekday = getWeekDay(today.getDay());
  let date = today.getDate();
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  clockElement.text = `${hours}:${mins}`;
  
  //Date
  monthElement.text = month;
  weekDayElement.text = weekday;
  dateElement.text = date;
  
  // Heart Rate
  if(hrs.heartRate == null){
    heartRateElement.text = "--";
  }else{
    heartRateElement.text = hrs.heartRate;
  }

  // Battery Level
  batteryElement.text =  battery.chargeLevel + "%";
  if(battery.chargeLevel >= 75){
    batteryStatusElement.text = "||||||||";
    batteryElement.style.fill = "white";
  }
  else if(battery.chargeLevel >= 50){
    batteryElement.style.fill = "white";
    batteryStatusElement.text = "  ||||||";
  }
  else if(battery.chargeLevel >= 25){
    batteryElement.style.fill = "gold";
    batteryStatusElement.text = "    ||||";
  }
  else{
    batteryElement.style.fill = "firebrick";
    batteryStatusElement.text = "      ||";
  }
  
  //Goals
  stepGoalReached = userActivity.today.adjusted.steps >= stepGoal;
  distanceGoalReached = userActivity.today.adjusted.distance >= distanceGoal;
  caloriesGoalReached = userActivity.today.adjusted.calories >= caloriesGoal;
  //activeMinutesGoalReached= userActivity.today.adjusted.activeMinutes >= activeMinutesGoal;
  activeZoneMinutesGoalReached = userActivity.today.adjusted.activeZoneMinutes.total >= activeZoneMinutesGoal;
  elevationGainGoalReached = userActivity.today.adjusted.elevationGain >= elevationGainGoal;
  
  
  //Steps
  stepsElement.text = userActivity.today.adjusted.steps;
  if(stepGoalReached){
    stepsElement.text += completedIndicator;
  }
  
  //Distance
  distanceElement.text = Math.round((userActivity.today.adjusted.distance / 1000) * 10) / 10;
  if(distanceGoalReached){
    distanceElement.text += completedIndicator;
  }
  
  // Calories
  caloriesElement.text = userActivity.today.adjusted.calories;
  if(caloriesGoalReached){
    caloriesElement.text += completedIndicator;
  }
  
  // Active Minutes
  //activeMinutesElement.text = userActivity.today.adjusted.activeMinutes;
  //if(activeMinutesGoalReached){
  //  activeMinutesElement.text += completedIndicator;
  //}
  
  //Active Zone Minutes
  activeZoneMinutesElement.text = userActivity.today.adjusted.activeZoneMinutes.total;
  if(activeZoneMinutesGoalReached){
    activeZoneMinutesElement.text += completedIndicator;
  }
  
  // Elevation Gain
  elevationGainElement.text = userActivity.today.adjusted.elevationGain;
  if(elevationGainGoalReached){
    elevationGainElement.text += completedIndicator;
  }
  
  
 
}

function getMonthName(num){
  let monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return monthNames[num];
}

function getWeekDay(num){
  let dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return dayNames[num];
}

