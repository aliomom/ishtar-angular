import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArtistService} from '../../../service/artist/artist.service';
import {Subscription} from 'rxjs';
import {ArtistListResponse} from '../../../entity/ArtistList/artist-list-response';
import {ArtistInterface} from '../../../entity/artist/artist-interface';
import {ToastrService} from 'ngx-toastr';
import {ArtistsList} from '../../../entity/artist/artists-list';

@Component({
  selector: 'app-list-artist',
  templateUrl: './list-artist.component.html',
  styleUrls: ['./list-artist.component.scss']
})
export class ListArtistComponent implements OnInit, OnDestroy {
  public artists: {0: ArtistInterface, path: string, artType: string}[];
  allArtistObservable: Subscription;
  artistsList: ArtistsList[] = [];
  config: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private toaster: ToastrService,
              private artist: ArtistService ) { }

  ngOnInit() {
    this.getArtists();
  }

  ngOnDestroy() {
    this.allArtistObservable.unsubscribe();
  }

  getArtists() {
    // Fetch All Artists
    this.allArtistObservable = this.artist.getAllArtists().subscribe(
        (data: ArtistListResponse) => {
          if (data) {
            this.artists = data.Data;
            for (const artist of this.artists) {
              this.artistsList.push({
                id: +artist['0'].id,
                name: artist['0'].name,
                nationality: artist['0'].nationality,
                residence: artist['0'].residence,
                birthDate: artist['0'].birthDate,
                Facebook: artist['0'].Facebook,
                Instagram: artist['0'].Instagram,
                Linkedin: artist['0'].Linkedin,
                Twitter: artist['0'].Twitter,
                path: artist.path,
                artType: artist.artType,
                details: artist['0'].details,
                story: artist['0'].story,
              });
            }
            console.log(data);
          }
        }, error1 => {
          // TODO think if there is some to do here ex : display message if there is error
          console.log('Error :', error1);
        });

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.artistsList.length
    };
  }


  // Fetch The Page Number On Page Change
  pageChanged(event) {
    this.config.currentPage = event;
  }

  // Delete The Artist
  delete(artistId: number) {
    if (confirm('Are You Sure You Want To Delete This Artist')) {
      this.artist.deleteArtist(artistId).subscribe(
          data => {
            this.toaster.success('Artist Successfully Deleted');
            console.log('deleted Successfully: ', data);
          },
          error => {
            console.log('error : ', error);
            this.toaster.error('There Is An Error Please Try Again');
          }, () => {
            this.getArtists();
          }
      );
    } else {
      return false;
    }
  }

}
