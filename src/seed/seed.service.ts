import { Injectable } from '@nestjs/common';
import { PokemonResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const pokemonToInsert: { name: string, no: number }[] = [];

    const data = await this.http.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    data.results.forEach(async({ name, url }) => {
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];
      pokemonToInsert.push({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return `Seed executed`;
  }
}
