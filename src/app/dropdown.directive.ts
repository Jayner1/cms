import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]' 
})
export class DropdownDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event'])
  toggleDropdown(event: Event) {
    event.stopPropagation(); 

    const dropdown = this.el.nativeElement.querySelector('.dropdown-menu');
    if (dropdown) {
      const isVisible = dropdown.classList.contains('show');
      if (isVisible) {
        this.renderer.removeClass(dropdown, 'show');
      } else {
        this.renderer.addClass(dropdown, 'show');
      }
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const dropdown = this.el.nativeElement.querySelector('.dropdown-menu');
    const target = event.target as HTMLElement;

    if (dropdown && !this.el.nativeElement.contains(target)) {
      this.renderer.removeClass(dropdown, 'show');
    }
  }
}
