import React from 'react';
import { Footer, Navbar } from 'nextra-theme-docs';

const config = {
  navbar: (
    <Navbar
      logo={<span>JavaScript</span>}
      projectLink="https://github.com/metyatech/javascript-course-docs"
    />
  ),
  footer: (
    <Footer>
      <p>&copy; {new Date().getFullYear()} さいたまIT・WEB専門学校</p>
    </Footer>
  ),
  docsRepositoryBase:
    'https://github.com/metyatech/javascript-course-docs/tree/master',
  editLink: null,
  feedback: {
    content: null,
  },
  navigation: {
    prev: true,
    next: true,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
  },
};

export default config;
