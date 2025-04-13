import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytesConverter'
})
export class BytesConverterPipe implements PipeTransform {
  transform(bytes: number, precision: number = 2): string {
    if (!bytes || bytes === 0) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let index = 0;

    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index++;
    }

    return `${value.toFixed(precision)} ${units[index]}`;
  }
}