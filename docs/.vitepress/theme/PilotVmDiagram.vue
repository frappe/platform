<template>
  <figure class="pilot-vm" aria-label="Inside a Pilot VM: nginx sends site requests to the Frappe web, realtime and job roles, and the admin hostname to Pilot admin. Frappe uses Redis and MariaDB. Pilot runs the admin API, a monitor and a log shipper.">
    <div class="frame">
      <header class="frame-head">
        <strong>Pilot VM</strong>
        <span>Processes run as systemd user services</span>
      </header>

      <div class="grid">
        <div class="column">
          <span class="column-label">Entry</span>
          <div class="card">
            <strong>nginx</strong>
            <ul class="routes">
              <li><code>/</code><span>Frappe web</span></li>
              <li><code>/socket.io</code><span>Realtime</span></li>
              <li><code>/assets</code> <code>/files</code><span>Served from disk</span></li>
              <li><code>admin-vm-*</code><span>Pilot admin</span></li>
            </ul>
          </div>
        </div>

        <div class="link" aria-hidden="true"></div>

        <div class="column">
          <span class="column-label">Processes</span>
          <div class="card accent">
            <strong>Frappe bench</strong>
            <ul class="rows">
              <li><b>Web</b><span>gunicorn</span></li>
              <li><b>Realtime</b><span>socketio</span></li>
              <li><b>Jobs</b><span>worker pool and scheduler</span></li>
            </ul>
            <p>Lite mode, the default, runs all three in one Frappe process instead.</p>
          </div>
          <div class="card">
            <strong>Pilot</strong>
            <ul class="rows">
              <li><b>Admin</b><span>API, UI and task worker</span></li>
              <li><b>Monitor</b><span>metrics and site pings</span></li>
              <li><b>Fluent Bit</b><span>ships logs</span></li>
            </ul>
          </div>
        </div>

        <div class="link" aria-hidden="true"></div>

        <div class="column">
          <span class="column-label">Data</span>
          <div class="card store"><strong>Redis cache</strong><span>cache and sessions</span></div>
          <div class="card store"><strong>Redis queue</strong><span>background jobs</span></div>
          <div class="card store"><strong>MariaDB</strong><span>site databases</span></div>
          <div class="card store"><strong>sites/</strong><span>site config and files</span></div>
        </div>
      </div>
    </div>
    <figcaption>Monitor and Fluent Bit send metrics and logs to the regional Datum service.</figcaption>
  </figure>
</template>

<style scoped>
.pilot-vm {
  margin: 28px 0 32px;
  color: var(--ink-gray-9);
  font-size: 14px;
  line-height: 1.45;
}
.frame {
  padding: 16px 18px 18px;
  border: 1px dashed var(--map-line);
  border-radius: 10px;
  background: var(--surface-gray-1);
}
.frame-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.frame-head strong { font-weight: 600; }
.frame-head span { color: var(--ink-gray-6); font-size: 12px; }
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 36px minmax(0, 1.15fr) 36px minmax(0, 0.8fr);
}
.column { display: flex; flex-direction: column; gap: 10px; }
.column-label { color: var(--ink-gray-6); font-size: 12px; font-weight: 500; }
.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid var(--outline-gray-3);
  border-radius: 8px;
  background: var(--surface-base);
}
.card strong { font-weight: 550; }
.card > span, .card p { margin: 0; color: var(--ink-gray-6); font-size: 12px; }
.accent { border-color: var(--map-accent); background: var(--map-tint); }
.store { flex: 1; justify-content: center; gap: 1px; padding: 8px 12px; }
ul { margin: 0; padding: 0; list-style: none; }
.routes li, .rows li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
  margin: 0;
  padding: 5px 0;
  border-top: 1px solid var(--outline-gray-2);
  font-size: 13px;
}
.routes li:first-child, .rows li:first-child { border-top: 0; padding-top: 0; }
.routes code { font-size: 12px; }
.routes span, .rows span { margin-left: auto; color: var(--ink-gray-6); font-size: 12px; }
.rows b { font-weight: 500; }
.link { position: relative; }
.link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 6px;
  right: 6px;
  border-top: 1px solid var(--map-line);
}
.link::after {
  content: '';
  position: absolute;
  top: calc(50% - 3px);
  right: 6px;
  width: 7px;
  height: 7px;
  border-top: 1px solid var(--map-line);
  border-right: 1px solid var(--map-line);
  transform: rotate(45deg);
}
figcaption { margin-top: 12px; color: var(--ink-gray-6); font-size: 13px; text-align: right; }
@media (max-width: 760px) {
  .frame { padding: 14px; }
  .frame-head { flex-direction: column; gap: 2px; }
  .grid { grid-template-columns: 1fr; }
  .link { height: 32px; }
  .link::before { top: 4px; bottom: 4px; left: 50%; right: auto; border-top: 0; border-left: 1px solid var(--map-line); }
  .link::after { top: auto; bottom: 4px; left: calc(50% - 3px); right: auto; transform: rotate(135deg); }
  figcaption { text-align: left; }
}
</style>
