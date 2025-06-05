// src/app/custom-reuse.strategy.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy
} from '@angular/router';

@Injectable()
export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedHandles = new Map<string, DetachedRouteHandle>();

  // Only detach (cache) when leaving 'home/*'
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteUrl(route);
    console.log('shouldDetach:', url);
    // return url === 'home/data' || url === 'home/map';
    return url.includes('home/');
  }

  // Store the handle in our Map
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getFullRouteUrl(route);
    this.storedHandles.set(key, handle);
  }

  // If we have a stored handle for the incoming route, we want to re‐attach
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getFullRouteUrl(route);
    return this.storedHandles.has(key);
  }

  // Return the previously stored handle (or null)
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getFullRouteUrl(route);
    return this.storedHandles.get(key) || null;
  }

  // Default reuse: only if the route config is the same
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  // Build a simple string key like "home/*"
  private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
    let path = route.routeConfig && route.routeConfig.path ? route.routeConfig.path : '';
    let parent = route.parent;
    while (parent) {
      if (parent.routeConfig && parent.routeConfig.path) {
        path = parent.routeConfig.path + '/' + path;
      }
      parent = parent.parent;
    }
    return path;
  }
}
