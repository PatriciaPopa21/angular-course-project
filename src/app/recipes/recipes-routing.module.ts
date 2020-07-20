import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeResolverService } from './recipes-resolver.service';

const routes: Routes = [
    {
        path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard], children: [
            { path: '', component: RecipeStartComponent, resolve: [RecipeResolverService] },
            { path: 'new', component: RecipeStartComponent },
            { path: ':id', component: RecipeStartComponent, resolve: [RecipeResolverService] },
            { path: ':id/edit', component: RecipeStartComponent, resolve: [RecipeResolverService] }
        ]
    }
];

@NgModule({
    /* instead of forRoot, which must only be used once */
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule { }
