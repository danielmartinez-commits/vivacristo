const escenarios = {
  wire: {
    id: "wire", nombre: "Wire — 3 referidos", corto: "Wire · 3 referidos",
    ingresos: 555, incentivo: 170, neto: 385, roi: 226.5, costo: 30.6, multiplo: 3.26,
    volumen: 15000, retencion: 69.4
  },
  ach: {
    id: "ach", nombre: "ACH — 3 referidos", corto: "ACH · 3 referidos",
    ingresos: 610.5, incentivo: 37, neto: 573.5, roi: 1550, costo: 6.1, multiplo: 16.5,
    volumen: 16500, retencion: 93.9
  },
  annual: {
    id: "annual", nombre: "Máximo anual — Wire, 5 referidos", corto: "Máximo anual · Wire",
    ingresos: 1480, incentivo: 500, neto: 980, roi: 196, costo: 33.8, multiplo: 2.96,
    volumen: 40000, retencion: 66.2
  }
};

const totales = { volumen: 71500, ingresos: 2645.5, incentivo: 707, neto: 1938.5, retencion: 73.3 };
const moneda = valor => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2
}).format(valor);
const porcentaje = valor => `${Number(valor).toLocaleString("es-CO", {minimumFractionDigits:1, maximumFractionDigits:1})} %`;
const numero = valor => new Intl.NumberFormat("es-CO", {maximumFractionDigits:2}).format(valor);

function renderizarResumen() {
  document.getElementById("retentionValue").textContent = porcentaje(totales.retencion);
  document.getElementById("retentionFill").style.width = `${totales.retencion}%`;
  document.getElementById("retentionAmount").textContent = moneda(totales.neto);
  document.getElementById("factoredVolume").textContent = moneda(totales.volumen);
  document.getElementById("grossRevenue").textContent = moneda(totales.ingresos);
  document.getElementById("incentiveCredits").textContent = moneda(totales.incentivo);
  document.getElementById("netRetained").textContent = moneda(totales.neto);
  document.getElementById("achRoi").textContent = porcentaje(escenarios.ach.roi);
  document.getElementById("achCost").textContent = porcentaje(escenarios.ach.costo);
}

function renderizarEscenario(id) {
  const e = escenarios[id] || escenarios.ach;
  document.querySelectorAll(".scenario-tab").forEach(boton => {
    const activo = boton.dataset.scenario === e.id;
    boton.classList.toggle("active", activo);
    boton.setAttribute("aria-pressed", String(activo));
  });
  document.getElementById("selectedName").textContent = e.nombre;
  document.getElementById("selectedRoi").textContent = porcentaje(e.roi);
  document.getElementById("selectedCost").textContent = porcentaje(e.costo);
  document.getElementById("selectedRevenue").textContent = moneda(e.ingresos);
  document.getElementById("selectedIncentive").textContent = moneda(e.incentivo);
  document.getElementById("selectedNet").textContent = moneda(e.neto);
  document.getElementById("selectedMultiple").textContent = `${numero(e.multiplo)}×`;
  document.getElementById("selectedRetention").textContent = `${porcentaje(e.retencion)} retenido`;
  document.getElementById("allocationNet").style.width = `${e.retencion}%`;
  document.getElementById("allocationIncentive").style.width = `${100 - e.retencion}%`;
  document.getElementById("bestBadge").hidden = e.id !== "ach";
}

function renderizarTabla() {
  const cuerpo = document.getElementById("scenarioTable");
  cuerpo.innerHTML = Object.values(escenarios).map(e => `
    <tr class="${e.id === "ach" ? "ach-row" : ""}">
      <td><strong>${e.corto}</strong><div class="scenario-sub">${e.id === "ach" ? "Menor costo relativo de incentivos" : e.id === "annual" ? "Escenario máximo anual" : "Escenario estándar de referidos"}</div></td>
      <td>${moneda(e.ingresos)}</td>
      <td>${moneda(e.incentivo)}</td>
      <td><strong>${moneda(e.neto)}</strong></td>
      <td class="table-roi">${porcentaje(e.roi)}</td>
      <td>${porcentaje(e.costo)}</td>
      <td><button type="button" class="table-action" data-abrir="${e.id}">Ver detalle →</button></td>
    </tr>`).join("");
  cuerpo.querySelectorAll("[data-abrir]").forEach(boton => boton.addEventListener("click", () => {
    renderizarEscenario(boton.dataset.abrir);
    document.querySelector(".roi-panel").scrollIntoView({behavior:"smooth",block:"center"});
  }));
}

function crearGrafico() {
  const lienzo = document.getElementById("scenarioChart");
  return new Chart(lienzo, {
    type: "bar",
    data: {
      labels: ["Wire · 3 referidos", "ACH · 3 referidos", ["Máximo anual · Wire", "5 referidos"]],
      datasets: [
        { label: "Ingresos brutos", data: [555, 610.5, 1480], backgroundColor: "#637fb8", borderRadius: 4, barThickness: 12 },
        { label: "Costo de incentivos", data: [170, 37, 500], backgroundColor: "#d75a65", borderRadius: 4, barThickness: 12 },
        { label: "Margen neto retenido", data: [385, 573.5, 980], backgroundColor: "#69bd9d", borderRadius: 4, barThickness: 12 }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#152238", padding: 12, cornerRadius: 7,
          titleFont: { family: "DM Sans", size: 11, weight: "600" },
          bodyFont: { family: "DM Sans", size: 11 },
          callbacks: { label: contexto => `${contexto.dataset.label}: ${moneda(contexto.raw)}` }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "#edf0f4", drawBorder: false },
          border: { display: false },
          ticks: { color: "#8b95a5", font: { family: "DM Sans", size: 9 }, callback: valor => valor === 0 ? "$0" : `$${Number(valor).toLocaleString("es-CO")}` }
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: "#566378", font: { family: "DM Sans", size: 10, weight: "500" }, padding: 9 }
        }
      }
    }
  });
}

function exportarResumen() {
  const filas = [
    "NU-KO CAPITAL — PANEL DE RENDIMIENTO FINANCIERO DEL PROGRAMA",
    "",
    `Volumen factorizado,${moneda(totales.volumen)}`,
    `Ingresos brutos,${moneda(totales.ingresos)}`,
    `Créditos de incentivos,${moneda(totales.incentivo)}`,
    `Margen neto retenido,${moneda(totales.neto)}`,
    `Margen agregado retenido,${porcentaje(totales.retencion)}`,
    "",
    "Escenario,Ingresos brutos,Incentivos,Margen neto retenido,ROI sobre incentivos,Costo de incentivos sobre ingresos,Ingresos por incentivo",
    ...Object.values(escenarios).map(e => [
      `"${e.nombre}"`, moneda(e.ingresos), moneda(e.incentivo), moneda(e.neto),
      porcentaje(e.roi), porcentaje(e.costo), `${numero(e.multiplo)}x`
    ].join(","))
  ];
  const archivo = new Blob(["\uFEFF" + filas.join("\r\n")], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "NU-KO_Rendimiento_Programa_Referidos.csv";
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarResumen();
  renderizarTabla();
  crearGrafico();
  document.querySelectorAll(".scenario-tab").forEach(boton => boton.addEventListener("click", () => renderizarEscenario(boton.dataset.scenario)));
  document.getElementById("exportButton").addEventListener("click", exportarResumen);
  document.getElementById("resetButton").addEventListener("click", () => {
    renderizarEscenario("ach");
    window.scrollTo({top:0,behavior:"smooth"});
  });
  renderizarEscenario("ach");
});
