// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
// import { Member } from "../_models/member";
// import { Observable } from "rxjs";
// import { inject, Injectable } from "@angular/core";
// import { MemberService } from "../_services/member.service";

// @Injectable({ providedIn: 'root' })
// export class MemberDetailedResolver implements Resolve<Member> {
//     private memberSrv = inject(MemberService);

//     resolve(route: ActivatedRouteSnapshot): Observable<Member> {
//         return this.memberSrv.getMember(route.paramMap.get('email'));
//     }
// }

import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MemberService } from '../_services/member.service';

export const memberDetailedResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const memberSrv = inject(MemberService);
    return memberSrv.getMember(route.paramMap.get('email'));
};