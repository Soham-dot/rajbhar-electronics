export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = theme === 'dark' || (!theme && prefersDark);
        
        const html = document.documentElement;
        const body = document.body;
        
        if (shouldBeDark) {
          html.classList.add('dark');
          html.style.cssText = 'background-color: #061a27 !important;';
          body.style.cssText = 'background-color: #061a27 !important; color: #ffffff !important;';
        } else {
          html.classList.remove('dark');
          html.style.cssText = 'background-color: #ffffff !important;';
          body.style.cssText = 'background-color: #ffffff !important; color: #000000 !important;';
        }
      } catch (e) {}
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
