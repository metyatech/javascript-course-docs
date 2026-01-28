import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const projectRoot = __dirname;

const loadEnvFile = (relativePath: string) => {
  const fullPath = path.resolve(projectRoot, relativePath);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath, override: true });
  }
};

loadEnvFile('.env');
loadEnvFile('.env.local');

const resolvedProfile = process.env.DOCUSAURUS_ENV ?? process.env.NODE_ENV;
if (resolvedProfile) {
  loadEnvFile(`.env.${resolvedProfile}`);
  loadEnvFile(`.env.${resolvedProfile}.local`);
}

const authEnvEntries = Object.entries({
  DOCUSAURUS_MICROSOFT_CLIENT_ID: process.env.DOCUSAURUS_MICROSOFT_CLIENT_ID,
  DOCUSAURUS_MICROSOFT_TENANT_ID: process.env.DOCUSAURUS_MICROSOFT_TENANT_ID,
  DOCUSAURUS_MICROSOFT_AUTHORITY_HOST: process.env.DOCUSAURUS_MICROSOFT_AUTHORITY_HOST,
  DOCUSAURUS_MICROSOFT_REDIRECT_URI: process.env.DOCUSAURUS_MICROSOFT_REDIRECT_URI,
  DOCUSAURUS_MICROSOFT_POST_LOGOUT_REDIRECT_URI: process.env.DOCUSAURUS_MICROSOFT_POST_LOGOUT_REDIRECT_URI,
  DOCUSAURUS_MICROSOFT_SCOPES: process.env.DOCUSAURUS_MICROSOFT_SCOPES,
});

const authCustomFields = Object.fromEntries(
  authEnvEntries.filter(([, value]) => typeof value === 'string' && value.trim().length > 0),
);

const commonjsJsModulesPlugin = () => ({
  name: 'commonjs-js-modules',
  configureWebpack() {
    return {
      module: {
        rules: [
          {
            test: /\.js$/,
            type: 'javascript/auto',
          },
        ],
      },
    };
  },
});

const config: Config = {
  title: 'JavaScript',
  tagline: 'JavaScriptの基礎から実践まで',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Production site URL (GitHub Pages)
  url: 'https://metyatech.github.io',
  // For GitHub Pages, set to '/<projectName>/'
  baseUrl: '/javascript-course-docs/',

  // GitHub Pages deployment config
  organizationName: 'metyatech', // GitHub org/user name
  projectName: 'javascript-course-docs', // Repo name
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Internationalization
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Remove edit links for now
          editUrl: undefined,
        },
        // Disable blog for this course site
        blog: false,
        // Ensure pages routed at root
        pages: {
          path: 'src/pages',
          routeBasePath: '/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'JavaScript',
      logo: {
        alt: 'JavaScript Logo',
        src: 'img/logo.svg',
      },
      hideOnScroll: false,
      items: [
        { type: 'docSidebar', sidebarId: 'mainSidebar', position: 'left', label: '学習' },
        { type: 'doc', docId: 'exams/js2-final-preparation/index', position: 'left', label: '試験対策' },
        { href: 'https://github.com/metyatech/javascript-course-docs', label: 'GitHub', position: 'right' },
        { type: 'custom-auth-account', position: 'right' },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `© ${new Date().getFullYear()} さいたまIT・WEB専門学校`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['markup', 'css', 'javascript'],
    },
  } satisfies Preset.ThemeConfig,
  customFields: {
    auth: authCustomFields,
  },
  plugins: [
    '@metyatech/docusaurus-microsoft-auth',
    [
      '@metyatech/exercise',
      {
        headingLevel: 3
      }
    ],
    '@metyatech/docusaurus-download-assets',
    commonjsJsModulesPlugin,
  ],
};

export default config;
