import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileManagementService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/file`;
  /**
   * Uploads one or more files to the server
   * @param files - Array of File objects
   */
  uploadFiles(files: File[]): Observable<number[]> {
    const formData = new FormData();

    for (const file of files) {
      formData.append('fileList', file); // Must match [FromForm] List<IFormFile> fileList
    }

    return this.http.post<number[]>(`${this.baseUrl}`, formData);
  }
}
