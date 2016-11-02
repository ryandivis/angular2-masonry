import {
    Directive,
    Inject,
    ElementRef,
    forwardRef,
    OnDestroy,
    AfterViewInit,
    Input
} from '@angular/core';

import { AngularMasonry } from './masonry';

@Directive({
    selector: '[masonry-brick], masonry-brick'
})
export class AngularMasonryBrick implements OnDestroy, AfterViewInit {

    @Input() prepend: boolean = false;

    constructor(
        private _element: ElementRef,
        @Inject(forwardRef(() => AngularMasonry)) private _parent: AngularMasonry
    ) { }

    ngAfterViewInit() {
        if (this.prepend) {
            this._parent.prepend(this._element.nativeElement);
        } else {
            this._parent.add(this._element.nativeElement);
        }
    }

    ngOnDestroy() {
        this._parent.remove(this._element.nativeElement);
    }
}
