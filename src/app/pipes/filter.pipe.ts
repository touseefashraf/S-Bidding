import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
    name: 'filter',
    pure: false
})
@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchString: string): any[] {
        if (!items) {
            return []
        }
        if (!searchString) {
            return items
        }

        searchString = searchString.toLowerCase()

        return items.filter( (item: object) => {
            let result = false
            Object.keys(item).forEach(key => {
                const value = item[key] ? item[key] : ''
                console.log('key', key, item[key], value.toString(), item)
                if ( value.toString().toLowerCase().includes(searchString) ) {
                    result = true
                }
            })

            return result
        })
    }
}