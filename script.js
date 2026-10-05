const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const attendeeList = document.getElementById("attendeeList");
const clearButton = document.getElementById("clearButton");
const celebration = document.getElementById("celebration");

const maxCount = 50;
let attendees = JSON.parse(localStorage.getItem("summitAttendees")) || [];

function updateDashboard() {
  const count = attendees.length;
  const percentage = Math.min(Math.round((count / maxCount) * 100), 100);

  attendeeCount.textContent = count;
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}% of our summit goal`;

  const teamCounts = {
    water: 0,
    zero: 0,
    power: 0,
  };

  attendees.forEach(function (attendee) {
    teamCounts[attendee.team]++;
  });

  Object.keys(teamCounts).forEach(function (team) {
    document.getElementById(`${team}Count`).textContent = teamCounts[team];
    document
      .querySelector(`.team-card.${team}`)
      .classList.remove("winning-team");
  });

  if (count >= maxCount) {
    const winningTeam = Object.keys(teamCounts).sort(
      function (firstTeam, secondTeam) {
        return teamCounts[secondTeam] - teamCounts[firstTeam];
      },
    )[0];
    document
      .querySelector(`.team-card.${winningTeam}`)
      .classList.add("winning-team");
    celebration.textContent = `Goal reached! ${getTeamName(winningTeam)} is leading the summit.`;
    celebration.style.display = "block";
  } else {
    celebration.style.display = "none";
  }

  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    attendeeList.innerHTML =
      '<li class="empty-list">No attendees yet. Be the first to check in!</li>';
    return;
  }

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span>${attendee.name}</span><small>${attendee.teamName}</small>`;
    attendeeList.appendChild(listItem);
  });
}

function getTeamName(team) {
  const teamNames = {
    water: "Team Water Wise",
    zero: "Team Net Zero",
    power: "Team Renewables",
  };

  return teamNames[team];
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  attendees.push({ name: name, team: team, teamName: teamName });
  localStorage.setItem("summitAttendees", JSON.stringify(attendees));

  greeting.textContent = `Welcome, ${name} from ${teamName}!`;
  greeting.className = "success-message";
  greeting.style.display = "block";

  updateDashboard();

  form.reset();
});

clearButton.addEventListener("click", function () {
  attendees = [];
  localStorage.removeItem("summitAttendees");
  greeting.style.display = "none";
  celebration.style.display = "none";
  updateDashboard();
});

updateDashboard();
