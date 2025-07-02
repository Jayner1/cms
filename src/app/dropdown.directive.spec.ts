import { ElementRef } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';

describe('DropdownDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = { nativeElement: document.createElement('div') } as ElementRef;
    const mockRenderer2 = jasmine.createSpyObj('Renderer2', [
      'addClass', 'removeClass', 'setStyle', 'removeStyle', 'setAttribute', 'removeAttribute', 'listen', 'selectRootElement', 'createElement', 'createComment', 'createText', 'appendChild', 'insertBefore', 'removeChild', 'parentNode', 'nextSibling'
    ]);
    const directive = new DropdownDirective(mockElementRef, mockRenderer2);
    expect(directive).toBeTruthy();
  });
});
