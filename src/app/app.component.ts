import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav'
import { SidebarComponent } from "./components/skeleton/sidebar/sidebar.component";
import { HeaderComponent } from "./components/skeleton/header/header.component";
import { SidebarService } from './services/sidebar.service';
import { FooterComponent } from "./components/skeleton/footer/footer.component";
import { TestComponent } from "./components/test/test.component";
import { BarChartComponent } from "./components/bar-chart/bar-chart.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule,
       SidebarComponent, HeaderComponent, FooterComponent, TestComponent, BarChartComponent]
})
export class AppComponent {
  title = 'mat-skeleton';
  @ViewChild('drawer') drawer: any;
  constructor(sidebarService: SidebarService) {
    this.drawer = sidebarService;
    this.drawer.isOpen = true;
    sidebarService.emitter.subscribe(isOpen => {
      if (this.drawer) {
        this.drawer.toggle();
      }
    });
  }


}
