function instantScrollTo(top: number) {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  root.style.scrollBehavior = prev;
}

// Hides `inner` while doing an instant jump to `jumpTop`, then reveals it and finishes
// with a smooth scroll to `finalTop`. Guarded with a timeout fallback so `inner` can
// never get stuck invisible if the rAF chain doesn't fire (e.g. Safari quirks).
function hideJumpAndReveal(inner: HTMLElement | undefined, jumpTop: number, finalTop: number) {
  if (inner) inner.style.opacity = "0";
  instantScrollTo(jumpTop);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (inner) inner.style.opacity = "";
    window.scrollTo({ top: finalTop, behavior: "smooth" });
  };

  requestAnimationFrame(() => requestAnimationFrame(finish));
  window.setTimeout(finish, 500);
}

export function doNavigate(href: string) {
  const targetEl = href === "#" ? null : (document.querySelector(href) as HTMLElement | null);
  const targetTop = targetEl ? targetEl.getBoundingClientRect().top + window.scrollY - 80 : 0;
  const exp = document.getElementById("experience");
  const feat = document.getElementById("featured-project");
  const y = window.scrollY;

  if (exp) {
    const expTop = exp.getBoundingClientRect().top + window.scrollY;
    const expEnd = expTop + exp.offsetHeight - window.innerHeight;

    if (href === "#experience") {
      const dest = expTop - 80;
      if (y <= dest) {
        window.scrollTo({ top: dest, behavior: "smooth" });
      } else {
        instantScrollTo(dest);
      }
      return;
    }

    if (feat && href === "#featured-project") {
      const featAbsTop = feat.getBoundingClientRect().top + window.scrollY;
      const dest = featAbsTop - 80;
      if (y <= dest) {
        window.scrollTo({ top: dest, behavior: "smooth" });
      } else {
        const featInner = feat.children[0] as HTMLElement | undefined;
        hideJumpAndReveal(featInner, Math.max(0, featAbsTop - 1), dest);
      }
      return;
    }

    const featTop = feat ? feat.getBoundingClientRect().top + window.scrollY : 0;
    const featEnd = feat ? featTop + feat.offsetHeight - window.innerHeight : 0;

    // Only instant-jump when the user is fully outside the experience section
    const crossesExpDown = y < expTop && targetTop > expEnd;
    const crossesExpUp = y > expEnd && targetTop <= expTop;
    const crossesFeatDown = !!feat && y < featTop && targetTop > featEnd;
    const crossesFeatUp = !!feat && y > featEnd && targetTop < featTop;

    if (crossesExpDown) {
      const expInner = exp.children[0] as HTMLElement | undefined;
      hideJumpAndReveal(expInner, expEnd + 1, targetTop);
      return;
    }

    if (crossesExpUp) {
      const jumpTo = feat && targetTop < featTop
        ? Math.max(0, featTop - 1)
        : Math.max(0, expTop - 81);
      const expInner = exp.children[0] as HTMLElement | undefined;
      hideJumpAndReveal(expInner, jumpTo, targetTop);
      return;
    }

    if (crossesFeatDown) {
      const featInner = feat!.children[0] as HTMLElement | undefined;
      hideJumpAndReveal(featInner, featEnd + 1, targetTop);
      return;
    }

    if (crossesFeatUp) {
      const featInner = feat!.children[0] as HTMLElement | undefined;
      hideJumpAndReveal(featInner, Math.max(0, featTop - 1), targetTop);
      return;
    }
  }

  window.scrollTo({ top: targetTop, behavior: "smooth" });
}
