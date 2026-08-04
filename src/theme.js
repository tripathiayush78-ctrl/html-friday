// Central design-token override for Ant Design's theming engine.
// Every Antd component reads these tokens automatically — this is how we
// re-skin the whole component library to match the Figma purple branding
// WITHOUT writing custom CSS for each component.
//
// Swap these hex values to match your Figma inspector panel exactly; that
// alone will re-theme the entire app.
export const themeConfig = {
  token: {
    colorPrimary: '#775DD0', // Friday's signature purple (buttons, links, active states)
    colorBgLayout: '#F5F5F8', // light gray app background (the Content area)
    colorBgContainer: '#FFFFFF', // white surfaces (Sider, Card)
    borderRadius: 10,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Layout: {
      siderBg: '#FFFFFF',
      bodyBg: '#F5F5F8',
    },
    Menu: {
      itemSelectedBg: '#F1EEFC',
      itemSelectedColor: '#775DD0',
      itemHoverColor: '#775DD0',
    },
    Card: {
      borderRadiusLG: 16,
    },
  },
};
