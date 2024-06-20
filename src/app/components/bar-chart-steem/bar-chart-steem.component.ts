import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
//ngFor
import { NgFor } from '@angular/common';
import { GlobalPropertiesHiveService } from '../../services/global-properties-hive.service';
import { HiveData, SteemData } from '../../interfaces/interfaces';
import { GlobalPropertiesSteemService } from '../../services/global-properties-steem.service';

@Component({
  selector: 'app-bar-chart-steem',
  standalone: true,
  imports: [NgFor],
  templateUrl: './bar-chart-steem.component.html',
  styleUrl: './bar-chart-steem.component.scss'
})
export class BarChartSteemComponent {

  @ViewChild('canvas')
  canvas!: ElementRef;
  data: SteemData[] | undefined;

  constructor(private apiService: ApiService, private globalProperties: GlobalPropertiesSteemService) { }
  ngAfterViewInit(): void {
    this.fetchDataAndDrawChart();
  }

  fetchDataAndDrawChart(): void {
    if (this.globalProperties.getDataChart().length === 0) { 
      console.log('fetching data');
      const apiUrl = 'https://imridd.eu.pythonanywhere.com/api/steem_cur';
      this.apiService.get(apiUrl).then((data: SteemData[]) => {
        this.drawChart(data);
        this.globalProperties.setDataChart(data);
      });
    } else {
      this.drawChart(this.globalProperties.getDataChart());
    }

  }

  calculateHeight(value: number): number {
    const maxValue = this.data ? Math.max(...this.data.map(item => item.curation_rewards_sp)) : 0;
    return (value / maxValue) * 100;
  }

  drawChart(data: SteemData[]): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    // Adjust canvas size to container
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / data.length;
  
    this.data = data;
  
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    //colora lo sfondo
    ctx.fillStyle = '#888';
    //disegna una griglia di sfondo per il grafico
    for (let i = 0; i < 10; i++) {
      ctx.fillRect(0, i * height / 10, width, 1);
    }

  
    data.forEach((item, index) => {
      const barHeight = this.calculateHeight(item.curation_rewards_sp);
      const y = height - barHeight;
  
      ctx.fillStyle = '#3f51b5';
      const spacing = 10;
      const widthBar = barWidth - spacing;
      ctx.fillRect(index * barWidth + spacing / 2, y, widthBar, barHeight);
  
      // Write the day of the week
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.fillText(item.date.substring(0, 8), index * barWidth + spacing / 2 + spacing, height - 5);
    });
  
    // Draw X and Y axes
     //gtiglio chiaro; 
     ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.stroke();
  
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
  
    // Handle window resize for responsiveness
    window.addEventListener('resize', () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      this.drawChart(data);
    });
  }
}
