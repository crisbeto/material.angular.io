import {Component, inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import {AsyncPipe, TitleCasePipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {combineLatest, Observable} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {ComponentViewer} from './component-viewer';
import {DocItem} from '../../shared/documentation-items/documentation-items';
import {TokenName} from './token-name';

interface Token {
  name: string;
  derivedFrom?: string;
}

interface TokenMap {
  totalTokens: number;
  base: Token[];
  color: Token[];
  typography: Token[];
  density: Token[];
}

@Injectable({providedIn: 'root'})
class TokenService {
  private _cache: Record<string, Observable<TokenMap>> = {};

  constructor(private _http: HttpClient) {}

  getTokens(item: DocItem): Observable<TokenMap> {
    const url = `/docs-content/tokens/${item.packageName}/${item.id}/${item.id}.json`;

    if (this._cache[url]) {
      return this._cache[url];
    }

    const stream = this._http.get<TokenMap>(url).pipe(shareReplay(1));
    return stream.pipe(tap(() => this._cache[url] = stream));
  }
}

// TODO: theme
// TODO: reorganize the files
// TODO: hover functionality for system tokens
@Component({
  selector: 'component-styling',
  templateUrl: './component-styling.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TitleCasePipe,
    TokenName,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  styles: `
    .token-table {
      table-layout: fixed;
    }

    .token-table thead {
      position: sticky;
      top: 0;
      left: 0;
      background: #fdfbff;
      z-index: 1;
    }

    .filters {
      display: flex;
      align-items: center;
      margin-top: 24px;
      width: 100%;
    }

    .filters mat-form-field {
      margin-right: 16px;
    }

    .name-field {
      width: 380px;
      max-width: 100%;
    }

    .type-header {
      width: 10%;
    }

    .system-header {
      width: 30%;
    }
  `
})
export class ComponentStyling {
  private componentViewer = inject(ComponentViewer);
  private tokenService = inject(TokenService);

  protected filters = new FormGroup({
    name: new FormControl(),
    type: new FormControl(),
  });

  protected docItem = this.componentViewer.componentDocItem.pipe(tap(() => this.filters.reset()));

  protected tokensStream = this.docItem.pipe(
    switchMap(item => this.tokenService.getTokens(item)),
    map(tokenMap => {
      const tokens: {type: string, name: string, derivedFrom: string | undefined}[] = [];

      for (const category of ['base', 'color', 'typography', 'density'] as const) {
        for (const token of tokenMap[category]) {
          tokens.push({type: category, name: token.name, derivedFrom: token.derivedFrom});
        }
      }

      return tokens;
    })
  );

  protected filteredTokensStream = combineLatest([this.filters.valueChanges, this.tokensStream])
    .pipe(map(([filters, tokens]) => {
      const name = filters.name?.toLowerCase();
      const type = filters.type;

      return tokens.filter(token => {
        const nameMatches = !name || token.name.toLowerCase().includes(name) ||
                            token.derivedFrom?.toLowerCase().includes(name);
        const categoryMatches = !type || token.type === type;
        return nameMatches && categoryMatches;
      });
    }));
}
