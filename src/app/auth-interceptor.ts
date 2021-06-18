import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor {
    
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
  
        const modifiedRequest = req.clone({headers: req.headers.append('Auth', '123')});
       return next.handle(modifiedRequest);
    }


    
}