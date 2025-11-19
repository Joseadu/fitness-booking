import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from './shared/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Button],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
