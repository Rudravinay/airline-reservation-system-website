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
      showToast("Invalid seat label.", "error");
      return false;
    }
    if (seat.booked) {
      showToast("Seat is already booked.", "error");
      return false;
    }
    seat.booked = true;
    seat.passenger = passengerName;
    showToast(`Seat ${label} booked for ${passengerName}.`, "success");
    return true;
  }

  cancelSeat(label) {
    const seat = this.getSeat(label);
    if (!seat) {
      showToast("Invalid seat label.", "error");
      return false;
    }
    if (!seat.booked) {
      showToast("Seat is not booked.", "error");
      return false;
    }
    const name = seat.passenger;
    seat.booked = false;
    seat.passenger = "";
    showToast(`Booking cancelled for ${label} (${name}).`, "info");
    return true;
  }

  getPassengers() {
    return this.seats.filter((s) => s.booked);
  }
}

const system = new AirlineReservationSystem();

/* ----- Toast popup helper ----- */

let toastTimeoutId = null;

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  const msgSpan = document.getElementById("toast-message");
  if (!toast || !msgSpan) return;

  msgSpan.textContent = message;

  // Reset classes
  toast.classList.remove("success", "error", "info", "show");
  toast.classList.add(type);

  // Trigger visible state
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  toastTimeoutId = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/* ----- Rendering seats & passengers ----- */

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
  if (!leftContainer || !rightContainer) return;

  leftContainer.innerHTML = "";
  rightContainer.innerHTML = "";

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
  if (!tbody) return;

  tbody.innerHTML = "";

  const passengers = system.getPassengers();

  if (passengers.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "No bookings yet.";
    cell.style.fontStyle = "italic";
    cell.style.color = "#9ca3af";
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
    tbody.appendChild(row);
  });
}

/* ----- Seat click handler (booking / cancelling) ----- */

function onSeatClick(label) {
  const seat = system.getSeat(label);
  if (!seat) return;

  if (!seat.booked) {
    const name = prompt(`Enter passenger name for seat ${label}:`);
    if (!name || !name.trim()) {
      showToast("Booking cancelled: no name entered.", "info");
      return;
    }
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

/* ----- Initial render ----- */

document.addEventListener("DOMContentLoaded", () => {
  renderSeats();
  renderPassengers();
});
