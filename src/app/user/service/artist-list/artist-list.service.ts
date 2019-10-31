import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UserConfig} from '../../UserConfig';
import {ArtistListResponse} from '../../entity/artist-list/artist-list-response';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaintingListService } from '../painting-list/painting-list.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistListService {

  constructor(private httpClient: HttpClient) {
  }

  public static errorHandler(error: HttpErrorResponse) {
    return throwError(error || 'Server Error');
  }

  
  requestArtistList() {
    return this.httpClient.get<ArtistListResponse>(
      `${UserConfig.ArtistListAPI}`, {responseType: 'json'}
    );
  }

  requestPaintingList() {
    return this.httpClient.get<ArtistListResponse>(
      `${UserConfig.ArtistListAPI}`, {responseType: 'json'}
    );
  }

  requestPaintingListByArtType(id: string) {
    return this.httpClient.post<ArtistListResponse>(
      UserConfig.getByAPI,
      {
        parm: 'artist',
        value: id
      }
    );
  }
  
 /*
 requestArtistList() {
    return this.httpClient.get<ArtistListResponse>(
      `${UserConfig.artistsAPI}`, {responseType: 'json'}
    ).pipe(catchError(PaintingListService.errorHandler));
  }

  requestPaintingList() {
    return this.httpClient.get<ArtistListResponse>(
      `${UserConfig.artistsAPI}`, {responseType: 'json'}
    ).pipe(catchError(PaintingListService.errorHandler));
  }

  requestPaintingListByArtType(id: string) {
    return this.httpClient.post<ArtistListResponse>(
      `${UserConfig.artistAPI}/${id}`,
      {
        parm: 'artist',
        value: id
      }
    );
  }
*/
}
