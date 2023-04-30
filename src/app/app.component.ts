import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js';
import * as ChartZoom from 'chartjs-plugin-zoom';

function registerChartComponents() {
  Chart.register(CategoryScale);
  Chart.register(LinearScale);
  Chart.register(BarController);
  Chart.register(BarElement);
  Chart.register(LineController);
  Chart.register(LineElement);
  Chart.register(PointElement);
}

registerChartComponents();

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  canvas: any;
  ctx: any;
  @ViewChild('mychart') mychart;
  usageData = [];
  constructor() {}

  ngAfterViewInit() {
    this.canvas = this.mychart.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    const data = [
      10, 45, 45, 45, 70, 0, 60, 55, 50, 45, 40, 0, 30, 40, 50, 55, 60, 0, 70,
      80,
    ];

    // const labels = [
    //   "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
    //   "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    //   "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
    // ];
    const labels = [];

    let start = 0;
    let end = 0;
    let inSession = false;
    let currentLabel = '';

    // for (let i = 0; i < 24; i++) {
    //   const hour = i.toString().padStart(2, '0');
    //   for (let j = 0; j < 60; j += 15) {
    //     const minute = j.toString().padStart(2, '0');
    //     const time = `${hour}:${minute}`;
    //     const dataIndex = i * 4 + j / 15;
    //     if (data[dataIndex] > 0) {
    //       if (currentLabel !== '') {
    //         labels.push(currentLabel);
    //         currentLabel = '';
    //       }
    //       labels.push(time);
    //     } else if (currentLabel === '') {
    //       currentLabel = time;
    //     }
    //   }
    // }
    // if (currentLabel !== '') {
    //   labels.push(currentLabel);
    // }

    for (let i = 0; i < 24; i++) {
      if (data[i] > 0) {
        if (!inSession) {
          start = i;
          inSession = true;
        }
        end = i;
      } else {
        if (inSession) {
          labels.push(
            `${start.toString().padStart(2, '0')}:00-${end
              .toString()
              .padStart(2, '0')}:59`
          );
          start = end + 1;
          inSession = false;
        } else {
          labels.push('');
        }
      }
    }
    if (inSession) {
      labels.push(
        `${start.toString().padStart(2, '0')}:00-${end
          .toString()
          .padStart(2, '0')}:59`
      );
    } else {
      labels.push('');
    }

    // for (let i = 0; i < 24 * 4; i++) {
    //   const hour = Math.floor(i / 4);
    //   const minute = (i % 4) * 15;
    //   const label = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    //   if (data[hour] > 0) {
    //     if (!inSession) {
    //       start = i;
    //       inSession = true;
    //     }
    //     end = i;
    //   } else {
    //     if (inSession) {
    //       labels.push(`${label}-${labels[end]}`);
    //       start = end + 1;
    //       inSession = false;
    //     } else {
    //       labels.push('');
    //     }
    //   }
    // }
    // if (inSession) {
    //   labels.push(`${labels[start]}-23:59`);
    // } else {
    //   labels.push('');
    // }

    let myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Data Usage (MB)',
            data: data,
            borderColor: '#36A2EB',
            backgroundColor: '#9BD0F5',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                if (labels[index]) {
                  const timeLabel = labels[index];
                  const sessionStart = `${timeLabel.split('-')[0]}:00`;
                  const sessionEnd = `${timeLabel.split('-')[1]}:59`;
                  return `Session Start: ${sessionStart}\nSession End: ${sessionEnd}`;
                } else {
                  return '';
                }
              },
              label: (tooltipItem) => {
                const dataUsage = tooltipItem.formattedValue;
                return `Data Usage: ${dataUsage} MB`;
              },
            },
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
              sensitivity: 3,
              speed: 0.1,
            },
            pan: {
              enabled: true,
              mode: 'x',
              threshold: 10,
            },
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Data (MB)',
            },
            beginAtZero: true,
          },
          x: {
            title: {
              display: true,
              text: 'Time (24h)',
            },
          },
        },
      },
    });
  }
}
