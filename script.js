const subjects = [
  "COA",
  "TOC",
  "DAA",
  "DBMS",
  "ETC",
  "CN",
  "COA LAB",
  "DAA LAB",
  "DBMS LAB",
  "CN LAB"
];

/* ---------------- STORAGE ---------------- */

let attendanceData =
  JSON.parse(localStorage.getItem("attendanceData")) || {};

let biometric =
  JSON.parse(localStorage.getItem("biometric")) || {
    present: 0,
    absent: 0,
    history: []
  };

/* ---------------- DEFAULT DATA ---------------- */

subjects.forEach(subject => {

  if(!attendanceData[subject]){

    attendanceData[subject] = {
      present: 0,
      absent: 0,
      history: []
    };

  }

});

/* ---------------- CREATE SUBJECTS ---------------- */

const container =
  document.getElementById("subjectsContainer");

subjects.forEach(subject => {

  const card = document.createElement("div");

  card.className = "subject-card";

  card.innerHTML = `

    <h3>${subject}</h3>

    <div class="button-group">

      <button class="present-btn"
        onclick="markAttendance('${subject}','Present')">
        Present
      </button>

      <button class="absent-btn"
        onclick="markAttendance('${subject}','Absent')">
        Absent
      </button>

      <button class="clear-btn"
        onclick="clearSubject('${subject}')">
        Clear
      </button>

    </div>

    <div class="stats">

      <p>
        Present:
        <span id="${subject}-present">0</span>
      </p>

      <p>
        Absent:
        <span id="${subject}-absent">0</span>
      </p>

      <p>
        Percentage:
        <span id="${subject}-percent">0%</span>
      </p>

    </div>

    <div class="history"
      id="${subject}-history">
    </div>

  `;

  container.appendChild(card);

});

/* ---------------- SAVE ---------------- */

function saveData(){

  localStorage.setItem(
    "attendanceData",
    JSON.stringify(attendanceData)
  );

  localStorage.setItem(
    "biometric",
    JSON.stringify(biometric)
  );

}

/* ---------------- MARK ATTENDANCE ---------------- */

function markAttendance(subject, status){

  const now = new Date();

  const dateTime =
    now.toLocaleString();

  if(subject === "Biometric"){

    if(status === "Present"){
      biometric.present++;
    }else{
      biometric.absent++;
    }

    biometric.history.push(
      `${status} - ${dateTime}`
    );

    updateBiometric();

  }else{

    if(status === "Present"){
      attendanceData[subject].present++;
    }else{
      attendanceData[subject].absent++;
    }

    attendanceData[subject].history.push(
      `${status} - ${dateTime}`
    );

    updateSubject(subject);

  }

  saveData();

  updateSummary();

}

/* ---------------- UPDATE SUBJECT ---------------- */

function updateSubject(subject){

  const data =
    attendanceData[subject];

  const total =
    data.present + data.absent;

  const percent =
    total === 0
    ? 0
    : ((data.present / total) * 100).toFixed(2);

  document.getElementById(
    `${subject}-present`
  ).innerText = data.present;

  document.getElementById(
    `${subject}-absent`
  ).innerText = data.absent;

  document.getElementById(
    `${subject}-percent`
  ).innerText = percent + "%";

  const historyDiv =
    document.getElementById(
      `${subject}-history`
    );

  historyDiv.innerHTML = "";

  if(data.history.length === 0){

    historyDiv.innerHTML =
      "No attendance yet.";

  }else{

    data.history.forEach(item => {

      const p =
        document.createElement("p");

      p.innerText = item;

      historyDiv.appendChild(p);

    });

  }

}

/* ---------------- UPDATE BIOMETRIC ---------------- */

function updateBiometric(){

  const total =
    biometric.present + biometric.absent;

  const percent =
    total === 0
    ? 0
    : ((biometric.present / total) * 100).toFixed(2);

  document.getElementById(
    "bioPresent"
  ).innerText = biometric.present;

  document.getElementById(
    "bioAbsent"
  ).innerText = biometric.absent;

  document.getElementById(
    "bioPercent"
  ).innerText = percent + "%";

  const historyDiv =
    document.getElementById(
      "bioHistory"
    );

  historyDiv.innerHTML = "";

  if(biometric.history.length === 0){

    historyDiv.innerHTML =
      "No biometric attendance yet.";

  }else{

    biometric.history.forEach(item => {

      const p =
        document.createElement("p");

      p.innerText = item;

      historyDiv.appendChild(p);

    });

  }

}

/* ---------------- SUMMARY ---------------- */

function updateSummary(){

  const totalBio =
    biometric.present + biometric.absent;

  const bioPercent =
    totalBio === 0
    ? 0
    : ((biometric.present / totalBio) * 100).toFixed(2);

  document.getElementById(
    "summaryBioPresent"
  ).innerText = biometric.present;

  document.getElementById(
    "summaryBioAbsent"
  ).innerText = biometric.absent;

  document.getElementById(
    "summaryBioPercent"
  ).innerText = bioPercent + "%";

  const summaryDiv =
    document.getElementById(
      "allSummary"
    );

  summaryDiv.innerHTML = "";

  subjects.forEach(subject => {

    const data =
      attendanceData[subject];

    const total =
      data.present + data.absent;

    const percent =
      total === 0
      ? 0
      : ((data.present / total) * 100).toFixed(2);

    const p =
      document.createElement("p");

    p.innerHTML = `
      <b>${subject}</b><br>
      Present: ${data.present} |
      Absent: ${data.absent} |
      Percentage: ${percent}%<br><br>
    `;

    summaryDiv.appendChild(p);

  });

}

/* ---------------- CLEAR SUBJECT ---------------- */

function clearSubject(subject){

  attendanceData[subject] = {
    present: 0,
    absent: 0,
    history: []
  };

  updateSubject(subject);

  saveData();

  updateSummary();

}

/* ---------------- CLEAR BIOMETRIC ---------------- */

function clearBiometric(){

  biometric = {
    present: 0,
    absent: 0,
    history: []
  };

  updateBiometric();

  saveData();

  updateSummary();

}

/* ---------------- PDF DOWNLOAD ---------------- */

function downloadPDF(){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(20);

  doc.text(
    "Attendance Report",
    20,
    y
  );

  y += 20;

  // BIOMETRIC

  const totalBio =
    biometric.present + biometric.absent;

  const bioPercent =
    totalBio === 0
    ? 0
    : ((biometric.present / totalBio) * 100).toFixed(2);

  doc.text(
    `Biometric Attendance`,
    20,
    y
  );

  y += 10;

  doc.text(
    `Present: ${biometric.present}`,
    20,
    y
  );

  y += 10;

  doc.text(
    `Absent: ${biometric.absent}`,
    20,
    y
  );

  y += 10;

  doc.text(
    `Percentage: ${bioPercent}%`,
    20,
    y
  );

  y += 20;

  // SUBJECTS

  subjects.forEach(subject => {

    const data =
      attendanceData[subject];

    const total =
      data.present + data.absent;

    const percent =
      total === 0
      ? 0
      : ((data.present / total) * 100).toFixed(2);

    doc.text(
      `${subject}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Present: ${data.present}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Absent: ${data.absent}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Percentage: ${percent}%`,
      20,
      y
    );

    y += 20;

    if(y > 260){

      doc.addPage();

      y = 20;

    }

  });

  doc.save(
    "Attendance_Report.pdf"
  );

}

/* ---------------- INITIAL LOAD ---------------- */

subjects.forEach(subject => {

  updateSubject(subject);

});

updateBiometric();

updateSummary();