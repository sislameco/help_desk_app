import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyDto } from '../models/company.model';
@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/company`;

  // ✅ GET /api/company/active
  getActiveCompanies(): Observable<CompanyDto[]> {
    return this.http.get<CompanyDto[]>(`${this.baseUrl}/active`);
  }
  // ✅ GET single company by ID
  getCompanyById(id: number): Observable<CompanyDto> {
    return this.http.get<CompanyDto>(`${this.baseUrl}/${id}`);
  }
  // ✅ UPDATE company
  updateCompany(id: number, dto: CompanyDto): Observable<CompanyDto> {
    return this.http.put<CompanyDto>(`${this.baseUrl}/${id}`, dto);
  }
}
