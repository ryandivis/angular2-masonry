declare var require: any;
declare var imagesLoaded: any;

import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    ElementRef,
    EventEmitter,
} from '@angular/core';

// import * as masonry from 'masonry-layout';
var masonry = require('masonry-layout');

import { MasonryOptions } from './masonry-options';

@Component({
    selector: '[masonry], masonry',
    template: '<ng-content></ng-content>'
})
export class AngularMasonry implements OnInit, OnDestroy {

    constructor(
        private _element: ElementRef
    ) { }

    public _msnry: any;
    // private _imagesLoaded = null;

    // Inputs
    @Input() public options: MasonryOptions;
    @Input() public useImagesLoaded: Boolean = false;

    // Outputs
    @Output() layoutComplete: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() removeComplete: EventEmitter<any[]> = new EventEmitter<any[]>();

    ngOnInit() {
        ///TODO: How to load imagesloaded only if this.useImagesLoaded===true?
        // if (this.useImagesLoaded) {
        //     this._imagesLoaded = require('imagesloaded');
        // }

        // Create masonry options object
        if (!this.options) this.options = {};

        // Set default itemSelector
        if (!this.options.itemSelector) {
            this.options.itemSelector = '[masonry-brick], masonry-brick';
        }

        // Set element display to block
        if (this._element.nativeElement.tagName === 'MASONRY') {
            this._element.nativeElement.style.display = 'block';
        }

        // Initialize Masonry
        this._msnry = new masonry(this._element.nativeElement, this.options);


        imagesLoaded(this._element.nativeElement, (instance: any) => {

            setTimeout(() => this.layout(), 100);

        });

        // console.log('AngularMasonry:', 'Initialized');

        // Bind to events
        this._msnry.on('layoutComplete', (items: any) => {
            this.layoutComplete.emit(items);
        });
        this._msnry.on('removeComplete', (items: any) => {
            this.removeComplete.emit(items);
        });
    }

    ngOnDestroy() {
        if (this._msnry) {
            this._msnry.destroy();
        }
    }

    public layout() {
        setTimeout(() => {
            this._msnry.layout();
        });

        // console.log('AngularMasonry:', 'Layout');
    }

    public imagesLoadedLayout() {

        imagesLoaded(this._element.nativeElement, (instance: any) => {

            setTimeout(() => this.layout(), 100);

        });
    }

    // public add(element: HTMLElement, prepend: boolean = false) {
    public add(element: HTMLElement) {

        var isFirstItem = false;

        // Check if first item
        if (this._msnry.items.length === 0) {
            isFirstItem = true;
        }

        // Tell Masonry that a child element has been added
        this._msnry.appended(element);

        if (this.useImagesLoaded) {
            imagesLoaded(element, (instance: any) => {
                setTimeout(() => this.layout());
            });
        }

        // layout if first item
        // if (isFirstItem) this.layout();

        // console.log('AngularMasonry:', 'Brick added');
    }

    public prepend(element: HTMLElement) {

        // Tell Masonry that a child element has been added
        this._msnry.prepended(element);

        if (this.useImagesLoaded) {
            imagesLoaded(element, (instance: any) => {
                this._element.nativeElement.prepend(element);
                // Layout items
                this.layout();
            });

            // this._parent.add(el);
            this._element.nativeElement.removeChild(element);
        }
        else {
            // Layout items
            this.layout();
        }

        // console.log('AngularMasonry:', 'Brick added');
    };

    public remove(element: HTMLElement) {
        // Tell Masonry that a child element has been removed
        this._msnry.remove(element);

        // Layout items
        this.layout();

        // console.log('AngularMasonry:', 'Brick removed');
    }
}