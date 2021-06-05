/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessEnvironment } from '@angular/cdk/testing';
import * as webdriver from 'selenium-webdriver';
import { SeleniumWebDriverElement } from './selenium-web-driver-element';
/** The default environment options. */
const defaultEnvironmentOptions = {
    queryFn: (selector, root) => __awaiter(void 0, void 0, void 0, function* () { return root().findElements(webdriver.By.css(selector)); })
};
/**
 * This function is meant to be executed in the browser. It taps into the hooks exposed by Angular
 * and invokes the specified `callback` when the application is stable (no more pending tasks).
 */
function whenStable(callback) {
    Promise.all(window.frameworkStabilizers.map(stabilizer => new Promise(stabilizer)))
        .then(callback);
}
/**
 * This function is meant to be executed in the browser. It checks whether the Angular framework has
 * bootstrapped yet.
 */
function isBootstrapped() {
    return !!window.frameworkStabilizers;
}
/** Waits for angular to be ready after the page load. */
export function waitForAngularReady(wd) {
    return __awaiter(this, void 0, void 0, function* () {
        yield wd.wait(() => wd.executeScript(isBootstrapped));
        yield wd.executeAsyncScript(whenStable);
    });
}
/** A `HarnessEnvironment` implementation for WebDriver. */
export class SeleniumWebDriverHarnessEnvironment extends HarnessEnvironment {
    constructor(rawRootElement, options) {
        super(rawRootElement);
        this._options = Object.assign(Object.assign({}, defaultEnvironmentOptions), options);
    }
    /** Gets the ElementFinder corresponding to the given TestElement. */
    static getNativeElement(el) {
        if (el instanceof SeleniumWebDriverElement) {
            return el.element();
        }
        throw Error('This TestElement was not created by the WebDriverHarnessEnvironment');
    }
    /** Creates a `HarnessLoader` rooted at the document root. */
    static loader(driver, options) {
        return new SeleniumWebDriverHarnessEnvironment(() => driver.findElement(webdriver.By.css('body')), options);
    }
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    forceStabilize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rawRootElement().getDriver().executeAsyncScript(whenStable);
        });
    }
    /** @docs-private */
    waitForTasksOutsideAngular() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: figure out how we can do this for the webdriver environment.
            //  https://github.com/angular/components/issues/17412
        });
    }
    /** Gets the root element for the document. */
    getDocumentRoot() {
        return () => this.rawRootElement().getDriver().findElement(webdriver.By.css('body'));
    }
    /** Creates a `TestElement` from a raw element. */
    createTestElement(element) {
        return new SeleniumWebDriverElement(element, () => this.forceStabilize());
    }
    /** Creates a `HarnessLoader` rooted at the given raw element. */
    createEnvironment(element) {
        return new SeleniumWebDriverHarnessEnvironment(element, this._options);
    }
    // Note: This seems to be working, though we may need to re-evaluate if we encounter issues with
    // stale element references. `() => Promise<webdriver.WebElement[]>` seems like a more correct
    // return type, though supporting it would require changes to the public harness API.
    /**
     * Gets a list of all elements matching the given selector under this environment's root element.
     */
    getAllRawElements(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            const els = yield this._options.queryFn(selector, this.rawRootElement);
            return els.map((x) => () => x);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZW5pdW0td2ViLWRyaXZlci1oYXJuZXNzLWVudmlyb25tZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90ZXN0aW5nL3NlbGVuaXVtLXdlYmRyaXZlci9zZWxlbml1bS13ZWItZHJpdmVyLWhhcm5lc3MtZW52aXJvbm1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxrQkFBa0IsRUFBNkIsTUFBTSxzQkFBc0IsQ0FBQztBQUNwRixPQUFPLEtBQUssU0FBUyxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBNkJ2RSx1Q0FBdUM7QUFDdkMsTUFBTSx5QkFBeUIsR0FBdUM7SUFDcEUsT0FBTyxFQUFFLENBQU8sUUFBZ0IsRUFBRSxJQUFnQyxFQUFFLEVBQUUsa0RBQ2xFLE9BQUEsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUEsR0FBQTtDQUNwRCxDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBUyxVQUFVLENBQUMsUUFBc0M7SUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUM5RSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMsY0FBYztJQUNyQixPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUM7QUFDdkMsQ0FBQztBQUVELHlEQUF5RDtBQUN6RCxNQUFNLFVBQWdCLG1CQUFtQixDQUFDLEVBQXVCOztRQUMvRCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sRUFBRSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FBQTtBQUVELDJEQUEyRDtBQUMzRCxNQUFNLE9BQU8sbUNBQW9DLFNBQzdDLGtCQUE4QztJQUloRCxZQUNJLGNBQTBDLEVBQUUsT0FBNEM7UUFDMUYsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLG1DQUFPLHlCQUF5QixHQUFLLE9BQU8sQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxxRUFBcUU7SUFDckUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQWU7UUFDckMsSUFBSSxFQUFFLFlBQVksd0JBQXdCLEVBQUU7WUFDMUMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDckI7UUFDRCxNQUFNLEtBQUssQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCw2REFBNkQ7SUFDN0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUEyQixFQUFFLE9BQTRDO1FBRXJGLE9BQU8sSUFBSSxtQ0FBbUMsQ0FDMUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7OztPQUlHO0lBQ0csY0FBYzs7WUFDbEIsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekUsQ0FBQztLQUFBO0lBRUQsb0JBQW9CO0lBQ2QsMEJBQTBCOztZQUM5QixxRUFBcUU7WUFDckUsc0RBQXNEO1FBQ3hELENBQUM7S0FBQTtJQUVELDhDQUE4QztJQUNwQyxlQUFlO1FBQ3ZCLE9BQU8sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxrREFBa0Q7SUFDeEMsaUJBQWlCLENBQUMsT0FBbUM7UUFDN0QsT0FBTyxJQUFJLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsaUVBQWlFO0lBQ3ZELGlCQUFpQixDQUFDLE9BQW1DO1FBRTdELE9BQU8sSUFBSSxtQ0FBbUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxnR0FBZ0c7SUFDaEcsOEZBQThGO0lBQzlGLHFGQUFxRjtJQUNyRjs7T0FFRztJQUNhLGlCQUFpQixDQUFDLFFBQWdCOztZQUNoRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDdkUsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBdUIsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQztLQUFBO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzRW52aXJvbm1lbnQsIEhhcm5lc3NMb2FkZXIsIFRlc3RFbGVtZW50fSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQgKiBhcyB3ZWJkcml2ZXIgZnJvbSAnc2VsZW5pdW0td2ViZHJpdmVyJztcbmltcG9ydCB7U2VsZW5pdW1XZWJEcml2ZXJFbGVtZW50fSBmcm9tICcuL3NlbGVuaXVtLXdlYi1kcml2ZXItZWxlbWVudCc7XG5cbi8qKlxuICogQW4gQW5ndWxhciBmcmFtZXdvcmsgc3RhYmlsaXplciBmdW5jdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2sgYW5kIGNhbGxzIGl0IHdoZW4gdGhlIGFwcGxpY2F0aW9uXG4gKiBpcyBzdGFibGUsIHBhc3NpbmcgYSBib29sZWFuIGluZGljYXRpbmcgaWYgYW55IHdvcmsgd2FzIGRvbmUuXG4gKi9cbmRlY2xhcmUgaW50ZXJmYWNlIEZyYW1ld29ya1N0YWJpbGl6ZXIge1xuICAoY2FsbGJhY2s6IChkaWRXb3JrOiBib29sZWFuKSA9PiB2b2lkKTogdm9pZDtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAvKipcbiAgICAgKiBUaGVzZSBob29rcyBhcmUgZXhwb3NlZCBieSBBbmd1bGFyIHRvIHJlZ2lzdGVyIGEgY2FsbGJhY2sgZm9yIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIHN0YWJsZVxuICAgICAqIChubyBtb3JlIHBlbmRpbmcgdGFza3MpLlxuICAgICAqXG4gICAgICogRm9yIHRoZSBpbXBsZW1lbnRhdGlvbiwgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vXG4gICAgICogIGFuZ3VsYXIvYW5ndWxhci9ibG9iL21hc3Rlci9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL3Rlc3RhYmlsaXR5LnRzI0wzMC1MNDlcbiAgICAgKi9cbiAgICBmcmFtZXdvcmtTdGFiaWxpemVyczogRnJhbWV3b3JrU3RhYmlsaXplcltdO1xuICB9XG59XG5cbi8qKiBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgZW52aXJvbm1lbnQuICovXG5leHBvcnQgaW50ZXJmYWNlIFdlYkRyaXZlckhhcm5lc3NFbnZpcm9ubWVudE9wdGlvbnMge1xuICAvKiogVGhlIHF1ZXJ5IGZ1bmN0aW9uIHVzZWQgdG8gZmluZCBET00gZWxlbWVudHMuICovXG4gIHF1ZXJ5Rm46IChzZWxlY3Rvcjogc3RyaW5nLCByb290OiAoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudCkgPT4gUHJvbWlzZTx3ZWJkcml2ZXIuV2ViRWxlbWVudFtdPjtcbn1cblxuLyoqIFRoZSBkZWZhdWx0IGVudmlyb25tZW50IG9wdGlvbnMuICovXG5jb25zdCBkZWZhdWx0RW52aXJvbm1lbnRPcHRpb25zOiBXZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnRPcHRpb25zID0ge1xuICBxdWVyeUZuOiBhc3luYyAoc2VsZWN0b3I6IHN0cmluZywgcm9vdDogKCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQpID0+XG4gICAgICByb290KCkuZmluZEVsZW1lbnRzKHdlYmRyaXZlci5CeS5jc3Moc2VsZWN0b3IpKVxufTtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIG1lYW50IHRvIGJlIGV4ZWN1dGVkIGluIHRoZSBicm93c2VyLiBJdCB0YXBzIGludG8gdGhlIGhvb2tzIGV4cG9zZWQgYnkgQW5ndWxhclxuICogYW5kIGludm9rZXMgdGhlIHNwZWNpZmllZCBgY2FsbGJhY2tgIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIHN0YWJsZSAobm8gbW9yZSBwZW5kaW5nIHRhc2tzKS5cbiAqL1xuZnVuY3Rpb24gd2hlblN0YWJsZShjYWxsYmFjazogKGRpZFdvcms6IGJvb2xlYW5bXSkgPT4gdm9pZCk6IHZvaWQge1xuICBQcm9taXNlLmFsbCh3aW5kb3cuZnJhbWV3b3JrU3RhYmlsaXplcnMubWFwKHN0YWJpbGl6ZXIgPT4gbmV3IFByb21pc2Uoc3RhYmlsaXplcikpKVxuICAgICAgLnRoZW4oY2FsbGJhY2spO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgZXhlY3V0ZWQgaW4gdGhlIGJyb3dzZXIuIEl0IGNoZWNrcyB3aGV0aGVyIHRoZSBBbmd1bGFyIGZyYW1ld29yayBoYXNcbiAqIGJvb3RzdHJhcHBlZCB5ZXQuXG4gKi9cbmZ1bmN0aW9uIGlzQm9vdHN0cmFwcGVkKCkge1xuICByZXR1cm4gISF3aW5kb3cuZnJhbWV3b3JrU3RhYmlsaXplcnM7XG59XG5cbi8qKiBXYWl0cyBmb3IgYW5ndWxhciB0byBiZSByZWFkeSBhZnRlciB0aGUgcGFnZSBsb2FkLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JBbmd1bGFyUmVhZHkod2Q6IHdlYmRyaXZlci5XZWJEcml2ZXIpIHtcbiAgYXdhaXQgd2Qud2FpdCgoKSA9PiB3ZC5leGVjdXRlU2NyaXB0KGlzQm9vdHN0cmFwcGVkKSk7XG4gIGF3YWl0IHdkLmV4ZWN1dGVBc3luY1NjcmlwdCh3aGVuU3RhYmxlKTtcbn1cblxuLyoqIEEgYEhhcm5lc3NFbnZpcm9ubWVudGAgaW1wbGVtZW50YXRpb24gZm9yIFdlYkRyaXZlci4gKi9cbmV4cG9ydCBjbGFzcyBTZWxlbml1bVdlYkRyaXZlckhhcm5lc3NFbnZpcm9ubWVudCBleHRlbmRzXG4gICAgSGFybmVzc0Vudmlyb25tZW50PCgpID0+IHdlYmRyaXZlci5XZWJFbGVtZW50PiB7XG4gIC8qKiBUaGUgb3B0aW9ucyBmb3IgdGhpcyBlbnZpcm9ubWVudC4gKi9cbiAgcHJpdmF0ZSBfb3B0aW9uczogV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50T3B0aW9ucztcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoXG4gICAgICByYXdSb290RWxlbWVudDogKCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQsIG9wdGlvbnM/OiBXZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnRPcHRpb25zKSB7XG4gICAgc3VwZXIocmF3Um9vdEVsZW1lbnQpO1xuICAgIHRoaXMuX29wdGlvbnMgPSB7Li4uZGVmYXVsdEVudmlyb25tZW50T3B0aW9ucywgLi4ub3B0aW9uc307XG4gIH1cblxuICAvKiogR2V0cyB0aGUgRWxlbWVudEZpbmRlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlbiBUZXN0RWxlbWVudC4gKi9cbiAgc3RhdGljIGdldE5hdGl2ZUVsZW1lbnQoZWw6IFRlc3RFbGVtZW50KTogd2ViZHJpdmVyLldlYkVsZW1lbnQge1xuICAgIGlmIChlbCBpbnN0YW5jZW9mIFNlbGVuaXVtV2ViRHJpdmVyRWxlbWVudCkge1xuICAgICAgcmV0dXJuIGVsLmVsZW1lbnQoKTtcbiAgICB9XG4gICAgdGhyb3cgRXJyb3IoJ1RoaXMgVGVzdEVsZW1lbnQgd2FzIG5vdCBjcmVhdGVkIGJ5IHRoZSBXZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnQnKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgYEhhcm5lc3NMb2FkZXJgIHJvb3RlZCBhdCB0aGUgZG9jdW1lbnQgcm9vdC4gKi9cbiAgc3RhdGljIGxvYWRlcihkcml2ZXI6IHdlYmRyaXZlci5XZWJEcml2ZXIsIG9wdGlvbnM/OiBXZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnRPcHRpb25zKTpcbiAgICAgIEhhcm5lc3NMb2FkZXIge1xuICAgIHJldHVybiBuZXcgU2VsZW5pdW1XZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnQoXG4gICAgICAgICgpID0+IGRyaXZlci5maW5kRWxlbWVudCh3ZWJkcml2ZXIuQnkuY3NzKCdib2R5JykpLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbHVzaGVzIGNoYW5nZSBkZXRlY3Rpb24gYW5kIGFzeW5jIHRhc2tzIGNhcHR1cmVkIGluIHRoZSBBbmd1bGFyIHpvbmUuXG4gICAqIEluIG1vc3QgY2FzZXMgaXQgc2hvdWxkIG5vdCBiZSBuZWNlc3NhcnkgdG8gY2FsbCB0aGlzIG1hbnVhbGx5LiBIb3dldmVyLCB0aGVyZSBtYXkgYmUgc29tZSBlZGdlXG4gICAqIGNhc2VzIHdoZXJlIGl0IGlzIG5lZWRlZCB0byBmdWxseSBmbHVzaCBhbmltYXRpb24gZXZlbnRzLlxuICAgKi9cbiAgYXN5bmMgZm9yY2VTdGFiaWxpemUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5yYXdSb290RWxlbWVudCgpLmdldERyaXZlcigpLmV4ZWN1dGVBc3luY1NjcmlwdCh3aGVuU3RhYmxlKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGFzeW5jIHdhaXRGb3JUYXNrc091dHNpZGVBbmd1bGFyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIFRPRE86IGZpZ3VyZSBvdXQgaG93IHdlIGNhbiBkbyB0aGlzIGZvciB0aGUgd2ViZHJpdmVyIGVudmlyb25tZW50LlxuICAgIC8vICBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNzQxMlxuICB9XG5cbiAgLyoqIEdldHMgdGhlIHJvb3QgZWxlbWVudCBmb3IgdGhlIGRvY3VtZW50LiAqL1xuICBwcm90ZWN0ZWQgZ2V0RG9jdW1lbnRSb290KCk6ICgpID0+IHdlYmRyaXZlci5XZWJFbGVtZW50IHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5yYXdSb290RWxlbWVudCgpLmdldERyaXZlcigpLmZpbmRFbGVtZW50KHdlYmRyaXZlci5CeS5jc3MoJ2JvZHknKSk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGBUZXN0RWxlbWVudGAgZnJvbSBhIHJhdyBlbGVtZW50LiAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlVGVzdEVsZW1lbnQoZWxlbWVudDogKCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQpOiBUZXN0RWxlbWVudCB7XG4gICAgcmV0dXJuIG5ldyBTZWxlbml1bVdlYkRyaXZlckVsZW1lbnQoZWxlbWVudCwgKCkgPT4gdGhpcy5mb3JjZVN0YWJpbGl6ZSgpKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgYEhhcm5lc3NMb2FkZXJgIHJvb3RlZCBhdCB0aGUgZ2l2ZW4gcmF3IGVsZW1lbnQuICovXG4gIHByb3RlY3RlZCBjcmVhdGVFbnZpcm9ubWVudChlbGVtZW50OiAoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudCk6XG4gICAgICBIYXJuZXNzRW52aXJvbm1lbnQ8KCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQ+IHtcbiAgICByZXR1cm4gbmV3IFNlbGVuaXVtV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50KGVsZW1lbnQsIHRoaXMuX29wdGlvbnMpO1xuICB9XG5cbiAgLy8gTm90ZTogVGhpcyBzZWVtcyB0byBiZSB3b3JraW5nLCB0aG91Z2ggd2UgbWF5IG5lZWQgdG8gcmUtZXZhbHVhdGUgaWYgd2UgZW5jb3VudGVyIGlzc3VlcyB3aXRoXG4gIC8vIHN0YWxlIGVsZW1lbnQgcmVmZXJlbmNlcy4gYCgpID0+IFByb21pc2U8d2ViZHJpdmVyLldlYkVsZW1lbnRbXT5gIHNlZW1zIGxpa2UgYSBtb3JlIGNvcnJlY3RcbiAgLy8gcmV0dXJuIHR5cGUsIHRob3VnaCBzdXBwb3J0aW5nIGl0IHdvdWxkIHJlcXVpcmUgY2hhbmdlcyB0byB0aGUgcHVibGljIGhhcm5lc3MgQVBJLlxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBnaXZlbiBzZWxlY3RvciB1bmRlciB0aGlzIGVudmlyb25tZW50J3Mgcm9vdCBlbGVtZW50LlxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIGdldEFsbFJhd0VsZW1lbnRzKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPCgoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudClbXT4ge1xuICAgIGNvbnN0IGVscyA9IGF3YWl0IHRoaXMuX29wdGlvbnMucXVlcnlGbihzZWxlY3RvciwgdGhpcy5yYXdSb290RWxlbWVudCk7XG4gICAgcmV0dXJuIGVscy5tYXAoKHg6IHdlYmRyaXZlci5XZWJFbGVtZW50KSA9PiAoKSA9PiB4KTtcbiAgfVxufVxuIl19