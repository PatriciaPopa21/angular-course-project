import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {

    constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // preventing the resolver from overwriting our recipes, if we already have some
        const recipes = this.recipeService.getRecipes();

        if (recipes.length > 0) {
            return recipes;
        }

        return this.dataStorageService.fetchRecipes(); // the Resolver will subscribe for us
    }
}