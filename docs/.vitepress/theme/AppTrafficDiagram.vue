<template>
  <figure class="app-traffic" aria-label="Application traffic: a custom domain points to the regional proxy, a proxy node forwards the request over WG Mesh to the VM, and nginx in the VM passes it to the Frappe web process.">
    <div class="traffic-flow">
      <div class="step">
        <div class="step-label">Visitor</div>
        <div class="node">
          <strong>erp.example.com</strong>
          <span>DNS: CNAME to<br><code>proxy.bom.frappe.cloud</code></span>
        </div>
      </div>

      <div class="arrow" aria-hidden="true"><span>HTTPS</span><i></i></div>

      <div class="step">
        <div class="step-label">Regional proxy</div>
        <div class="node cluster">
          <strong>Proxy nodes</strong>
          <div class="proxy-nodes"><span>node 1</span><span>node 2</span><span>node 3</span></div>
          <span>Look up the route and pick the VM</span>
        </div>
      </div>

      <div class="arrow" aria-hidden="true"><span>WG Mesh</span><i></i></div>

      <div class="step">
        <div class="step-label">Pilot VM</div>
        <div class="node vm">
          <div class="vm-part"><strong>nginx</strong><span>Selects the site</span></div>
          <div class="inner-arrow" aria-hidden="true"></div>
          <div class="vm-part"><strong>Frappe</strong><span>Web process, run by Pilot</span></div>
        </div>
      </div>
    </div>
    <figcaption>Central and Atlas are not in this path. The proxy reads its local route map for each request.</figcaption>
  </figure>
</template>

<style scoped>
.app-traffic {
  margin: 24px 0 28px;
  color: var(--ink-gray-9);
  font-size: 14px;
  line-height: 1.5;
}
.traffic-flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 72px minmax(0, 1fr) 72px minmax(0, 1fr);
  align-items: stretch;
}
.step { display: flex; flex-direction: column; }
.step-label { padding-bottom: 8px; color: var(--ink-gray-6); font-size: 13px; text-align: center; }
.node {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border: 1px solid var(--outline-gray-3);
  border-radius: 8px;
  text-align: center;
}
.node strong { font-weight: 550; }
.node span { color: var(--ink-gray-6); font-size: 13px; }
.node code { font-size: 12px; }
.cluster { border-color: var(--map-accent); background: var(--map-tint); }
.proxy-nodes { display: flex; justify-content: center; gap: 6px; }
.proxy-nodes span {
  padding: 2px 8px;
  border: 1px solid var(--outline-gray-3);
  border-radius: 4px;
  background: var(--surface-base);
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
.vm { border-style: dashed; border-color: var(--map-line); background: var(--surface-gray-1); }
.vm-part {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  border: 1px solid var(--outline-gray-2);
  border-radius: 5px;
  background: var(--surface-base);
}
.inner-arrow { position: relative; height: 14px; margin: 0 auto; border-left: 1px solid var(--map-line); }
.inner-arrow::after {
  content: '';
  position: absolute;
  left: -4px;
  bottom: 1px;
  width: 7px;
  height: 7px;
  border-right: 1px solid var(--map-line);
  border-bottom: 1px solid var(--map-line);
  transform: rotate(45deg);
}
.arrow { position: relative; align-self: center; height: 1px; margin: 28px 6px 0; background: var(--map-line); }
.arrow span {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  color: var(--ink-gray-6);
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
}
.arrow i {
  position: absolute;
  right: 0;
  top: -3px;
  width: 7px;
  height: 7px;
  border-top: 1px solid var(--map-line);
  border-right: 1px solid var(--map-line);
  transform: rotate(45deg);
}
figcaption { margin-top: 16px; text-align: right; color: var(--ink-gray-6); font-size: 13px; }
@media (max-width: 760px) {
  .traffic-flow { grid-template-columns: 1fr; max-width: 320px; margin: 0 auto; }
  .arrow { width: 1px; height: 40px; margin: 8px auto; }
  .arrow span { left: 12px; right: auto; bottom: auto; top: 12px; text-align: left; }
  .arrow i { right: auto; top: auto; left: -3px; bottom: 2px; transform: rotate(135deg); }
  figcaption { text-align: left; }
}
</style>
