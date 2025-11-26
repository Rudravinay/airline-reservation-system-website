class Seat {
  constructor(label) {
    this.label = label;
    this.booked = false;
    this.passenger = "";
  }

  getSeatNumber() {
    return parseInt(this.label.substring(1), 10); // L5 -> 5
  }

  getClassName() {
    const num = this.getSeatNumber();
    if (num >= 1 && num <= 5) return "First Class";
    if (num >= 6 && num <= 10) return "Business";
    return "Economy";
  }
}

class AirlineReservationSystem {
  constructor() {
    this.seats = [];
    this.initSeats();
  }

  initSeats() {
    // L1–L15
    for (let i = 1; i <= 15; i++) {
      this.seats.push(new Seat(`L${i}`));
    }
    // R1–R15
    for (let i = 1; i <= 15; i++) {
      this.seats.push(new Seat(`R${i}`));
    }
  }

  getSeat(label) {
    return this.seats.find((s) => s.label === label);
  }

  bookSeat(label, passengerName) {
    const seat = this.getSeat(label);
    if (!seat) {
      alert("Invalid seat label.");
      return;
    }
    if (seat.booked) {
      alert("Seat already booked.");
      return;
    }
    seat.booked = true;
    seat.passenger = passengerName;
  }

  cancelSeat(label) {
    const seat = this.getSeat(label);
    if (!seat) {
      alert("Invalid seat label.");
      return;
    }
    if (!seat.booked) {
      alert("Seat is not booked.");
      return;
    }
    seat.booked = false;
    seat.passenger = "";
  }

  getPassengers() {
    return this.seats.filter((s) => s.booked);
  }
}

const system = new AirlineReservationSystem();

function createSeatElement(seat) {
  const div = document.createElement("div");
  div.classList.add("seat");
  div.dataset.label = seat.label;
  div.innerHTML = `
    <span class="label">${seat.label}</span>
    <span class="class">${seat.getClassName()}</span>
  `;
  return div;
}

function renderSeats() {
  const leftContainer = document.getElementById("left-seats");
  const rightContainer = document.getElementById("right-seats");
  leftContainer.innerHTML = "";
  rightContainer.innerHTML = "";

  // Show L15 → L1 like original layout or simple L1–L15 in rows
  const leftSeats = system.seats.filter((s) => s.label.startsWith("L"));
  const rightSeats = system.seats.filter((s) => s.label.startsWith("R"));

  leftSeats.forEach((seat) => {
    const el = createSeatElement(seat);
    if (seat.booked) el.classList.add("booked");
    else el.classList.add("available");
    el.addEventListener("click", () => onSeatClick(seat.label));
    leftContainer.appendChild(el);
  });

  rightSeats.forEach((seat) => {
    const el = createSeatElement(seat);
    if (seat.booked) el.classList.add("booked");
    else el.classList.add("available");
    el.addEventListener("click", () => onSeatClick(seat.label));
    rightContainer.appendChild(el);
  });
}

function renderPassengers() {
  const tbody = document.querySelector("#passenger-table tbody");
  tbody.innerHTML = "";

  const passengers = system.getPassengers();

  if (passengers.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "No bookings yet.";
    cell.style.fontStyle = "italic";
    cell.style.color = "#6b7280";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  passengers.forEach((seat) => {
    const row = document.createElement("tr");
    const seatCell = document.createElement("td");
    const classCell = document.createElement("td");
    const nameCell = document.createElement("td");

    seatCell.textContent = seat.label;
    classCell.textContent = seat.getClassName();
    nameCell.textContent = seat.passenger;

    row.appendChild(seatCell);
    row.appendChild(classCell);
    row.appendChild(nameCell);
    tbody.appendChild(row);
  });
}

function onSeatClick(label) {
  const seat = system.getSeat(label);
  if (!seat) return;

  if (!seat.booked) {
    const name = prompt(`Enter passenger name for seat ${label}:`);
    if (!name) return;
    system.bookSeat(label, name.trim());
  } else {
    const confirmCancel = confirm(
      `Seat ${label} is booked by "${seat.passenger}". Cancel booking?`
    );
    if (confirmCancel) {
      system.cancelSeat(label);
    }
  }

  renderSeats();
  renderPassengers();
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderSeats();
  renderPassengers();
});
