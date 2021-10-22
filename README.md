# Charts-aggregator

# Create .env
```
DB_HOST=localhost
DB_USER=
DB_PASS=
DB_NAME=FundsChartsBSC
PORT=9011
DELAY=86400
WEB3_PROVIDER=https://bsc-dataseed1.defibit.io
```


# Create DB

```
CREATE DATABASE FundsChartsBSC;

CREATE TABLE funds(address VARCHAR(128), balance JSON, PRIMARY KEY(address));
```
