import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { AppProductComponent } from './product-table/product.component';
import { AppCollectionComponent } from './collections-table/collection.component';
import { AppProductDetailsComponent } from './product-details-table/product-details.component';
import { AppBillComponent } from './bills-table/bill.component';
import { AppPaymentMethodComponent } from './payment-methods/payment-methods.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'badge',
        component: AppBadgeComponent,
      },
      {
        path: 'chips',
        component: AppChipsComponent,
      },
      {
        path: 'lists',
        component: AppListsComponent,
      },
      {
        path: 'menu',
        component: AppMenuComponent,
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
      {
        path: 'forms',
        component: AppFormsComponent,
      },
      {
        path: 'usuarios',
        component: AppTablesComponent,
      },
      {
        path: 'productos',
        component: AppProductComponent,
      },
      {
        path: 'detalles-de-productos',
        component: AppProductDetailsComponent,
      },
      {
        path: 'puntos-recoleccion',
        component: AppCollectionComponent,
      },
      {
        path: 'facturas',
        component: AppBillComponent,
      },
      {
        path: 'medios-de-pago',
        component: AppPaymentMethodComponent,
      },
    ],
  },
];
