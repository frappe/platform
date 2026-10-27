<template>
  <figure class="cloud-architecture" aria-label="Cloud v2 architecture: customers use Central, which manages separate regions. The Mumbai region is expanded.">
    <div class="cloud-map">
      <div class="central-group">
        <div class="customer-label">Customer · Cloud console</div>
        <div class="central-node">
          <strong>Central</strong>
          <span>Accounts, permissions<br>and billing</span>
        </div>
        <p class="request-label">Approved management<br>requests to each region</p>
      </div>

      <div class="region-connections" aria-hidden="true"><i></i><i></i></div>

      <div class="region-stack">
        <section class="region-detail" aria-label="Mumbai region">
          <header class="region-heading">
            <div><span class="region-code">BOM</span><strong>Mumbai</strong></div>
          </header>
          <div class="regional-control">
            <div><strong>Atlas</strong><span>Manages VMs and hosts</span></div>
            <div><strong>Cargo</strong><span>Builds images and manages services</span></div>
          </div>
          <div class="host-connection" aria-hidden="true"><span>Atlas asks Metal to run VMs</span></div>
          <div class="physical-hosts">
            <div class="host-heading"><strong>Physical hosts</strong><span>Metal · WG Mesh</span></div>
            <div class="vm-pair">
              <div><strong>Raw VM</strong><span>Ubuntu + your software</span></div>
              <div><strong>Pilot VM</strong><span>Pilot + Frappe apps</span></div>
            </div>
          </div>
          <div class="regional-support">
            <div><strong>HTTP proxy</strong><span>Web traffic</span></div>
            <div><strong>Garage</strong><span>Object storage</span></div>
            <div><strong>Datum → ClickHouse</strong><span>Metrics and logs</span></div>
          </div>
          <p class="network-services">Network access: IPv6 router · WireGuard gateway</p>
        </section>
        <section class="region-peer" aria-label="Bengaluru region">
          <div><span class="region-code">BLR</span><strong>Bengaluru</strong></div>
          <p>The same service roles, with its own infrastructure.</p>
        </section>
      </div>
    </div>
    <figcaption>Central connects to each region. Regional services run and communicate within that region.</figcaption>
  </figure>
</template>

<style scoped>
.cloud-architecture {
  margin: 32px 0 0;
  color: var(--ink-gray-9);
  font-size: 14px;
  line-height: 1.5;
}
.cloud-map {
  display: grid;
  grid-template-columns: 182px 48px minmax(0, 1fr);
  position: relative;
}
.central-group { text-align: center; }
.customer-label { position: relative; padding-bottom: 27px; font-size: 13px; }
.customer-label::after {
  content: '';
  position: absolute;
  height: 19px;
  bottom: 4px;
  left: 50%;
  border-left: 1px solid var(--map-line);
}
.central-node {
  display: flex;
  height: 112px;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  border: 1px solid var(--map-accent);
  border-radius: 8px;
  background: var(--map-tint);
}
.central-node strong { font-size: 20px; font-weight: 600; }
.central-node span { color: var(--ink-gray-7); }
.request-label { margin: 12px 0 0; color: var(--ink-gray-6); font-size: 13px; }
.region-connections { position: relative; margin-top: 104px; margin-bottom: 41px; }
.region-connections::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  border-top: 1px solid var(--map-line);
}
.region-connections::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 40%;
  right: 0;
  border-left: 1px solid var(--map-line);
  border-bottom: 1px solid var(--map-line);
  border-bottom-left-radius: 8px;
}
.region-connections i {
  position: absolute;
  z-index: 1;
  right: 1px;
  top: -3px;
  width: 7px;
  height: 7px;
  border-top: 1px solid var(--map-line);
  border-right: 1px solid var(--map-line);
  transform: rotate(45deg);
}
.region-connections i:last-child { top: auto; bottom: -3px; }
.region-stack { display: flex; flex-direction: column; gap: 16px; }
.region-detail { border: 1px solid var(--outline-gray-3); border-radius: 10px; padding: 22px; }
.region-heading, .region-heading > div, .region-peer > div, .host-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.region-heading > div, .region-peer > div { justify-content: flex-start; }
.region-heading strong, .region-peer strong { font-size: 16px; font-weight: 600; }
.region-heading > span { color: var(--ink-gray-6); font-size: 13px; }
.region-code { color: var(--ink-gray-6); font-size: 12px; font-family: ui-monospace, monospace; letter-spacing: 0.04em; }
.regional-control { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding-top: 24px; }
.regional-control > div, .regional-support > div, .vm-pair > div { display: flex; flex-direction: column; gap: 3px; }
.regional-control strong, .regional-support strong, .vm-pair strong, .host-heading strong { font-weight: 550; }
.regional-control span, .regional-support span, .vm-pair span, .host-heading > span { color: var(--ink-gray-6); font-size: 13px; }
.host-connection { position: relative; height: 40px; margin-left: 14px; border-left: 1px solid var(--map-line); }
.host-connection span { position: absolute; left: 12px; top: 10px; color: var(--ink-gray-6); font-size: 12px; }
.host-connection::after {
  content: '';
  position: absolute;
  left: -4px;
  bottom: 2px;
  width: 7px;
  height: 7px;
  border-right: 1px solid var(--map-line);
  border-bottom: 1px solid var(--map-line);
  transform: rotate(45deg);
}
.physical-hosts { padding: 16px; border: 1px dashed var(--map-line); border-radius: 6px; background: var(--surface-gray-1); }
.host-heading { font-size: 13px; margin-bottom: 12px; }
.vm-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.vm-pair > div { padding: 12px; border: 1px solid var(--outline-gray-2); border-radius: 5px; background: var(--surface-base); }
.regional-support { display: grid; grid-template-columns: 1fr 1fr 1.4fr; gap: 12px; padding-top: 22px; }
.regional-support strong { font-size: 13px; }
.network-services { margin: 18px 0 0; padding-top: 14px; border-top: 1px solid var(--outline-gray-2); color: var(--ink-gray-6); font-size: 12px; }
.region-peer { display: flex; flex-direction: column; justify-content: center; gap: 6px; min-height: 82px; padding: 14px 22px; border: 1px solid var(--outline-gray-3); border-radius: 10px; }
.region-peer p { margin: 0; color: var(--ink-gray-6); font-size: 13px; }
figcaption { margin-top: 16px; text-align: right; color: var(--ink-gray-6); font-size: 13px; }
@media (max-width: 760px) {
  .cloud-map { grid-template-columns: 1fr; }
  .central-group { padding-top: 0; max-width: 260px; width: 100%; margin: 0 auto; }
  .central-node { height: 104px; }
  .request-label { margin-top: 10px; }
  .request-label br { display: none; }
  .region-connections { height: 32px; width: 1px; margin: 10px auto 0; background: var(--map-line); }
  .region-connections::before, .region-connections::after, .region-connections i:last-child { display: none; }
  .region-connections i { top: auto; bottom: 2px; right: -3px; transform: rotate(135deg); }
  .region-detail { padding: 18px; }
  .region-heading { gap: 8px; }
  .regional-control { gap: 16px; }
  .physical-hosts { padding: 12px; }
  .vm-pair { gap: 8px; }
  .vm-pair > div { padding: 10px; }
  .regional-support { grid-template-columns: 1fr 1fr; gap: 14px; }
  .regional-support > div:last-child { grid-column: 1 / -1; }
  .host-heading { flex-wrap: wrap; gap: 4px 12px; }
  .region-peer { padding: 14px 18px; }
  figcaption { text-align: left; }
}
</style>
