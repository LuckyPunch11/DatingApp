import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginatedResult } from "../_models/paginations";
import { map } from "rxjs";

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
}

export function getPaginatedResult<T>(url, params, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return http.get<T>(url, { observe: 'response', params }).pipe(
        map(response => {
            paginatedResult.result = response.body;
            const headers = response.headers.get('Pagination');
            if (headers !== null) {
                paginatedResult.pagination = JSON.parse(headers);
            }
            return paginatedResult;
        })
    );
}