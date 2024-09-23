import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private budgetDataSubject = new BehaviorSubject<any[]>([]); // Observable data source
  public budgetData$ = this.budgetDataSubject.asObservable(); // Public observable for the data

  constructor(private http: HttpClient) {}

  // Fetch data from the backend only if the data hasn't been populated yet
  fetchBudgetData(): void {
    const currentData = this.budgetDataSubject.getValue();

    // Check if data is already present
    if (currentData.length === 0) {
      this.http.get('http://localhost:3000/budget').subscribe((res: any) => {
        // Update the subject with the fetched data
        this.budgetDataSubject.next(res.myBudget);
      });
    }
  }
}
