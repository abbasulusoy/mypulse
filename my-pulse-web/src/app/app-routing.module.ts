import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SearchResultsComponent} from './search-results/search-results.component';
import {PatientDataSheetComponent} from './patient-data-sheet/patient-data-sheet.component';
import {PatientEditDataComponent} from './patient-edit-data/patient-edit-data.component';


const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: 'search-results', component: SearchResultsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '***', redirectTo: '/home', pathMatch: 'full'},
  {path: "edit", component: PatientEditDataComponent},
  {path: "patient/:id", component: PatientDataSheetComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
