import { Injectable } from '@angular/core';
import { InteractionsManagerService } from '../manager/interactions-manager.service';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserInfo } from '../../entity-protected/profile/user-info';
import { LoginPageComponent } from '../../ui/Pages/login-page/login-page.component';
import { MatDialog } from '@angular/material';
import { ClientInteractionListItem } from '../entity/client-interaction-list-item';
import { UserService } from '../../shared/user/service/user.service';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {
  protected userInfo: UserInfo = null;
  constructor(protected interactionsManagerService: InteractionsManagerService,
              protected userService: UserService,
              protected dialog: MatDialog) {
  }

  /**
   * Gets the total number of iteractions performed on a specific painting/artist
   * @param entityCode InteractionConsts.ENTITY_TYPE...
   * @param row number
   * @param interactionsCode number
   */
  getInteractionsNumber(entityCode: number, row: number, interactionsCode: number): Observable<number> {
    const interactionSubject = new Subject<number>();
    this.interactionsManagerService.getInteractionsNumber(entityCode, row, interactionsCode)
      .pipe(
        catchError(() => {
          interactionSubject.error('Error Getting Data');
          return EMPTY;
        }))
      .subscribe(
        interactionResponse => {
          // Send Data If Successfully Fetching
          interactionSubject.next(interactionResponse.Data.interactions);
        }
      );
    // Return The Data To Print It In Component
    return interactionSubject.asObservable();
  }

  /**
   * This function returns the interactions of the user
   * @param clientId number
   * @param parentType painting, artist, statue
   * @param rowId number
   */
  getClientInteraction(entityId: number): Observable<ClientInteractionListItem[]> {
    const interactionSubject = new Subject<ClientInteractionListItem[]>();

    if (!this.checkUserDetailsExists()) {
      interactionSubject.error('Please Login');
    }

    // check if user is login or not
    this.interactionsManagerService.getClientInteraction(this.userInfo.id)
      .pipe(catchError(err => {
        interactionSubject.error('Error Getting Data');
        return EMPTY;
      }))
      .subscribe(
        clientInteractionResponse => {
          interactionSubject.next(clientInteractionResponse.Data.filter(
            a => {
              // This will make sure that only the specific painting interactions exists
              return a.id === entityId;
            }
          ));
        }
      );

    return interactionSubject.asObservable();
  }

  /**
   * posts the interaction to the API
   * @param entityCode InteractionConsts.ENTITY_TYPE...
   * @param entityId number
   * @param interactionsCode InteractionConsts.INTERACTION_TYPE_...
   */
  postInteractionToAPI(entityCode: number, entityId: number,
                       interactionsCode: string): Observable<boolean> {
    const interactionSubject = new Subject<boolean>();
    this.interactionsManagerService.postInteractions(entityCode, entityId, this.userInfo.id, interactionsCode)
      .pipe(catchError(err => {
        interactionSubject.error('Error Getting Data From API');
        return EMPTY;
      }))
      .subscribe(
        postInteractionResponse => {
          interactionSubject.next(true);
        }, error => {
          console.log(JSON.stringify(error));
          interactionSubject.next(false);
        }
      );

    return interactionSubject.asObservable();
  }

  getClientClap(): Observable<number> {
    const interactionSubject = new Subject<number>();

    if (!this.checkUserDetailsExists()) {
      interactionSubject.error('Please Login');
      return interactionSubject.asObservable();
    }

    this.interactionsManagerService.getClientClap(this.userInfo.id).subscribe(
      clapInteractionsResponse => {
        if (clapInteractionsResponse.Data.value) {
          interactionSubject.next(clapInteractionsResponse.Data.value);
        } else {
          interactionSubject.next(0);
        }
      }
    );
    return interactionSubject.asObservable();
  }

  /**
   * posts Claps to the API
   * @param entityCode number InteractionConsts.ENTITY_TYPE_...
   * @param entityId number
   * @param clapValue number
   */
  postClapToAPI(entityCode: number, entityId: number, clapValue: number): Observable<number> {
    const interactionSubject = new Subject<number>();
    if (this.userInfo === null) {
      interactionSubject.error('Please Login First!');
      return interactionSubject.asObservable();
    }
    this.interactionsManagerService.postClap(entityCode, entityId, clapValue, this.userInfo.id)
      .pipe(catchError(err => {
        interactionSubject.error('Error Getting Data');
        console.log(JSON.stringify(err));
        return EMPTY;
      }))
      .subscribe(
        createClapResponse => {
          if (createClapResponse.Data.value) {
            interactionSubject.next(createClapResponse.Data.value);
          } else {
            interactionSubject.next(0);
          }
        }
      );

    return interactionSubject.asObservable();
  }

  /**
   * this will delete the interaction from the API
   * @param interactionID number
   */
  deleteInteraction(interactionID: number): Observable<boolean> {
    const interactionSubject = new Subject <boolean>();
    if (this.checkUserDetailsExists()) {
      this.interactionsManagerService.deleteInteractions(interactionID)
        .pipe(catchError(err => {
          interactionSubject.error('Error Getting Data');
          return EMPTY;
        }))
        .subscribe(
          () => {
            interactionSubject.next(false);
          }
        );
    }
    return interactionSubject.asObservable();
  }

  // Delete Clap Interaction
  deleteClap(interactionID: number): Observable<boolean> {
    const interactionSubject = new Subject <boolean>();
    if (this.checkUserDetailsExists()) {
      this.interactionsManagerService.deleteClap(interactionID)
        .pipe(catchError(err => {
          interactionSubject.error('Error Getting Data');
          console.log(err);
          return EMPTY;
        }))
        .subscribe(
          () => {
            interactionSubject.next(true);
          }, err => {
            interactionSubject.next(false);
            console.log(err);
          }
        );
    }

    return interactionSubject.asObservable();
  }

  // Region Class To Open Dialog If User Not Login
  openDialog() {
    return this.dialog.open(LoginPageComponent, {
      minWidth: '100vw',
      hasBackdrop: true
    });
  }

  // region Class Specific Validators
  checkUserDetailsExists(): boolean {
    if (this.userInfo !== null) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * sets client info
   */
  setClientInfoIfExists(): void {
    this.userService.getUserInfo().subscribe(
      userInfo => {
        this.userInfo = userInfo;
      }
    );
  }
}
