///
/// Copyright © 2016-2022 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Component, forwardRef, Input, OnInit, } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { PageLink } from '@shared/models/page/page-link';
import { map, share } from 'rxjs/operators';
import { PageData } from '@shared/models/page/page-data';
import { RuleChain, RuleChainType } from '@app/shared/models/rule-chain.models';
import { RuleChainService } from '@core/http/rule-chain.service';
import { TranslateService } from '@ngx-translate/core';

// @dynamic
@Component({
  selector: 'tb-rulechain-select',
  templateUrl: './rulechain-select.component.html',
  styleUrls: ['./rulechain-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RuleChainSelectComponent),
    multi: true
  }]
})
export class RuleChainSelectComponent implements ControlValueAccessor, OnInit {

  ruleChains$: Observable<Array<RuleChain>>;
  ruleChainId: string | null;

  @Input()
  disabled: boolean;

  @Input()
  ruleChainType: RuleChainType = RuleChainType.CORE;

  private propagateChange = (v: any) => { };

  constructor(private ruleChainService: RuleChainService,
              private translate: TranslateService) {}

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  ngOnInit() {
    const pageLink = new PageLink(100);
    this.ruleChains$ = this.getRuleChains(pageLink).pipe(
      map((pageData) => pageData.data),
      share()
    );
    this.disabled = false;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue(value: string | null): void {
    this.ruleChainId = value;
  }

  ruleChainIdChanged() {
    this.updateView();
  }

  private updateView() {
    this.propagateChange(this.ruleChainId);
  }

  private getRuleChains(pageLink: PageLink): Observable<PageData<RuleChain>> {
    return this.ruleChainService.getRuleChains(pageLink, this.ruleChainType, {ignoreLoading: true});
  }

}
