///
/// Copyright © 2016-2023 The Thingsboard Authors
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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Color, ColorPickerControl } from '@iplab/ngx-color-picker';
import { Subscription } from 'rxjs';

export enum ColorType {
  hex = 'hex',
  hexa = 'hexa',
  rgba = 'rgba',
  rgb = 'rgb',
  hsla = 'hsla',
  hsl = 'hsl',
  cmyk = 'cmyk'
}

@Component({
  selector: `tb-color-picker`,
  templateUrl: `./color-picker.component.html`,
  styleUrls: [`./color-picker.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements OnInit, OnChanges, OnDestroy {

  public selectedPresentation = 0;
  public presentations = [ColorType.hex, ColorType.rgb, ColorType.rgba, ColorType.hsla, ColorType.hsl];

  @Input()
  public color: string;

  @Input()
  public control: ColorPickerControl;

  @Output()
  public colorChange: EventEmitter<string> = new EventEmitter(false);

  private subscriptions: Array<Subscription> = [];

  constructor(private readonly cdr: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    if (!this.control) {
      this.control = new ColorPickerControl();
    }

    if (this.control.initType === ColorType.hexa) {
      this.control.initType = ColorType.hex;
    }

    this.selectedPresentation = this.presentations.indexOf(this.control.initType);

    if (this.color) {
      this.control.setValueFrom(this.color);
    }

    this.subscriptions.push(
      this.control.valueChanges.subscribe((value) => {
        this.cdr.markForCheck();
        this.colorChange.emit(this.getValueByType(value, this.presentations[this.selectedPresentation]));
      })
    );
  }

  changeColorFormat(event: Event) {
    this.colorChange.emit(this.getValueByType(this.control.value, this.presentations[this.selectedPresentation]));
  }

  public ngOnDestroy(): void {
    this.cdr.detach();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.length = 0;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.color && this.control &&
      this.getValueByType(this.control.value, this.presentations[this.selectedPresentation]) !== this.color) {
      this.control.setValueFrom(this.color);
    }
  }

  public changePresentation(): void {
    this.selectedPresentation =
      this.selectedPresentation === this.presentations.length - 1 ? 0 : this.selectedPresentation + 1;
    this.colorChange.emit(this.getValueByType(this.control.value, this.presentations[this.selectedPresentation]));
    this.cdr.markForCheck();
  }

  getValueByType(color: Color, type: ColorType): string {
    switch (type) {
      case ColorType.hex || ColorType.hexa:
        return color.toHexString(this.control.value.getRgba().getAlpha() !== 1);
      case ColorType.rgb:
        return color.toRgbString();
      case ColorType.rgba:
        return color.toRgbaString();
      case ColorType.hsl:
        return color.toHslString();
      case ColorType.hsla:
        return color.toHslaString();
      default:
        return color.toRgbaString();
    }
  }

}