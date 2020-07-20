import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    {
        path: 'recipes',
        // loadChildren: './recipes/recipes.module.ts#RecipesModule' // old way
        loadChildren:
            () =>
                import('./recipes/recipes.module')
                    .then(m => m.RecipesModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}