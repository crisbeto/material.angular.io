import {HttpClient} from '@angular/common/http';
import {Injectable, NgZone, VERSION as NG_VERSION, Version} from '@angular/core';
import {EXAMPLE_COMPONENTS, ExampleData} from '@angular/components-examples';
import {VERSION as MAT_VERSION} from '@angular/material/core';
import {Observable} from 'rxjs';
import {shareReplay, take} from 'rxjs/operators';

import {normalizedMaterialVersion} from '../normalized-version';

const COPYRIGHT = `Copyright ${new Date().getFullYear()} Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license`;

/**
 * Path that refers to the docs-content from the "@angular/components-examples" package. The
 * structure is defined in the Material repository, but we include the docs-content as assets in
 * in the CLI configuration.
 */
const DOCS_CONTENT_PATH = '/docs-content/examples-source';

const TEMPLATE_PATH = '/assets/stack-blitz/';

const PROJECT_TAGS = ['angular', 'material', 'cdk', 'web', 'example'];
const STACKBLITZ_URL = 'https://run.stackblitz.com/api/angular/v1';

const angularVersion = getVersionString(NG_VERSION);
const componentsVersion = getVersionString(MAT_VERSION);

/**
 * List of boilerplate files for an example StackBlitz.
 * This currently matches files needed for a basic Angular CLI project.
 *
 * Note: The template files match up with a basic app generated through `ng new`.
 * StackBlitz does not support binary files like `favicon.ico`, so we removed that
 * file from the boilerplate.
 */
export const TEMPLATE_FILES = [
  '.gitignore',
  'angular.json',
  'karma.conf.js',
  'package.json',
  'package-lock.json',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.spec.json',
  'src/index.html',
  'src/main.ts',
  'src/material.module.ts',
  'src/polyfills.ts',
  'src/styles.scss',
  'src/test.ts',
  'src/theme.scss',
  'src/app/app.module.ts',
  'src/environments/environment.prod.ts',
  'src/environments/environment.ts',
];

/* eslint-disable @typescript-eslint/naming-convention */
const FILE_LOAD_PATHS = {
  demo: {
    'src/main.ts': 'src/main-demo.ts',
    'src/polyfills.ts': 'src/polyfills-demo.ts',
  },
  tests: {
    'src/main.ts': 'src/main-tests.ts',
    'src/polyfills.ts': 'src/polyfills-tests.ts',
  }
};

const dependencies = {
  '@angular/cdk': componentsVersion,
  '@angular/animations': angularVersion,
  '@angular/common': angularVersion,
  '@angular/compiler': angularVersion,
  '@angular/core': angularVersion,
  '@angular/forms': angularVersion,
  '@angular/material': componentsVersion,
  '@angular/material-moment-adapter': componentsVersion,
  '@angular/platform-browser': angularVersion,
  '@angular/platform-browser-dynamic': angularVersion,
  '@angular/router': angularVersion,
  'moment': '^2.29.1',
  'rxjs': '^6.6.7',
  'tslib': '^2.2.0',
  'zone.js': '^0.12.0',
  '@types/jasmine': '^3.7.7',
  'jasmine-core': '^3.7.1',
};

const testDependencies = {
  ...dependencies,
  '@types/jasmine': '^3.7.7',
  'jasmine-core': '^3.7.1',
};
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * StackBlitz writer, write example files to StackBlitz.
 */
@Injectable({providedIn: 'root'})
export class StackBlitzWriter {
  private _fileCache = new Map<string, Observable<string>>();

  constructor(private _http: HttpClient, private _ngZone: NgZone) {}

  async constructStackBlitzForm(exampleId: string, data: ExampleData,
                                isTest: boolean): Promise<HTMLFormElement> {
    const liveExample = EXAMPLE_COMPONENTS[exampleId];
    const fileLoadPaths = FILE_LOAD_PATHS[isTest ? 'tests' : 'demo'] as Record<string, string>;
    const indexFile = `src%2Fapp%2F${data.indexFilename}`;
    const form = this._createFormElement(indexFile);
    const baseExamplePath =
      `${DOCS_CONTENT_PATH}/${liveExample.module.importSpecifier}/${exampleId}/`;

    PROJECT_TAGS.forEach((tag, i) => this._appendFormInput(form, `tags[${i}]`, tag));
    this._appendFormInput(form, 'private', 'true');
    this._appendFormInput(form, 'description', data.description);
    this._appendFormInput(form,
      'dependencies',
      JSON.stringify(isTest ? testDependencies : dependencies));

    // Run outside the zone since this form doesn't interact with Angular
    // and the file requests can cause excessive change detections.
    await this._ngZone.runOutsideAngular(() => {
      const fileReadPromises: Promise<void>[] = [];

      // Read all of the template files.
      TEMPLATE_FILES.forEach(file => {
        const url = TEMPLATE_PATH + (fileLoadPaths[file] || file);
        fileReadPromises.push(this._loadAndAppendFile(form, data, file, url, isTest));
      });

      // Read the example-specific files.
      data.exampleFiles.forEach(file => {
        const appPath = 'src/app/' + file;
        const url = baseExamplePath + file;
        fileReadPromises.push(this._loadAndAppendFile(form, data, appPath, url, isTest));
      });

      // TODO(josephperrott): Prevent including assets to be manually checked.
      if (data.selectorName === 'icon-svg-example') {
        // TODO(crisbeto): check this
        // fileReadPromises.push(this._loadAndAppendFile(form, data,
        //   'assets/img/examples/thumbup-icon.svg', '', isTest));
      }

      return Promise.all(fileReadPromises);
    });

    return form;
  }

