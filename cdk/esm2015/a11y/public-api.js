/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export * from './aria-describer/aria-describer';
export * from './key-manager/activedescendant-key-manager';
export * from './key-manager/focus-key-manager';
export * from './key-manager/list-key-manager';
export * from './focus-trap/configurable-focus-trap';
export * from './focus-trap/configurable-focus-trap-config';
export * from './focus-trap/configurable-focus-trap-factory';
export * from './focus-trap/event-listener-inert-strategy';
export * from './focus-trap/focus-trap';
export * from './focus-trap/focus-trap-inert-strategy';
export * from './interactivity-checker/interactivity-checker';
export * from './live-announcer/live-announcer';
export * from './live-announcer/live-announcer-tokens';
export * from './focus-monitor/focus-monitor';
export * from './fake-event-detection';
export * from './a11y-module';
export { HighContrastModeDetector, } from './high-contrast-mode/high-contrast-mode-detector';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvYTExeS9wdWJsaWMtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILGNBQWMsaUNBQWlDLENBQUM7QUFDaEQsY0FBYyw0Q0FBNEMsQ0FBQztBQUMzRCxjQUFjLGlDQUFpQyxDQUFDO0FBQ2hELGNBQWMsZ0NBQWdDLENBQUM7QUFDL0MsY0FBYyxzQ0FBc0MsQ0FBQztBQUNyRCxjQUFjLDZDQUE2QyxDQUFDO0FBQzVELGNBQWMsOENBQThDLENBQUM7QUFDN0QsY0FBYyw0Q0FBNEMsQ0FBQztBQUMzRCxjQUFjLHlCQUF5QixDQUFDO0FBQ3hDLGNBQWMsd0NBQXdDLENBQUM7QUFDdkQsY0FBYywrQ0FBK0MsQ0FBQztBQUM5RCxjQUFjLGlDQUFpQyxDQUFDO0FBQ2hELGNBQWMsd0NBQXdDLENBQUM7QUFDdkQsY0FBYywrQkFBK0IsQ0FBQztBQUM5QyxjQUFjLHdCQUF3QixDQUFDO0FBQ3ZDLGNBQWMsZUFBZSxDQUFDO0FBQzlCLE9BQU8sRUFDTCx3QkFBd0IsR0FFekIsTUFBTSxrREFBa0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuZXhwb3J0ICogZnJvbSAnLi9hcmlhLWRlc2NyaWJlci9hcmlhLWRlc2NyaWJlcic7XG5leHBvcnQgKiBmcm9tICcuL2tleS1tYW5hZ2VyL2FjdGl2ZWRlc2NlbmRhbnQta2V5LW1hbmFnZXInO1xuZXhwb3J0ICogZnJvbSAnLi9rZXktbWFuYWdlci9mb2N1cy1rZXktbWFuYWdlcic7XG5leHBvcnQgKiBmcm9tICcuL2tleS1tYW5hZ2VyL2xpc3Qta2V5LW1hbmFnZXInO1xuZXhwb3J0ICogZnJvbSAnLi9mb2N1cy10cmFwL2NvbmZpZ3VyYWJsZS1mb2N1cy10cmFwJztcbmV4cG9ydCAqIGZyb20gJy4vZm9jdXMtdHJhcC9jb25maWd1cmFibGUtZm9jdXMtdHJhcC1jb25maWcnO1xuZXhwb3J0ICogZnJvbSAnLi9mb2N1cy10cmFwL2NvbmZpZ3VyYWJsZS1mb2N1cy10cmFwLWZhY3RvcnknO1xuZXhwb3J0ICogZnJvbSAnLi9mb2N1cy10cmFwL2V2ZW50LWxpc3RlbmVyLWluZXJ0LXN0cmF0ZWd5JztcbmV4cG9ydCAqIGZyb20gJy4vZm9jdXMtdHJhcC9mb2N1cy10cmFwJztcbmV4cG9ydCAqIGZyb20gJy4vZm9jdXMtdHJhcC9mb2N1cy10cmFwLWluZXJ0LXN0cmF0ZWd5JztcbmV4cG9ydCAqIGZyb20gJy4vaW50ZXJhY3Rpdml0eS1jaGVja2VyL2ludGVyYWN0aXZpdHktY2hlY2tlcic7XG5leHBvcnQgKiBmcm9tICcuL2xpdmUtYW5ub3VuY2VyL2xpdmUtYW5ub3VuY2VyJztcbmV4cG9ydCAqIGZyb20gJy4vbGl2ZS1hbm5vdW5jZXIvbGl2ZS1hbm5vdW5jZXItdG9rZW5zJztcbmV4cG9ydCAqIGZyb20gJy4vZm9jdXMtbW9uaXRvci9mb2N1cy1tb25pdG9yJztcbmV4cG9ydCAqIGZyb20gJy4vZmFrZS1ldmVudC1kZXRlY3Rpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9hMTF5LW1vZHVsZSc7XG5leHBvcnQge1xuICBIaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3IsXG4gIEhpZ2hDb250cmFzdE1vZGUsXG59IGZyb20gJy4vaGlnaC1jb250cmFzdC1tb2RlL2hpZ2gtY29udHJhc3QtbW9kZS1kZXRlY3Rvcic7XG4iXX0=