<template>
  <figure class="app-traffic" aria-label="Application traffic in four steps: the browser looks up the custom domain, DNS points it to the healthy regional proxy nodes, one proxy node forwards the request over WG Mesh, and nginx in the Pilot VM passes it to the Frappe web process.">
    <ol class="flow">
      <li class="stage">
        <span class="step">1 · Browser</span>
        <div class="card">
          <strong class="mono">erp.example.com</strong>
          <span>A visitor opens the site</span>
        </div>
      </li>

      <li class="link" aria-hidden="true"><span>lookup</span></li>

      <li class="stage">
        <span class="step">2 · DNS</span>
        <div class="card">
          <strong class="mono">proxy.bom.frappe.cloud</strong>
          <span>CNAME to the region's proxy, one record per healthy node</span>
        </div>
      </li>

      <li class="link" aria-hidden="true"><span>HTTPS</span></li>

      <li class="stage">
        <span class="step">3 · Regional proxy</span>
        <div class="card accent">
          <div class="chips">
            <i class="chip square on">1</i><i class="chip square">2</i><i class="chip square">3</i>
            <small>up to 5 nodes</small>
          </div>
          <span>A node finds the VM in its route map</span>
        </div>
      </li>

      <li class="link" aria-hidden="true"><span>WG Mesh</span></li>

      <li class="stage">
        <span class="step">4 · Pilot VM</span>
        <div class="card vm">
          <div class="chips">
            <i class="chip on">nginx</i><b class="to">→</b><i class="chip on">Frappe</i>
          </div>
          <span>nginx selects the site, Frappe serves it</span>
        </div>
      </li>
    </ol>

    <figcaption>
      <span><b>Regional name:</b> TLS ends at the proxy.</span>
      <span><b>Custom domain:</b> TLS passes through to the VM.</span>
      <span>Central and Atlas are not in this path.</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.app-traffic {
  margin: 28px 0 32px;
  color: var(--ink-gray-9);
  font-size: 14px;
  line-height: 1.45;
}
.flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 56px minmax(0, 1.2fr) 56px minmax(0, 1fr) 56px minmax(0, 1fr);
  align-items: stretch;
  margin: 0;
  padding: 0;
  list-style: none;
}
.stage { display: flex; flex-direction: column; gap: 8px; margin: 0; }
.step { color: var(--ink-gray-6); font-size: 12px; font-weight: 500; }
.card {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  min-height: 92px;
  padding: 12px 14px;
  border: 1px solid var(--outline-gray-3);
  border-radius: 8px;
  background: var(--surface-base);
}
.card > span { color: var(--ink-gray-6); font-size: 12px; }
.card strong { font-weight: 550; overflow-wrap: anywhere; }
.mono { font-family: ui-monospace, monospace; font-size: 13px; }
.accent { border-color: var(--map-accent); background: var(--map-tint); }
.vm { border-style: dashed; border-color: var(--map-line); background: var(--surface-gray-1); }
.chips { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.chip {
  padding: 2px 6px;
  border: 1px solid var(--outline-gray-3);
  border-radius: 5px;
  background: var(--surface-base);
  color: var(--ink-gray-5);
  font-family: ui-monospace, monospace;
  font-size: 12px;
  font-style: normal;
}
.chip.on { border-color: var(--map-accent); color: var(--ink-gray-9); }
.square { width: 24px; padding: 2px 0; text-align: center; }
.chips small { color: var(--ink-gray-6); font-size: 12px; }
.to { color: var(--ink-gray-5); font-weight: 400; }
.link { position: relative; margin: 0; }
.link::before {
  content: '';
  position: absolute;
  left: 8px;
  right: 8px;
  top: calc(50% + 13px);
  border-top: 1px solid var(--map-line);
}
.link::after {
  content: '';
  position: absolute;
  right: 8px;
  top: calc(50% + 10px);
  width: 7px;
  height: 7px;
  border-top: 1px solid var(--map-line);
  border-right: 1px solid var(--map-line);
  transform: rotate(45deg);
}
.link span {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% - 6px);
  color: var(--ink-gray-6);
  font-size: 11px;
  text-align: center;
  white-space: nowrap;
}
figcaption {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  margin-top: 16px;
  color: var(--ink-gray-6);
  font-size: 13px;
}
figcaption b { color: var(--ink-gray-8); font-weight: 550; }
@media (max-width: 760px) {
  .flow { grid-template-columns: 1fr; max-width: 320px; margin: 0 auto; }
  .card { min-height: 0; }
  .link { height: 36px; }
  .link::before { top: 4px; bottom: 4px; left: 50%; right: auto; border-top: 0; border-left: 1px solid var(--map-line); }
  .link::after { top: auto; bottom: 4px; left: calc(50% - 3px); right: auto; transform: rotate(135deg); }
  .link span { top: 10px; bottom: auto; left: calc(50% + 12px); right: auto; text-align: left; }
  figcaption { flex-direction: column; }
}
</style>
