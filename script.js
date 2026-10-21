const scenarios = {
  wire: {
    id: "wire", name: "Wire — 3 referrals", short: "Wire · 3 referrals",
    revenue: 555, incentive: 170, net: 385, roi: 226.5, cost: 30.6, multiple: 3.26,
    volume: 15000, retention: 69.4
  },
  ach: {
    id: "ach", name: "ACH — 3 referrals", short: "ACH · 3 referrals",
    revenue: 610.5, incentive: 37, net: 573.5, roi: 1550, cost: 6.1, multiple: 16.5,
    volume: 16500, retention: 93.9
  },
  annual: {
    id: "annual", name: "Annual maximum — Wire, 5 referrals", short: "Annual max · Wire",
    revenue: 1480, incentive: 500, net: 980, roi: 196, cost: 33.8, multiple: 2.96,
    volume: 40000, retention: 66.2
  }
};

const totals = { volume: 71500, revenue: 2645.5, incentive: 707, net: 1938.5, retention: 73.3 };
const currency = value => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2
}).format(value);
const percent = value => `${Number(value).toLocaleString("en-US", {minimumFractionDigits:1, maximumFractionDigits:1})}%`;
const number = value => new Intl.NumberFormat("en-US", {maximumFractionDigits:2}).format(value);

function renderSummary() {
  document.getElementById("retentionValue").textContent = percent(totals.retention);
  document.getElementById("retentionFill").style.width = `${totals.retention}%`;
  document.getElementById("retentionAmount").textContent = currency(totals.net);
  document.getElementById("factoredVolume").textContent = currency(totals.volume);
  document.getElementById("grossRevenue").textContent = currency(totals.revenue);
  document.getElementById("incentiveCredits").textContent = currency(totals.incentive);
  document.getElementById("netRetained").textContent = currency(totals.net);
  document.getElementById("achRoi").textContent = percent(scenarios.ach.roi);
  document.getElementById("achCost").textContent = percent(scenarios.ach.cost);
}

function renderSelected(id) {
  const s = scenarios[id] || scenarios.ach;
  document.querySelectorAll(".scenario-tab").forEach(btn => {
    const active = btn.dataset.scenario === s.id;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  document.getElementById("selectedName").textContent = s.name;
  document.getElementById("selectedRoi").textContent = percent(s.roi);
  document.getElementById("selectedCost").textContent = percent(s.cost);
  document.getElementById("selectedRevenue").textContent = currency(s.revenue);
  document.getElementById("selectedIncentive").textContent = currency(s.incentive);
  document.getElementById("selectedNet").textContent = currency(s.net);
  document.getElementById("selectedMultiple").textContent = `${number(s.multiple)}×`;
  document.getElementById("selectedRetention").textContent = `${percent(s.retention)} retained`;
  document.getElementById("allocationNet").style.width = `${s.retention}%`;
  document.getElementById("allocationIncentive").style.width = `${100 - s.retention}%`;
  document.getElementById("bestBadge").hidden = s.id !== "ach";
}

function renderTable() {
  const tbody = document.getElementById("scenarioTable");
  tbody.innerHTML = Object.values(scenarios).map(s => `
    <tr class="${s.id === "ach" ? "ach-row" : ""}">
      <td><strong>${s.short}</strong><div class="scenario-sub">${s.id === "ach" ? "Lowest modeled incentive cost" : s.id === "annual" ? "Annual maximum case" : "Standard referral case"}</div></td>
      <td>${currency(s.revenue)}</td>
      <td>${currency(s.incentive)}</td>
      <td><strong>${currency(s.net)}</strong></td>
      <td class="table-roi">${percent(s.roi)}</td>
      <td>${percent(s.cost)}</td>
      <td><button type="button" class="table-action" data-open="${s.id}">View details →</button></td>
    </tr>`).join("");
  tbody.querySelectorAll("[data-open]").forEach(btn => btn.addEventListener("click", () => {
    renderSelected(btn.dataset.open);
    document.querySelector(".roi-panel").scrollIntoView({behavior:"smooth",block:"center"});
  }));
}

function createChart() {
  const ctx = document.getElementById("scenarioChart");
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Wire · 3 referrals", "ACH · 3 referrals", ["Annual max · Wire", "5 referrals"]],
      datasets: [
        { label: "Gross revenue", data: [555, 610.5, 1480], backgroundColor: "#637fb8", borderRadius: 4, barThickness: 12 },
        { label: "Incentive cost", data: [170, 37, 500], backgroundColor: "#d75a65", borderRadius: 4, barThickness: 12 },
        { label: "Net retained margin", data: [385, 573.5, 980], backgroundColor: "#69bd9d", borderRadius: 4, barThickness: 12 }
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
          callbacks: { label: context => `${context.dataset.label}: ${currency(context.raw)}` }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "#edf0f4", drawBorder: false },
          border: { display: false },
          ticks: { color: "#8b95a5", font: { family: "DM Sans", size: 9 }, callback: value => value === 0 ? "$0" : `$${Number(value).toLocaleString("en-US")}` }
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

function exportSummary() {
  const lines = [
    "NU-KO CAPITAL — PROGRAM FINANCIAL PERFORMANCE DASHBOARD",
    "",
    `Factored Volume,${currency(totals.volume)}`,
    `Gross Revenue,${currency(totals.revenue)}`,
    `Incentive Credits,${currency(totals.incentive)}`,
    `Net Retained Margin,${currency(totals.net)}`,
    `Aggregate Retention Margin,${percent(totals.retention)}`,
    "",
    "Scenario,Gross Revenue,Incentives,Net Retained Margin,ROI on Incentives,Incentive Cost / Revenue,Revenue / Incentive",
    ...Object.values(scenarios).map(s => [
      `"${s.name}"`, currency(s.revenue), currency(s.incentive), currency(s.net),
      percent(s.roi), percent(s.cost), `${number(s.multiple)}x`
    ].join(","))
  ];
  const blob = new Blob([lines.join("\r\n")], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "NU-KO_Referral_Program_Performance.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  renderTable();
  createChart();
  document.querySelectorAll(".scenario-tab").forEach(btn => btn.addEventListener("click", () => renderSelected(btn.dataset.scenario)));
  document.getElementById("exportButton").addEventListener("click", exportSummary);
  document.getElementById("resetButton").addEventListener("click", () => {
    renderSelected("ach");
    window.scrollTo({top:0,behavior:"smooth"});
  });
  renderSelected("ach");
});
