import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonButtons, IonToggle } from '@ionic/angular/standalone';
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
    IonLabel,
    IonButtons,
    IonToggle,
    CommonModule,
    FormsModule
  ],
})
export class HomePage implements OnInit {
  selectedPokemon: any;

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
  }

  selectPokemonById(id: number) {
    this.pokeapiService.getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe(
      (details: any) => {
        this.selectedPokemon = details;
      },
      (error) => {
        console.error('Pokémon não encontrado:', error);
        this.selectedPokemon = null;
      }
    );
  }

  searchPokemonByName(name: string) {
    this.pokeapiService.getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`).subscribe(
      (details: any) => {
        this.selectedPokemon = details;
      },
      (error) => {
        console.error('Pokémon não encontrado:', error);
        this.selectedPokemon = null;
      }
    );
  }

  toggleTheme(event: any) {
    document.body.classList.toggle('dark', event.detail.checked);
  }

  onSearchInputChange(event: any) {
    const searchTerm = event.detail.value;
    if (searchTerm) {
      if (!isNaN(Number(searchTerm))) {
        this.selectPokemonById(Number(searchTerm));
      } else {
        this.searchPokemonByName(searchTerm);
      }
    } else {
      this.selectedPokemon = null;
    }
  }
}
