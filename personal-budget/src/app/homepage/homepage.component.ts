import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, ArcElement, CategoryScale, LinearScale, registerables } from 'chart.js';
import { ArticleComponent } from '../article/article.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { DataService } from '../data.service';
import * as d3 from 'd3';

Chart.register(ArcElement, CategoryScale, LinearScale, ...registerables);

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticleComponent, BreadcrumbsComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, AfterViewInit {
  public dataSource = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          '#CC0003',
          '#45818d',
          '#c90078',
          '#783f09',
          '#ffcd51',
          '#ff6383',
          '#36a2e0',
          '#fd6b19',
          '#f6b26f',
        ],
      },
    ],
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.budgetData$.subscribe((budgetData) => {
      if (budgetData.length) {
        for (let i = 0; i < budgetData.length; i++) {
          this.dataSource.datasets[0].data[i] = budgetData[i].budget;
          this.dataSource.labels[i] = budgetData[i].title;
        }
        this.createChart();
        this.createD3Chart(budgetData);
      }
    });

    this.dataService.fetchBudgetData();
  }

  ngAfterViewInit(): void {
  }

  createChart() {
    const chartElement = document.getElementById('myChart') as HTMLCanvasElement | null;

    if (chartElement) {
      const ctx = chartElement.getContext('2d');

      if (ctx) {
        const myPieChart = new Chart(ctx, {
          type: 'pie',
          data: this.dataSource,
        });
      } else {
        console.error('Could not get the 2D context of the chart element.');
      }
    } else {
      console.error('Chart element with id "myChart" not found.');
    }
  }

  createD3Chart(budgetData: { title: string; budget: number }[]) {
    const width = 800;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    // Clear any previous SVG
    d3.select('#d3Chart').selectAll('*').remove();

    // Create the new SVG
    const svg = d3
      .select('#d3jsChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal<string>()
      .domain(budgetData.map(d => d.title))
      .range(d3.schemeCategory10);

    const pie = d3
      .pie<{ title: string; budget: number }>()
      .value(d => d.budget)
      .sort(null);

    const data_ready = pie(budgetData);

    const arc = d3
      .arc<d3.PieArcDatum<{ title: string; budget: number }>>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const outerArc = d3
      .arc<d3.PieArcDatum<{ title: string; budget: number }>>()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.8);

    svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', d => color(d.data.title))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
      .attr('points', (d) => {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        posC[0] = radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return [posA, posB, posC].map(p => p.join(',')).join(' ');
      })
      .style('fill', 'none')
      .style('stroke', 'black');

    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(d => `${d.data.title} (${d.data.budget})`)
      .attr('transform', (d) => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.99 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', (d) => this.midAngle(d) < Math.PI ? 'start' : 'end')
      .style('font-size', '12px');
  }
  private midAngle(d: { startAngle: number; endAngle: number }): number {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
}
