const form = document.getElementById("booking-form");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const roomType = document.getElementById("room-type");
const totalAmount = document.getElementById("total-amount");
const priceSummary = document.getElementById("price-summary");
const bookingStatus = document.getElementById("booking-status");

const formatDate = (date) => date.toISOString().split("T")[0];
const today = new Date();
today.setHours(0, 0, 0, 0);

checkin.min = formatDate(today);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
checkout.min = formatDate(tomorrow);

function updatePrice() {
  const nightlyRate = Number(roomType.value);
  let nights = 1;

  if (checkin.value && checkout.value) {
    const start = new Date(`${checkin.value}T00:00:00`);
    const end = new Date(`${checkout.value}T00:00:00`);
    const difference = (end - start) / (1000 * 60 * 60 * 24);
    if (difference > 0) {
      nights = difference;
    }
  }

  totalAmount.textContent = `$${nightlyRate * nights}`;
  priceSummary.querySelector("span").textContent =
    `Estimated Total (${nights} night${nights === 1 ? "" : "s"}):`;
}

checkin.addEventListener("change", () => {
  if (checkin.value) {
    const nextDay = new Date(`${checkin.value}T00:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    checkout.min = formatDate(nextDay);
    if (!checkout.value || checkout.value <= checkin.value) {
      checkout.value = formatDate(nextDay);
    }
  }
  updatePrice();
});

checkout.addEventListener("change", updatePrice);
roomType.addEventListener("change", updatePrice);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!checkin.value || !checkout.value || checkout.value <= checkin.value) {
    bookingStatus.textContent = "Please select valid check-in and check-out dates.";
    return;
  }

  const selectedRoom = roomType.selectedOptions[0].dataset.name;
  bookingStatus.textContent =
    `Your ${selectedRoom} booking request is ready. We will send confirmation details by email.`;
});

updatePrice();
