(() => {
  "use strict";
  const root = document.querySelector("[data-notifications]");
  if (!root) return;
  const bell = root.querySelector(".rs-notifications__bell");
  const badge = root.querySelector(".rs-notifications__badge");
  const panel = root.querySelector(".rs-notifications__panel");
  const list = root.querySelector(".rs-notifications__list");
  const status = root.querySelector(".rs-notifications__status");
  const readAll = root.querySelector("[data-notification-read-all]");
  const toast = document.querySelector(".rs-notification-toast");
  const filters = root.querySelectorAll("[data-notification-filter]");
  let data = null;
  let filter = "all";
  let error = "";
  let timer;
  let toastTimer;
  let loading = false;
  let reading = false;
  let refreshPending = false;
  let latestOrderId = null;

  function toggle(open, restoreFocus = false) {
    panel.hidden = !open;
    bell.setAttribute("aria-expanded", String(open));
    if (open) {
      toast.hidden = true;
      void refresh();
      root.querySelector("[data-notification-close]").focus();
    } else if (restoreFocus) bell.focus();
  }

  function render() {
    const focusedId = list.contains(document.activeElement)
      ? document.activeElement.dataset.notificationId
      : null;
    const unread = data?.unread || 0;
    badge.hidden = unread === 0;
    badge.textContent = unread > 99 ? "99+" : String(unread);
    bell.setAttribute(
      "aria-label",
      unread ? `Notifications, ${unread} unread` : "Notifications",
    );
    readAll.disabled = !data || !unread || reading || !!error;
    list.replaceChildren();
    filters.forEach((button) => {
      const kind = button.dataset.notificationFilter;
      const count =
        kind === "order"
          ? data?.orderUnread
          : kind === "cart"
            ? data?.cartUnread
            : unread;
      button.textContent = `${kind === "order" ? "Orders" : kind === "cart" ? "Carts" : "All"}${count ? ` (${count})` : ""}`;
      button.setAttribute("aria-pressed", String(kind === filter));
    });
    const items = (data?.items || []).filter(
      (item) => filter === "all" || item.kind === filter,
    );
    status.textContent =
      error ||
      (!data
        ? "Loading notifications..."
        : !items.length
          ? "No notifications yet. New orders and cart updates will appear here."
          : `${unread} unread notification${unread === 1 ? "" : "s"}`);
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = item.read ? "" : "rs-notifications__unread";
      const link = document.createElement("a");
      link.dataset.notificationId = String(item.id);
      link.href = item.url;
      const kind = document.createElement("span");
      kind.className = "rs-notifications__kind";
      kind.textContent = item.kind === "order" ? "NEW ORDER" : "CART UPDATE";
      const title = document.createElement("strong");
      title.textContent = item.title;
      const description = document.createElement("span");
      description.className = "rs-notifications__description";
      description.textContent = item.description;
      const time = document.createElement("time");
      time.dateTime = item.updatedAt;
      time.textContent = new Date(item.updatedAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      link.append(kind, title, description, time);
      link.addEventListener("click", async (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        if (!item.read)
          await markRead({ id: item.id, updatedAt: item.updatedAt });
        window.location.assign(link.href);
      });
      li.append(link);
      list.append(li);
    });
    if (focusedId && !panel.hidden) {
      list
        .querySelector(`[data-notification-id="${focusedId}"]`)
        ?.focus({ preventScroll: true });
    }
  }

  async function request(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, {
        credentials: "same-origin",
        cache: "no-store",
        ...options,
        signal: controller.signal,
      });
      if (
        response.redirected ||
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "Your session may have expired. Reload this admin page to sign in again.",
        );
      }
      if (!response.headers.get("content-type")?.includes("application/json"))
        throw new Error("Could not load notifications. Please try again.");
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.message || "Notifications are temporarily unavailable.",
        );
      return result;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function refresh() {
    if (document.hidden) return;
    if (loading || reading) {
      refreshPending = true;
      return;
    }
    clearTimeout(timer);
    loading = true;
    try {
      const feedUrl = new URL(root.dataset.feed, window.location.origin);
      if (document.querySelector("[data-dashboard-count]"))
        feedUrl.searchParams.set("counts", "1");
      const result = await request(feedUrl);
      if (latestOrderId !== null && result.latestOrderId > latestOrderId) {
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.hidden = true;
        }, 12000);
      }
      latestOrderId = result.latestOrderId;
      data = result;
      document.querySelectorAll("[data-dashboard-count]").forEach((element) => {
        const metric = result.counts?.[element.dataset.dashboardCount];
        if (typeof metric?.value !== "number") return;
        element.textContent = `${metric.value.toLocaleString()} ${metric.label}`;
        element.setAttribute(
          "aria-label",
          `${metric.value} ${metric.label} ${element.dataset.countName}`,
        );
      });
      error = "";
    } catch (failure) {
      error =
        failure.message || "Could not load notifications. Please try again.";
    } finally {
      loading = false;
      render();
      if (!document.hidden)
        timer = setTimeout(refresh, refreshPending ? 0 : error ? 60000 : 30000);
      refreshPending = false;
    }
  }

  async function markRead(payload) {
    if (reading) return false;
    const csrf = document.querySelector(
      'input[name="csrfmiddlewaretoken"]',
    )?.value;
    if (!csrf) {
      error = "Reload this page before updating notifications.";
      render();
      return false;
    }
    reading = true;
    render();
    try {
      await request(root.dataset.read, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": csrf },
        body: JSON.stringify(payload),
      });
      error = "";
      return true;
    } catch (failure) {
      error =
        failure.message ||
        "Could not mark notifications as read. Please try again.";
      return false;
    } finally {
      reading = false;
      render();
      if (refreshPending && !loading) {
        refreshPending = false;
        void refresh();
      }
    }
  }

  bell.addEventListener("click", () => toggle(panel.hidden));
  root
    .querySelector("[data-notification-close]")
    .addEventListener("click", () => toggle(false, true));
  root
    .querySelector("[data-notification-refresh]")
    .addEventListener("click", refresh);
  readAll.addEventListener("click", async () => {
    if (data && (await markRead({ all: true, asOf: data.asOf })))
      void refresh();
  });
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.notificationFilter;
      render();
    }),
  );
  document
    .querySelector("[data-notification-view]")
    .addEventListener("click", () => toggle(true));
  document
    .querySelector("[data-notification-dismiss]")
    .addEventListener("click", () => {
      toast.hidden = true;
    });
  document.addEventListener("pointerdown", (event) => {
    if (!root.contains(event.target)) toggle(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) toggle(false, true);
  });
  document.addEventListener("visibilitychange", () => {
    clearTimeout(timer);
    if (!document.hidden) void refresh();
  });
  void refresh();
})();
