import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
        stages: [
        {duration: '30s', target:20}, //ramp upto 20 concurrent users
        {duration: '1m', target: 20}, //hold at 20
        {duration: '30s', target: 50}, // ramp up to 50
        {duration: '1m', target: 0}, // ramp down
        ],
        thresholds: {
          http_req_duration: ['p(95)<500'], // 95% of requests should finish under 500ms
          http_req_failed: ['rate<0.01'], //fewer than 1% of requests should fail
        },
 };

 export default function(){
   const res = http.get('http://localhost:8080/products');
   check(res, {
   'status is 200': (r) => r.status === 200,
   });
   sleep(1);
 }