/**
 * HH Goa · pin admin
 */
const CFG = window.HHGOA_CONFIG || {};
const LOCAL_KEY = "hhgoa_pins_v1";
const $ = (id) => document.getElementById(id);

let sb = null;
let pins = [];

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => { el.hidden = true; }, 200);
  }, 2000);
}

function initSb() {
  if (!CFG.supabaseUrl || !CFG.supabaseAnonKey || !window.supabase) return null;
  try {
    return window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
  } catch {
    return null;
  }
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocal(list) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
}

async function loadPins() {
  if (sb) {
    try {
      const { data, error } = await sb
        .from("pins")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (!error && data) {
        pins = data.map((p) => ({
          id: p.id,
          name: p.name,
          title: p.title,
          city: p.city,
          lat: p.lat,
          lng: p.lng,
          photo: p.photo_url,
          visible: p.visible !== false,
          source: "supabase",
        }));
        $("status").textContent = `Supabase · ${pins.length} pins`;
        return;
      }
    } catch (e) {
      console.warn(e);
    }
  }
  pins = loadLocal().map((p) => ({
    id: p.id,
    name: p.name,
    title: p.title,
    city: p.city,
    lat: p.lat,
    lng: p.lng,
    photo: p.photo,
    visible: true,
    source: "local",
  }));
  $("status").textContent = `Local only · ${pins.length} pins (add Supabase in config.js)`;
}

function render() {
  const tb = $("tbody");
  if (!pins.length) {
    tb.innerHTML = `<tr><td colspan="7" style="padding:24px;color:rgba(245,237,214,.5)">No pins yet.</td></tr>`;
    return;
  }
  tb.innerHTML = pins
    .map((p) => {
      const img = p.photo
        ? `<img src="${esc(p.photo)}" alt="" />`
        : `<span style="display:inline-block;width:40px;height:40px;border-radius:50%;background:#0b6839"></span>`;
      return `<tr data-id="${esc(p.id)}">
        <td>${img}</td>
        <td><strong>${esc(p.name)}</strong></td>
        <td>${esc(p.title || "—")}</td>
        <td>${esc(p.city || "—")}</td>
        <td style="font-size:11px">${Number(p.lat).toFixed(3)}, ${Number(p.lng).toFixed(3)}</td>
        <td>
          <button type="button" class="btn btn-sm btn-ghost btn-vis" data-id="${esc(p.id)}">
            ${p.visible ? "Hide" : "Show"}
          </button>
        </td>
        <td>
          <button type="button" class="btn btn-sm btn-ghost btn-del" data-id="${esc(p.id)}" style="color:#ff7070">Delete</button>
        </td>
      </tr>`;
    })
    .join("");

  tb.querySelectorAll(".btn-vis").forEach((b) => {
    b.onclick = () => toggleVis(b.dataset.id);
  });
  tb.querySelectorAll(".btn-del").forEach((b) => {
    b.onclick = () => delPin(b.dataset.id);
  });
}

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

async function toggleVis(id) {
  const p = pins.find((x) => x.id === id);
  if (!p) return;
  p.visible = !p.visible;
  if (sb && p.source === "supabase") {
    await sb.from("pins").update({ visible: p.visible }).eq("id", id);
  } else {
    // local: "hide" removes from public map list effectively by flag — store flag
    const list = loadLocal().map((x) => (x.id === id ? { ...x, visible: p.visible } : x));
    saveLocal(list.filter((x) => x.visible !== false));
    if (!p.visible) {
      saveLocal(loadLocal().filter((x) => x.id !== id));
    }
  }
  toast(p.visible ? "Pin visible" : "Pin hidden");
  await loadPins();
  render();
}

async function delPin(id) {
  if (!confirm("Delete this pin?")) return;
  if (sb) {
    await sb.from("pins").delete().eq("id", id);
  }
  saveLocal(loadLocal().filter((x) => x.id !== id));
  toast("Deleted");
  await loadPins();
  render();
}

function unlock() {
  $("login").hidden = true;
  $("panel").hidden = false;
  loadPins().then(render);
}

$("btn-login").onclick = () => {
  const pw = $("pw").value;
  if (pw === (CFG.adminPassword || "hhgoa2026")) {
    sessionStorage.setItem("hhgoa_admin", "1");
    unlock();
  } else {
    toast("Wrong password");
  }
};
$("pw").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("btn-login").click();
});
$("btn-refresh").onclick = () => loadPins().then(render);

sb = initSb();
if (sessionStorage.getItem("hhgoa_admin") === "1") unlock();
