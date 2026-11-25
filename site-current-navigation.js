(() => {
  const links = Array.from(document.querySelectorAll('.site-header nav a'));
  const basePath = new URL(document.querySelector('.site-header .brand').href).pathname;
  const normalizePath = pathname => {
    const relativePath = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
    const route = relativePath.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
    return route && route !== 'index' ? '/' + route : '/';
  };
  const servicePages = new Set(['/repair', '/finishing']);

  function updateCurrentLink() {
    const currentPath = normalizePath(location.pathname);
    for (const link of links) {
      const linkPath = normalizePath(link.pathname);
      const isServices = linkPath === '/' && link.hash === '#remont-services';
      const isCurrent = isServices
        ? servicePages.has(currentPath) || (currentPath === '/' && location.hash === link.hash)
        : currentPath === linkPath;

      if (isCurrent) {
        link.setAttribute('aria-current', link.hash ? 'location' : 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }

  updateCurrentLink();
  window.addEventListener('hashchange', updateCurrentLink);
  window.addEventListener('pageshow', updateCurrentLink);
})();