  /** Constructs a new form element that will navigate to the StackBlitz url. */
  private _createFormElement(indexFile: string): HTMLFormElement {
    const form = document.createElement('form');
    form.action = `${STACKBLITZ_URL}?file=${indexFile}`;
    form.method = 'post';
    form.target = '_blank';
    return form;
  }

  /** Appends the name and value as an input to the form. */
  private _appendFormInput(form: HTMLFormElement, name: string, value: string): void {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  private _loadAndAppendFile(form: HTMLFormElement, data: ExampleData, filename: string,
                             url: string, isTest: boolean): Promise<void> {
    let stream = this._fileCache.get(url);

    if (!stream) {
      stream = this._http.get(url, {responseType: 'text'}).pipe(shareReplay(1));
      this._fileCache.set(url, stream);
    }

    // The `take(1)` is necessary, because the Promise from `toPromise` resolves on complete.
    return stream.pipe(take(1)).toPromise().then(
      content => {
        content = this._replaceExamplePlaceholders(data, filename, content, isTest);
        this._appendFormInput(form, `files[${filename}]`, this._appendCopyright(filename, content));
      },
      error => console.log(error)
    );
  }

  /**
   * The StackBlitz template assets contain placeholder names for the examples:
   * "<material-docs-example>" and "MaterialDocsExample".
   * This will replace those placeholders with the names from the example metadata,
   * e.g. "<basic-button-example>" and "BasicButtonExample"
   */
  private _replaceExamplePlaceholders(
    data: ExampleData,
    fileName: string,
    fileContent: string,
    isTest: boolean
  ): string {
    // Replaces the version placeholder in the `index.html` and `package.json` file.
    // Technically we invalidate the `package-lock.json` file for the StackBlitz boilerplate
    // by dynamically changing the version in the `package.json`, but the Turbo package manager
    // seems to be able to partially re-use the lock file to speed up the module tree computation,
    // so providing a lock file is still reasonable while modifying the `package.json`.
    if (fileName === 'src/index.html' || fileName === 'package.json') {
      fileContent = fileContent.replace(/\${version}/g, normalizedMaterialVersion);
    }

    if (fileName === 'src/index.html') {
      // Replace the component selector in `index,html`.
      // For example, <material-docs-example></material-docs-example> will be replaced as
      // <button-demo></button-demo>
      fileContent = fileContent
        .replace(/material-docs-example/g, data.selectorName)
        .replace(/\${title}/g, data.description);
    } else if (fileName === '.stackblitzrc') {
      fileContent = fileContent.replace(/\${startCommand}/, isTest ? 'turbo test' : 'turbo start');
    } else if (fileName === 'src/app/app.module.ts') {
      const joinedComponentNames = data.componentNames.join(', ');
      // Replace the component name in `main.ts`.
      // Replace `import {MaterialDocsExample} from 'material-docs-example'`
      // will be replaced as `import {ButtonDemo} from './button-demo'`
      fileContent = fileContent.replace(/{MaterialDocsExample}/g, `{${joinedComponentNames}}`);

      // Replace `declarations: [MaterialDocsExample]`
      // will be replaced as `declarations: [ButtonDemo]`
      fileContent = fileContent.replace(
        /declarations: \[MaterialDocsExample]/g,
        `declarations: [${joinedComponentNames}]`
      );

      // Replace `entryComponents: [MaterialDocsExample]`
      // will be replaced as `entryComponents: [DialogContent]`
      fileContent = fileContent.replace(
        /entryComponents: \[MaterialDocsExample]/g,
        `entryComponents: [${joinedComponentNames}]`
      );

      // Replace `bootstrap: [MaterialDocsExample]`
      // will be replaced as `bootstrap: [ButtonDemo]`
      // This assumes the first component listed in the main component
      fileContent = fileContent.replace(
        /bootstrap: \[MaterialDocsExample]/g,
        `bootstrap: [${data.componentNames[0]}]`
      );

      const dotIndex = data.indexFilename.lastIndexOf('.');
      const importFileName = data.indexFilename.slice(0, dotIndex === -1 ? undefined : dotIndex);
      fileContent = fileContent.replace(/material-docs-example/g, importFileName);
    }
    return fileContent;
  }

  _appendCopyright(filename: string, content: string) {
    if (filename.indexOf('.ts') > -1 || filename.indexOf('.scss') > -1) {
      content = `${content}\n\n/**  ${COPYRIGHT} */`;
    } else if (filename.indexOf('.html') > -1) {
      content = `${content}\n\n<!-- ${COPYRIGHT} -->`;
    }
    return content;
  }
}

function getVersionString(version: Version): string {
  let suffix = '';

  if (version.full.includes('-next')) {
    suffix = '-next.0';
  } else if (version.full.includes('-rc')) {
    suffix = '-rc.0';
  }

  return `^${version.major}.${version.minor}.0${suffix}`;
}
