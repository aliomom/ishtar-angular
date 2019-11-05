import { Component, OnInit } from '@angular/core';
import {StatueService} from '../../../service/statue/statue.service';
import {StatuesResponse} from '../../../entity/statue/statues.response';
import {StatueInterface} from '../../../entity/statue/statue.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Statue} from '../../../entity/statue/statue';

@Component({
  selector: 'app-list-statue',
  templateUrl: './list-statue.component.html',
  styleUrls: ['./list-statue.component.scss']
})
export class ListStatueComponent implements OnInit {
  statues: {0: StatueInterface, price: string}[];
  statuesList: Statue[] = [];
  config: any;

  constructor(private statueService: StatueService,
              private route: Router,
              private activatedRoute: ActivatedRoute,
              private toaster: ToastrService) { }

  ngOnInit() {
    this.getStatues();
  }

  getStatues() {
    // Get All Statues
    this.statueService.getAllStatues().subscribe(
        (data: StatuesResponse) => {
          this.statues = data.Data;
          for (const statue of this.statues) {
            this.statuesList.push({
              id: statue['0'].id,
              name: statue['0'].name,
              image: statue['0'].image,
              artist: statue['0'].artist.name,
              height: statue['0'].height,
              width: statue['0'].width,
              weight: statue['0'].weight,
              length: statue['0'].length,
              state: statue['0'].state,
              description: statue['0'].description,
              style: statue['0'].style,
              period: statue['0'].period,
              mediums: statue['0'].mediums,
              material: statue['0'].material,
              features: statue['0'].features,
              active: statue['0'].active,
              keyWord: statue['0'].keyWord,
              price: statue.price,
              createDate: statue['0'].createDate,
              createdBy: statue['0'].createdBy,
              updatedDate: statue['0'].updatedBy,
              updatedBy: statue['0'].updatedBy
            });
          }
          console.log('Admin Statues: ', this.statues);
        }, error => {
          console.log(error);
        }
    );

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.statuesList.length
    };
  }

  // Fetch The Page Number On Page Change
  pageChanged(event) {
    this.config.currentPage = event;
  }

  delete(id: number) {
    if (confirm('Are You Sure You Want To Delete This Statue')) {
      this.statueService.deleteStatue(id).subscribe(
          data => {
            this.toaster.success('Statue Successfully Deleted');
            console.log('deleted Successfully: ', data);
          },
          error => {
            console.log('error : ', error);
            this.toaster.error('There Is An Error Please Try Again');
          }, () => {
            this.getStatues();
          }
      );
    } else {
      return false;
    }
  }


}
