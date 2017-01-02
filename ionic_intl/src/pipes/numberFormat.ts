import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'numberFormat'})
export class numberFormatPipe implements PipeTransform {
  transform(value: string): string {

    if(Intl) {
	  return new Intl.NumberFormat(navigator.language, {maximumFractionDigits:2}).format(Number(value));
    } else {
	  return value;
    }

  }
}