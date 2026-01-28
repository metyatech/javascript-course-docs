import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro/index',
    {
      type: 'category',
      label: '基礎',
      items: [
        'basics/introduction/index',
        'basics/function-intro/index',
        'basics/function-return/index',
        'basics/object-intro/index',
        'basics/array-intro/index',
        'basics/array-methods/index',
        'basics/dom-css/index',
        'basics/dom-innertext/index',
        'basics/dom-events/index',
        'basics/dom-css-transition/index',
        'basics/dom-css-class-transition/index',
      ],
    },
    {
      type: 'category',
      label: 'UIコンポーネント',
      items: [
        'ui-components/slider_swiper/index',
        'ui-components/accordion-menu_jquery-slidetoggle/index',
        'ui-components/drawer-menu/index',
        'ui-components/dropdown-menu/index',
        'ui-components/popup_magnific-popup/index',
        'ui-components/show-more/index',
      ],
    },
    'review/comprehensive-practice/index',
    {
      type: 'category',
      label: '資料',
      items: ['materials/javascript-basics-supplement/index'],
    },
  ],
};

export default sidebars;
