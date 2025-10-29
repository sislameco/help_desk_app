import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationExtras,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Search } from '../search/search';
import { AuthStore } from '@core/store/auth-store/auth.store';
import { SubMenuu } from '@core/layout/pages/authorized-layout/authorized-sidebar/sidebar-data-type';

// type RouteActionConfig = {
//   search?: boolean;
//   viewArchive?: boolean;
//   export?: boolean;
//   more?: boolean;
//   preview?: boolean;
// };

// type BreadcrumbItem = { label: string; link?: string | never[] };

// type HeaderRouteData = {
//   title?: string;
//   breadcrumb?: (string | BreadcrumbItem)[];
//   backTo?: string | never[] | null;
//   actions?: RouteActionConfig;
// };
@Component({
  selector: 'app-breadcrumbs',
  imports: [Search, ReactiveFormsModule, BsDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumbs {
  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  menuName = input<string>();
  crumbs = input<string[]>();

  showBackButton = input<boolean>();
  backTo = signal<string | never[] | null>(null);

  showSearch = input<boolean>();

  readonly activeMenuAndSubMenu = computed(() => {
    this.currentUrl();
    const menus = this.authStore.menus();
    for (const item of menus) {
      if (
        item.route &&
        this.router.isActive('/' + item.route, {
          paths: 'subset',
          queryParams: 'ignored',
          fragment: 'ignored',
          matrixParams: 'ignored',
        })
      ) {
        return item.menuName;
      }
      if (item.subMenus) {
        for (const sub of item.subMenus) {
          if (
            sub.route &&
            this.router.isActive('/' + sub.route, {
              paths: 'subset',
              queryParams: 'ignored',
              fragment: 'ignored',
              matrixParams: 'ignored',
            })
          ) {
            return item.menuName + ' / ' + sub.menuName;
          }
        }
      }
    }
    return '';
  });
  readonly activeMenuName = computed(() => {
    this.currentUrl();
    const menus = this.authStore.menus();
    for (const item of menus) {
      if (
        item.route &&
        this.router.isActive('/' + item.route, {
          paths: 'subset',
          queryParams: 'ignored',
          fragment: 'ignored',
          matrixParams: 'ignored',
        })
      ) {
        return item.menuName;
      }
      if (item.subMenus) {
        for (const sub of item.subMenus) {
          if (
            sub.route &&
            this.router.isActive('/' + sub.route, {
              paths: 'subset',
              queryParams: 'ignored',
              fragment: 'ignored',
              matrixParams: 'ignored',
            })
          ) {
            return sub.menuName;
          }
        }
      }
    }
    return '';
  });

  goBack() {
    const target = this.backTo();
    if (target) {
      if (typeof target === 'string') {
        this.router.navigateByUrl(target).then();
      } else {
        this.router.navigate(target as never[], { relativeTo: this.route }).then();
      }
    } else {
      // Fallback if backTo is not provided
      window.history.back();
    }
  }

  searchAction(search: string) {
    const extras: NavigationExtras = {
      queryParams: { search },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    };
    this.router.navigate([], extras).then();
  }

  // Signal to track current url
  readonly currentUrl = signal(this.router.url);

  // Listen to route changes and update currentUrl signal
  constructor() {
    this.router.events.subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  isSubMenuActiveSignal = (subMenus: SubMenuu[] | undefined) =>
    computed(() => {
      if (!subMenus) {
        return false;
      }
      return subMenus.some((sub) =>
        this.router.isActive('/' + sub.route, {
          paths: 'subset',
          queryParams: 'ignored',
          fragment: 'ignored',
          matrixParams: 'ignored',
        }),
      );
    });
  // private route = inject(ActivatedRoute);
  // private router = inject(Router);
  // protected readonly ActivationStatusEnum = ActivationStatusEnum;
  // private readonly commonService = inject(CommonService);
  // // Existing inputs (used as fallback when route data doesn't define actions)
  // isSearchButton = input<boolean>(false);
  // isViewArchiveButton = input<boolean>(false);
  // isExportButton = input<boolean>(false);
  // isMoreButton = input<boolean>(false);
  // isPreviewButton = input<boolean>(false);
  // searchString = output<string>();
  // // Query param bound search
  // searchControl = new FormControl('');
  // searchText = signal('');
  // status = signal(ActivationStatusEnum.Active);
  // // Route-data driven header state
  // title = signal<string>('');
  // crumbs = signal<BreadcrumbItem[]>([]);
  // backTo = signal<string | never[] | null>(null);
  // private routeActions = signal<RouteActionConfig | null>(null);
  // // Effective action visibility (route data has priority, then inputs)
  // showSearchButton = computed<boolean>(() => {
  //   const a = this.routeActions();
  //   return a?.search ?? this.isSearchButton();
  // });
  // showViewArchiveButton = computed<boolean>(() => {
  //   const a = this.routeActions();
  //   return a?.viewArchive ?? this.isViewArchiveButton();
  // });
  // showExportButton = computed<boolean>(() => {
  //   const a = this.routeActions();
  //   return a?.export ?? this.isExportButton();
  // });
  // showMoreButton = computed<boolean>(() => {
  //   const a = this.routeActions();
  //   return a?.more ?? this.isMoreButton();
  // });
  // showPreviewButton = computed<boolean>(() => {
  //   const a = this.routeActions();
  //   return a?.preview ?? this.isPreviewButton();
  // });
  // constructor() {
  //   // 🔍 Emit search value changes (debounced)
  //   this.searchControl.valueChanges
  //     .pipe(debounceTime(400), distinctUntilChanged())
  //     .subscribe((value) => this.searchString.emit(value ?? ''));
  //   // 🔗 Sync with query params
  //   this.route.queryParams.subscribe((params) => {
  //     const status: ActivationStatusEnum = Number(params['status']) || ActivationStatusEnum.Active;
  //     this.status.set(status);
  //     const search = params['search'] ?? '';
  //     this.searchText.set(search);
  //     this.searchControl.setValue(search, { emitEvent: false });
  //   });
  //   // 🧭 Read header config from the deepest active route on navigation
  //   this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
  //     this.updateHeaderFromRoute();
  //   });
  //   // Initialize on first render
  //   this.updateHeaderFromRoute();
  // }
  // private deepestSnapshot(start: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  //   let snap = start;
  //   while (snap.firstChild) {
  //     snap = snap.firstChild;
  //   }
  //   return snap;
  // }
  // private toCrumbs(items?: (string | BreadcrumbItem)[] | undefined): BreadcrumbItem[] {
  //   if (!items || !Array.isArray(items)) {
  //     return [];
  //   }
  //   return items.map((i) => (typeof i === 'string' ? { label: i } : i));
  // }
  // crumbTrail = computed(() =>
  //   this.crumbs()
  //     .map((c) => c.label)
  //     .join(' / '),
  // );
  // private updateHeaderFromRoute() {
  //   const snap = this.deepestSnapshot(this.route.snapshot);
  //   const data = (snap.data ?? {}) as HeaderRouteData;
  //   this.title.set(data.title ?? '');
  //   this.crumbs.set(this.toCrumbs(data.breadcrumb));
  //   this.backTo.set(data.backTo ?? null);
  //   this.routeActions.set(data.actions ?? null);
  // }
  // goBack() {
  //   const target = this.backTo();
  //   if (target) {
  //     if (typeof target === 'string') {
  //       this.router.navigateByUrl(target).then();
  //     } else {
  //       this.router.navigate(target as never[], { relativeTo: this.route }).then();
  //     }
  //   } else {
  //     // Fallback if backTo is not provided
  //     window.history.back();
  //   }
  // }
  // clearSearch() {
  //   this.searchText.set('');
  //   this.searchControl.setValue('');
  // }
  // // todo need to separate
  // toggleArchiveView() {
  //   const nextStatus =
  //     this.status() === ActivationStatusEnum.Active
  //       ? ActivationStatusEnum.Inactive
  //       : ActivationStatusEnum.Active;
  //   this.router
  //     .navigate([], {
  //       queryParams: { status: nextStatus, pageSize: DEFAULT_PAGE_SIZE },
  //       queryParamsHandling: 'replace',
  //     })
  //     .then();
  // }
  // onBatchEditClick() {
  //   this.commonService.isBatchEditMode.next(true);
  // }
  // onUploadSupplierProduct() {
  //   this.commonService.importAllSupplierProducts.next(true);
  // }
  // onImportProduct() {
  //   this.commonService.isImportProducts.next(true);
  // }
}
