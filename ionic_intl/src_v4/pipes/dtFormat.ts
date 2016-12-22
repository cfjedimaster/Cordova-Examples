import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dtFormat'})
export class dtFormatPipe implements PipeTransform {
  transform(value: Date): string {

    if(Intl) {
      return new Intl.DateTimeFormat().format(value) + ' ' + new Intl.DateTimeFormat(navigator.language, {hour:'numeric',minute:'2-digit'}).format(value);
    } else {
      return value.toString();
    }

  }
}