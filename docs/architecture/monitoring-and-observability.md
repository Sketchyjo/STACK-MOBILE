# **Monitoring and Observability**

  * **Monitoring Stack**:
      * **Error Tracking**: Sentry will be used for both frontend and backend error tracking.
      * **Backend Logs**: AWS CloudWatch will be used for all Lambda function logs.
      * **API Performance**: Vercel Analytics will monitor API gateway latency and traffic.
  * **Key Metrics**:
      * **Business**: Daily Active Users, Number of "Power Ups", Total Amount Invested.
      * **Performance**: API p95 Latency, App Start Time, Transaction Throughput.
      * **Health**: API Error Rate (%), Crash-free sessions (%).
