import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sale-list',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './sale-list.html',
  styleUrl: './sale-list.css',
})
export class SaleList implements OnInit {
  private destroyRef = inject(DestroyRef);
  private saleService = inject(SaleService);

  sales = this.saleService.sales;
  // summaries = this.saleService.summaries;

  loading = signal<boolean>(true);
  summaryLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  summaryError = signal<string | null>(null);
  expandedSaleId = signal<string | null>(null);
  saleToDelete = signal<string | null>(null);

  ngOnInit(): void {
    this.saleService
      .loadSales()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Error al cargar las ventas.');
        },
      });

    // this.orderService
    //   .loadSummary()
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: () => {
    //       this.summaryLoading.set(false);
    //     },
    //     error: () => {
    //       this.summaryLoading.set(false);
    //       this.summaryError.set('Error al cargar resumen del mes.');
    //     },
    //   });
  }

  toggleSale(id: string) {
    if (this.expandedSaleId() === id) {
      this.expandedSaleId.set(null);
    } else {
      this.expandedSaleId.set(id);
    }
  }

  monthName(month: number): string {
    if (month < 1 || month > 12) {
      return 'Invalid month';
    }

    return [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ][month - 1];
  }

  openDeleteModal(id: string) {
    this.saleToDelete.set(id);
  }

  closeDeleteModal() {
    this.saleToDelete.set(null);
  }

  confirmDelete() {
    const id = this.saleToDelete();
    if (id) {
      this.saleService
        .deleteSale(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.closeDeleteModal();
          },
          error: () => {
            this.closeDeleteModal();
            this.error.set('Error al eliminar la venta');
          },
        });
    }
  }
}
