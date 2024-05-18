import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
//ngFor
import { NgFor } from '@angular/common';
interface HiveData {
  account_name: string;
  curation_rewards_hp: number;
  date: string;
  id: number;
}


@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgFor],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnInit {

  @ViewChild('canvas')
  canvas!: ElementRef;
  data: HiveData[] | undefined;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.fetchDataAndDrawChart();
  }

  fetchDataAndDrawChart(): void {
    const apiUrl = 'https://imridd.eu.pythonanywhere.com/api/hive_cur';

    this.apiService.get(apiUrl).then((data: HiveData[]) => {
      this.drawChart(data);
    });
  }

  calculateHeight(value: number): number {
    const maxValue = this.data ? Math.max(...this.data.map(item => item.curation_rewards_hp)) : 0;
    return (value / maxValue) * 100;
  }

  drawChart(data: HiveData[]): void {

    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / data.length;

    this.data = data;

    data.reverse().forEach((item, index) => {

      const barHeight = this.calculateHeight(item.curation_rewards_hp);
      const y = height - barHeight;

      ctx.fillStyle = 'blue';
      const spaziatura = index === 0 || index === data.length ? 0 : 10;
      const widthBar = barWidth - 10;
      ctx.fillRect(index * barWidth + spaziatura, y, widthBar, barHeight);
      //scriviamo il giorno della settimana
      ctx.fillStyle = 'black';
      ctx.font = '10px Arial';
      ctx.fillText(item.date, index * barWidth + 5, height - 5);

//scriviamo il giorno della settimana 
      ctx.fillStyle = 'black';
      ctx.font = '10px Arial';
      ctx.fillText(item.date, index * barWidth + 5, height - 5);
    });

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width, height);
    ctx.stroke();


  }

}

