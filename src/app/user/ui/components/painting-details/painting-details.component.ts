import {Component, Input, OnInit} from '@angular/core';
import {PaintingDetails} from '../../../entity/painting-details/painting-details';
import {PaintingListItem} from '../../../entity/painting-list/painting-list-item';
import {PaintingListService} from '../../../service/painting-list/painting-list.service';
import {PaintingViewsService} from '../../../service/painting-views/painting-views.service';
import {PaintingViewsItem} from '../../../entity/painting-views/painting-views-item';
import {IshtarInteractionService} from '../../../service/ishtar-interaction/ishtar-interaction.service';
import {ToastrService} from 'ngx-toastr';
import {ArtistListService} from '../../../service/artist-list/artist-list.service';

@Component({
  selector: 'app-painting-details',
  templateUrl: './painting-details.component.html',
  styleUrls: ['./painting-details.component.scss']
})
export class PaintingDetailsComponent implements OnInit {
  @Input() painting: PaintingDetails;
  featuredList: PaintingListItem[];
  paintingViews: PaintingViewsItem;
  artistID: number;


  constructor(private paintingService: PaintingListService,
              private paintingViewsService: PaintingViewsService,
              private interactionService: IshtarInteractionService,
              private artistListService: ArtistListService,
              private toaster: ToastrService) {
    // this.activePaintingImage = this.painting.image;
  }

  ngOnInit() {
    // Fetch Artist ID
    this.artistListService.requestArtistList().subscribe(
      data => {
        data.Data.map(res => {
          if (res.name === this.painting.artist) {
            this.artistID = res.id;
          }
        });
      }
    );
    console.log(this.artistID);
    this.paintingService.requestPaintingList().subscribe(
      data => {
        this.featuredList = data.Data;
      }
    );

    if (document.readyState === 'complete') {
      if (this.painting.name == null) {
        document.getElementById('painting-name').style.display = 'none';
      }

      if ((this.painting.height == null) || (this.painting.width == null)) {
        document.getElementById('painting-size').style.display = 'none';
      }

      if (this.painting.colorsType == null) {
        document.getElementById('painting-type').style.display = 'none';
      }

      if (this.painting.story == null) {
        document.getElementById('painting-story').style.display = 'none';
      }

      if (this.painting.artist == null) {
        document.getElementById('painting-artist').style.display = 'none';
      }

      /* var painting_list_images = document.getElementById('painting-list-images').childElementCount;
       alert(painting_list_images);
       if (painting_list_images < 2) {
         document.getElementById('painting-list-images').style.opacity = '0';
       }*/

    }
  }

  addToWishList() {
    this.interactionService.addToWishList(`${this.painting.id}`, 'painting');
    this.toaster.success('Painting Added To Your Wish List');
  }


  setMainPainting(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    const paintingSrc = target.attributes.src;
    const value = paintingSrc.nodeValue;
    const mainImage = document.getElementById('main-img');
    mainImage.setAttribute('src', value);
    document.getElementById('full-size-img').setAttribute('src', value);

  }

  showImageInFullSize() {
    document.getElementById('full-size-img').classList.add('active');
  }

  hideFullScreenMode() {
    document.getElementById('full-size-img').classList.remove('active');
  }

  scrollUp() {
    window.scroll(0, 0);
  }
}
