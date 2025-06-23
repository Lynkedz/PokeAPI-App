import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonToggle, IonInput } from '@ionic/angular/standalone';
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
    IonButtons,
    IonToggle,
    IonInput,
    CommonModule,
    FormsModule,
  ],
})
export class HomePage implements OnInit {
  selectedPokemon: any;
  pokemonId: number = 1;

  typeColors: { [key: string]: string } = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    steel: '#B7B7CE',
    fairy: '#D685AD',
    dark: '#705746',
  };

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.loadPokemon(this.pokemonId);
  }

  evolutionChain: { name: string; id: number }[] = [];

  loadPokemon(id: number) {
    this.pokeapiService.getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe(
      (details: any) => {
        this.selectedPokemon = {
          ...details,
          moves: details.moves.map((m: any) => m.move.name),
          cries: details.cries,
          forms: details.forms,
        };
        this.pokemonId = details.id;
        this.getEvolutionChain(details.species.url);
      },
      (error) => {
        console.error('Pokémon não encontrado:', error);
        this.selectedPokemon = null;
        this.evolutionChain = [];
      }
    );
  }

  getEvolutionChain(speciesUrl: string) {
    this.pokeapiService.getPokemonDetails(speciesUrl).subscribe((species: any) => {
      this.pokeapiService.getPokemonDetails(species.evolution_chain.url).subscribe((evolution: any) => {
        this.evolutionChain = this.parseEvolutionChain(evolution.chain);
      });
    });
  }

  parseEvolutionChain(chain: any): { name: string; id: number }[] {
    const evolutions: { name: string; id: number }[] = [];
    let current = chain;
    while (current) {
      const id = this.extractIdFromUrl(current.species.url);
      evolutions.push({ name: current.species.name, id: id });
      current = current.evolves_to.length > 0 ? current.evolves_to[0] : null;
    }
    return evolutions;
  }

  extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]);
  }

  onSearchInputChange(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm) {
      if (!isNaN(Number(searchTerm))) {
        this.loadPokemon(Number(searchTerm));
      } else {
        this.pokeapiService.getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`).subscribe(
          (details: any) => {
        this.selectedPokemon = {
          ...details,
          moves: details.moves.map((m: any) => m.move.name),
          cries: details.cries,
          forms: details.forms,
        };
            this.pokemonId = details.id;
            this.getEvolutionChain(details.species.url);
          },
          (error) => {
            console.error('Pokémon não encontrado:', error);
            this.selectedPokemon = null;
            this.evolutionChain = [];
          }
        );
      }
    } else {
      this.selectedPokemon = null;
    }
  }

  formatName(name: string): string {
    return name ? name.replace(/-/g, ' ') : '';
  }

  getFormattedMoveName(move: unknown): string {
    return this.formatName(String(move));
  }

  toggleTheme(event: any) {
    document.body.classList.toggle('dark', event.detail.checked);
  }
}
