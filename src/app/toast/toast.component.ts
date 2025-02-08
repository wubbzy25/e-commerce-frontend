import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [NgClass, NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  @Input() Title: string = '';
  @Input() message: string = '';
  @Input() type: boolean = false;
  @Input() visible: boolean = true;
  time: number = 3000;

  closeToast() {
    this.visible = false;
  }
}
