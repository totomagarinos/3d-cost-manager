import { inject, Injectable, signal } from '@angular/core';
import { CreateSaleDTO, Sale } from '../models/sale.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private _sales = signal<Sale[]>([]);

  sales = this._sales.asReadonly();

  baseUrl = environment.salesApiUrl;
  http: HttpClient = inject(HttpClient);

  createSale(saleDTO: CreateSaleDTO): Observable<Sale> {
    return this.http.post<Sale>(this.baseUrl, saleDTO).pipe(
      tap((newSale) => {
        this._sales.update((prev) => [newSale, ...prev]);
      }),
    );
  }

  loadSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.baseUrl).pipe(tap((sales) => this._sales.set(sales)));
  }

  deleteSale(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._sales.update((sales) => sales.filter((s) => s.id !== id));
      }),
    );
  }
}
