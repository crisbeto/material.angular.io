import 'jasmine-core/lib/jasmine-core/jasmine-html.js';
import 'jasmine-core/lib/jasmine-core/boot.js';
// @ts-ignore
import jasmineRequire from 'jasmine-core/lib/jasmine-core/jasmine.js';
(window as any).jasmineRequire = jasmineRequire;

import './test.ts';
import './app/material-docs-example.spec';

if ((window as any).jasmineRef) {
  location.reload();
} else {
  window.onload?.(new Event('anything'));
  (window as any).jasmineRef = jasmine.getEnv();
}
