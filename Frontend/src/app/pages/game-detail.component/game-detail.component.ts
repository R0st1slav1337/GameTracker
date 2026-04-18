import {Component, inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.css'
})
export class GameDetailComponent {

  route = inject(ActivatedRoute);



  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      console.log(params);
      const id = params.get('id')
    })
  }


}
