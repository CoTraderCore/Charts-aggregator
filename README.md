# Charts-aggregator
```
create .env

WEB3_PROVIDER=https://bsc-dataseed1.defibit.io
```


# Create DB

```
CREATE DATABASE FundsChartsBSC;

CREATE TABLE funds(address VARCHAR(128), balance JSON, PRIMARY KEY(address));
```
