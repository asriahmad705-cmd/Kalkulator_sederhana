const layar = document.getElementById("layar");
let ekspresi = "";
let baruSajaDihitung = false;

function tampilkan() {
  layar.value = ekspresi || "0";
}

function tambah(nilai) {
  const operator = ["+", "-", "*", "/", "%"];
  const terakhir = ekspresi.slice(-1);

  if (baruSajaDihitung && !operator.includes(nilai)) {
    ekspresi = "";
  }
  baruSajaDihitung = false;

  if (nilai === ".") {
    const bagianTerakhir = ekspresi.split(/[+*/%-]/).pop();
    if (bagianTerakhir.includes(".")) return;
    if (!bagianTerakhir) ekspresi += "0";
  }

  if (operator.includes(nilai)) {
    if (!ekspresi && nilai !== "-") return;
    if (operator.includes(terakhir)) {
      ekspresi = ekspresi.slice(0, -1);
    }
  }

  ekspresi += nilai;
  tampilkan();
}

function hapusSemua() {
  ekspresi = "";
  baruSajaDihitung = false;
  tampilkan();
}

function hapusSatu() {
  ekspresi = ekspresi.slice(0, -1);
  baruSajaDihitung = false;
  tampilkan();
}

function hitung() {
  if (!ekspresi) return;

  try {
    if (!/^[0-9+*/%.()\-\s]+$/.test(ekspresi)) {
      throw new Error("Ekspresi tidak valid");
    }

    const hasil = Function('"use strict"; return (' + ekspresi + ')')();
    if (typeof hasil !== "number" || !Number.isFinite(hasil)) {
      throw new Error("Hasil tidak valid");
    }

    ekspresi = String(Number(hasil.toPrecision(12)));
    baruSajaDihitung = true;
    tampilkan();
  } catch {
    layar.value = "Error";
    ekspresi = "";
    baruSajaDihitung = false;
  }
}

function ubahTanda() {
  if (!ekspresi) return;
  const match = ekspresi.match(/(\d*\.?\d+)$/);
  if (!match) return;

  const angka = match[0];
  const awal = ekspresi.slice(0, -angka.length);
  ekspresi = awal + (awal.endsWith("-") ? angka : "-" + angka);
  baruSajaDihitung = false;
  tampilkan();
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const tombol = event.target.closest("button");
  if (!tombol) return;

  const { value, action } = tombol.dataset;
  if (value !== undefined) tambah(value);
  if (action === "clear") hapusSemua();
  if (action === "backspace") hapusSatu();
  if (action === "equals") hitung();
  if (action === "sign") ubahTanda();
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.+*/%-]$/.test(event.key)) tambah(event.key);
  else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    hitung();
  } else if (event.key === "Backspace") hapusSatu();
  else if (event.key === "Escape") hapusSemua();
});

tampilkan();