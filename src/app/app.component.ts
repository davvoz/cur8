import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
export class AppComponent implements OnInit{
  title = 'mat-skeleton';
  isMobile = false;
  @ViewChild('drawer') drawer: any;
  constructor(sidebarService: SidebarService,private router: Router) {
    this.drawer = sidebarService;
    this.drawer.isOpen = true;
    this.isMobile = window.innerWidth < 768;
    sidebarService.emitter.subscribe(isOpen => {
      if (this.drawer ) {
        this.drawer.toggle();
      }
    });
  }
  ngOnInit() {
    // Reindirizzamento alla route prestabilita
    this.router.navigate(['/start']); // Modifica con la tua route prestabilita
  }

}
