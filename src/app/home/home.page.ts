import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonRow, IonCol, IonImg } from '@ionic/angular/standalone';
import { PokeapiService } from '../services/pokeapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    CommonModule,
    FormsModule
  ],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  offset = 0;
  limit = 20;
  searchTerm: string = '';

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    this.pokeapiService.getPokemon(this.offset, this.limit).subscribe((data: any) => {
      const newPokemons = data.results;
      newPokemons.forEach((pokemon: any) => {
        this.pokeapiService.getPokemonDetails(pokemon.url).subscribe((details: any) => {
          this.pokemons.push(details);
          this.filteredPokemons = [...this.pokemons]; // Update filtered list
        });
      });
      this.offset += this.limit;
      if (event) {
        event.target.complete();
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.filterPokemons();
  }

  filterPokemons() {
    if (this.searchTerm === '') {
      this.filteredPokemons = [...this.pokemons];
    } else {
      this.filteredPokemons = this.pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  loadData(event: any) {
    this.loadPokemons(event);
  }
}
