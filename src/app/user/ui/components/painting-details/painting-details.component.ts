import {Component, Input, OnInit} from '@angular/core';
import {PaintingDetails} from '../../../entity/painting-details/painting-details';
import {PaintingListItem} from '../../../entity/painting-list/painting-list-item';
import {PaintingListService} from '../../../service/painting-list/painting-list.service';
import {IshtarInteractionService} from '../../../service/ishtar-interaction/ishtar-interaction.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-painting-details',
  templateUrl: './painting-details.component.html',
  styleUrls: ['./painting-details.component.scss']
})
export class PaintingDetailsComponent implements OnInit {
  @Input() painting: PaintingDetails;
  featuredList: PaintingListItem[];

  paintingLiked = false;
  paintingClapped = false;

  constructor(private paintingService: PaintingListService,
              private interactionService: IshtarInteractionService,
              private toaster: ToastrService) {
  }

  ngOnInit() {
    this.paintingService.requestPaintingList().subscribe(
      data => {
        this.featuredList = data.Data;
      }
    );
  }

  clapThePainting() {
    this.interactionService.love(`${this.painting.id}`, 'painting');
    this.paintingClapped = true;
    this.toaster.success('Painting Clapped');
  }

  loveThePainting() {
    this.interactionService.love(`${this.painting.id}`, 'painting');
    this.paintingLiked = true;
    this.toaster.success('Painting Loved');
  }

  addToWishList() {
    this.interactionService.addToWishList(`${this.painting.id}`, 'painting');
    this.toaster.success('Painting Added To Your Wish List');
  }

}
