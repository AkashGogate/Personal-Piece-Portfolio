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
      window.scrollTo({ top: dest, behavior: y <= dest ? "smooth" : ("instant" as ScrollBehavior) });
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
      if (expInner) expInner.style.opacity = "0";
      window.scrollTo({ top: expEnd + 1, behavior: "instant" as ScrollBehavior });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (expInner) expInner.style.opacity = "";
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }));
      return;
    }

    if (crossesExpUp) {
      const jumpTo = feat && targetTop < featTop
        ? Math.max(0, featTop - 1)
        : Math.max(0, expTop - 81);
      const expInner = exp.children[0] as HTMLElement | undefined;
      if (expInner) expInner.style.opacity = "0";
      window.scrollTo({ top: jumpTo, behavior: "instant" as ScrollBehavior });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (expInner) expInner.style.opacity = "";
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }));
      return;
    }

    if (crossesFeatDown) {
      const featInner = feat!.children[0] as HTMLElement | undefined;
      if (featInner) featInner.style.opacity = "0";
      window.scrollTo({ top: featEnd + 1, behavior: "instant" as ScrollBehavior });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (featInner) featInner.style.opacity = "";
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }));
      return;
    }

    if (crossesFeatUp) {
      const featInner = feat!.children[0] as HTMLElement | undefined;
      if (featInner) featInner.style.opacity = "0";
      window.scrollTo({ top: Math.max(0, featTop - 1), behavior: "instant" as ScrollBehavior });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (featInner) featInner.style.opacity = "";
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }));
      return;
    }
  }

  window.scrollTo({ top: targetTop, behavior: "smooth" });
}
