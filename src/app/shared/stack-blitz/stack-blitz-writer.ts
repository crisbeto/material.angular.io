import {HttpClient} from '@angular/common/http';
import {Injectable, NgZone, VERSION as NG_VERSION, Version} from '@angular/core';
import {EXAMPLE_COMPONENTS, ExampleData} from '@angular/components-examples';
import {VERSION as MAT_VERSION} from '@angular/material/core';
import {Observable} from 'rxjs';
import {shareReplay, take} from 'rxjs/operators';

import stackblitz from '@stackblitz/sdk';

import {normalizedMaterialVersion} from '../normalized-version';
import {normalizePath} from '../normalize-path';

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

const PROJECT_TAGS = ['angular', 'material', 'cdk', 'web', 'example'];
const PROJECT_TEMPLATE = 'node';
const STACKBLITZ_URL = 'https://run.stackblitz.com/api/angular/v1';

const angularVersion = getVersionString(NG_VERSION);
const componentsVersion = getVersionString(MAT_VERSION);

/* eslint-disable @typescript-eslint/naming-convention */
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
};

const testDependencies = {
  ...dependencies,
  '@types/jasmine': '^3.7.7',
  'jasmine-core': '^3.7.1',
};
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Type describing an in-memory file dictionary, representing a
 * directory and its contents.
 */
type FileDictionary = {[path: string]: string};

/**
 * StackBlitz writer, write example files to StackBlitz.
 */
@Injectable({providedIn: 'root'})
export class StackBlitzWriter {
  private _fileCache = new Map<string, Observable<string>>();

  constructor(private _http: HttpClient, private _ngZone: NgZone) {}

  /** Opens a StackBlitz for the specified example. */
  createStackBlitzForExample(
    exampleId: string,
    data: ExampleData,
    isTest: boolean
  ): Promise<() => void> {
    // Run outside the zone since the creation doesn't interact with Angular
    // and the file requests can cause excessive change detections.
    return this._ngZone.runOutsideAngular(async () => {
      const files = await this._buildInMemoryFileDictionary(data, exampleId, isTest);
      const exampleMainFile = `src/app/${data.indexFilename}`;

      return () => {
        this._openStackBlitz({
          files,
          title: `Angular Components - ${data.description}`,
          description: `${data.description}\n\nAuto-generated from: https://material.angular.io`,
          openFile: exampleMainFile,
        });
      };
    });
  }

  async constructStackBlitzForm(exampleId: string, data: ExampleData,
                                isTest: boolean): Promise<HTMLFormElement> {
    const liveExample = EXAMPLE_COMPONENTS[exampleId];
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
      TEMPLATE_FILES.forEach(file => fileReadPromises.push(
        this._loadAndAppendFile(form, data, file, TEMPLATE_PATH, isTest)));

      // Read the example-specific files.
      data.exampleFiles.forEach(file => fileReadPromises.push(this._loadAndAppendFile(form, data,
        file, baseExamplePath, isTest)));

      // TODO(josephperrott): Prevent including assets to be manually checked.
      if (data.selectorName === 'icon-svg-example') {
        fileReadPromises.push(this._loadAndAppendFile(form, data,
          'assets/img/examples/thumbup-icon.svg', '', isTest, false));
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
                            path: string, isTest: boolean, prependApp = true): Promise<void> {
    const url = path + filename;
    let stream = this._fileCache.get(url);

    if (!stream) {
      stream = this._http.get(url, {responseType: 'text'}).pipe(shareReplay(1));
      this._fileCache.set(url, stream);
    }

    // The `take(1)` is necessary, because the Promise from `toPromise` resolves on complete.
    return stream.pipe(take(1)).toPromise().then(
      response => this._addFileToForm(form, data, response, filename, path, isTest, prependApp),
      error => console.log(error)
    );
  }

  _addFileToForm(form: HTMLFormElement,
                 data: ExampleData,
                 content: string,
                 filename: string,
                 path: string,
                 isTest: boolean,
                 prependApp = true) {
    // if (path === (isTest ? TEST_TEMPLATE_PATH : TEMPLATE_PATH)) {
    if (path === TEMPLATE_PATH) {
      content = this._replaceExamplePlaceholders(data, filename, content, isTest);
    } else if (prependApp) {
      filename = 'src/app/' + filename;
    }
    this._appendFormInput(form, `files[${filename}]`, this._appendCopyright(filename, content));
  }

  /** Opens a new WebContainer-based StackBlitz for the given files. */
  private _openStackBlitz({
    title,
    description,
    openFile,
    files,
  }: {
    title: string;
    description: string;
    openFile: string;
    files: FileDictionary;
  }): void {
    stackblitz.openProject(
      {
        title,
        files,
        description,
        template: PROJECT_TEMPLATE,
        tags: PROJECT_TAGS,
      },
      {openFile}
    );
  }

  /**
   * Builds an in-memory file dictionary representing an CLI project serving
   * the example. The dictionary can then be passed to StackBlitz as project files.
   */
  private async _buildInMemoryFileDictionary(
    data: ExampleData,
    exampleId: string,
    isTest: boolean
  ): Promise<FileDictionary> {
    const result: FileDictionary = {};
    const tasks: Promise<unknown>[] = [];
    const liveExample = EXAMPLE_COMPONENTS[exampleId];
    const exampleBaseContentPath =
      `${DOCS_CONTENT_PATH}/${liveExample.module.importSpecifier}/${exampleId}/`;

    for (const relativeFilePath of TEMPLATE_FILES) {
      tasks.push(
        this._loadFile(TEMPLATE_PATH + relativeFilePath)
          // Replace example placeholders in the template files.
          .then(content =>
            this._replaceExamplePlaceholders(data, relativeFilePath, content, isTest)
          )
          .then(content => (result[relativeFilePath] = content))
      );
    }

    for (const relativeFilePath of data.exampleFiles) {
      // Note: Since we join with paths from the example data, we normalize
      // the final target path. This is necessary because StackBlitz does
      // not and paths like `./bla.ts` would result in a directory called `.`.
      const targetPath = normalizePath(`src/app/${relativeFilePath}`);

      tasks.push(
        this._loadFile(exampleBaseContentPath + relativeFilePath)
          // Insert a copyright footer for all example files inserted into the project.
          .then(content => this._appendCopyright(relativeFilePath, content))
          .then(content => (result[targetPath] = content))
      );
    }

    // Wait for the file dictionary to be populated. All file requests are
    // triggered concurrently to speed up the example StackBlitz generation.
    await Promise.all(tasks);

    return result;
  }

  /**
   * Loads the specified file and returns a promise resolving to its contents.
   */
  private _loadFile(fileUrl: string): Promise<string> {
    let stream = this._fileCache.get(fileUrl);

    if (!stream) {
      stream = this._http.get(fileUrl, {responseType: 'text'}).pipe(shareReplay(1));
      this._fileCache.set(fileUrl, stream);
    }

    // The `take(1)` is necessary, because the Promise from `toPromise` resolves on complete.
    return stream.pipe(take(1)).toPromise();
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
