// ===== Original calculation logic (unchanged) =====
// Assumptions
const KM_POR_DIA = 20;
const DIAS_SEMANA = 5;
const CO2_POR_HOJA = 0.005; // kg CO2 per sheet

// Emission factors (kg CO2 per km per person)
const FACTOR_TRANSPORTE = {
  "bus": 0.089,
  "carro-privado": 0.192,
  "carro-compartido": 0.064, // ~3 occupants
  "bici-caminando": 0
};

// Recycling: paper emission reduction and points bonus
const RECICLAJE = {
  "ninguno": { reduccion: 0,   bono: 0 },
  "bajo":    { reduccion: 0.2, bono: 5 },
  "medio":   { reduccion: 0.5, bono: 10 },
  "alto":    { reduccion: 0.8, bono: 20 }
};

function calcular() {
  const transporte = document.getElementById("transporte").value;
  const hojasDia = Math.max(0, parseFloat(document.getElementById("papel").value) || 0);
  const reciclaje = document.getElementById("reciclaje").value;

  const co2Transporte = FACTOR_TRANSPORTE[transporte] * KM_POR_DIA * DIAS_SEMANA;
  const co2Papel = hojasDia * DIAS_SEMANA * CO2_POR_HOJA * (1 - RECICLAJE[reciclaje].reduccion);
  const total = co2Transporte + co2Papel;

  const puntos = Math.max(0, Math.round(100 - total * 3)) + RECICLAJE[reciclaje].bono;

  document.getElementById("res-co2").textContent = total.toFixed(2);
  document.getElementById("res-puntos").textContent = puntos;
  document.getElementById("resultado").hidden = false;
}

document.getElementById("btn-calcular").addEventListener("click", calcular);

// ===== New features: language switch and printable report =====
// Translations for every text marked with data-i18n
const TEXTOS = {
  es: {
    subtitulo: "Calcula tu impacto semanal",
    lbl_transporte: "Medio de transporte al colegio:",
    op_bus: "Bus",
    op_privado: "Carro privado",
    op_compartido: "Carro compartido",
    op_bici: "Bicicleta / Caminando",
    lbl_papel: "Hojas de papel usadas al día:",
    lbl_reciclaje: "Nivel de reciclaje:",
    op_ninguno: "Ninguno",
    op_bajo: "Bajo",
    op_medio: "Medio",
    op_alto: "Alto",
    btn_calcular: "Calcular",
    res_titulo: "Resultado",
    res_co2: "CO₂ estimado por semana",
    res_puntos_unidad: "puntos",
    btn_imprimir: "Imprimir / Guardar Reporte PDF",
    pie: "Supuestos: 20 km de viaje al día (ida y vuelta), 5 días a la semana.",
    cert_titulo: "Certificado Ecológico",
    cert_subtitulo: "Reporte de impacto ambiental semanal",
    cert_fecha: "Fecha",
    cert_nota: "Valores estimados con base en los supuestos de la calculadora."
  },
  en: {
    subtitulo: "Calculate your weekly impact",
    lbl_transporte: "Transport to school:",
    op_bus: "Bus",
    op_privado: "Private car",
    op_compartido: "Carpool",
    op_bici: "Bicycle / Walking",
    lbl_papel: "Sheets of paper used per day:",
    lbl_reciclaje: "Recycling level:",
    op_ninguno: "None",
    op_bajo: "Low",
    op_medio: "Medium",
    op_alto: "High",
    btn_calcular: "Calculate",
    res_titulo: "Result",
    res_co2: "Estimated CO₂ per week",
    res_puntos_unidad: "points",
    btn_imprimir: "Print / Save PDF Report",
    pie: "Assumptions: 20 km of travel per day (round trip), 5 days a week.",
    cert_titulo: "Eco Certificate",
    cert_subtitulo: "Weekly environmental impact report",
    cert_fecha: "Date",
    cert_nota: "Values estimated based on the calculator's assumptions."
  }
};

let idiomaActual = "es";
let fechaReporte = null; // set when the user calculates

// Copies the results into the certificate and formats the date
function actualizarCertificado() {
  document.getElementById("cert-co2").textContent = document.getElementById("res-co2").textContent;
  document.getElementById("cert-puntos").textContent = document.getElementById("res-puntos").textContent;

  if (fechaReporte) {
    const locale = idiomaActual === "es" ? "es-CO" : "en-US";
    document.getElementById("cert-fecha").textContent = fechaReporte.toLocaleDateString(locale, {
      year: "numeric", month: "long", day: "numeric"
    });
  }
}

// Applies the chosen language to the whole page instantly
function aplicarIdioma(lang) {
  idiomaActual = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = TEXTOS[lang][el.dataset.i18n];
  });
  actualizarCertificado();
}

// Language selector
document.getElementById("idioma").addEventListener("change", function (e) {
  aplicarIdioma(e.target.value);
});

// Runs after calcular() (registered later): shows print button and fills the certificate
document.getElementById("btn-calcular").addEventListener("click", function () {
  fechaReporte = new Date();
  document.getElementById("btn-imprimir").hidden = false;
  actualizarCertificado();
});

// Opens the browser print dialog (the user can choose "Save as PDF")
document.getElementById("btn-imprimir").addEventListener("click", function () {
  window.print();
});